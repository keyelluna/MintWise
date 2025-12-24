const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Supabase/Vercel
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/profiles/');
    },
    filename: (req, file, cb) => {
       const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, or GIF is allowed.'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your_secret_key', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using https
}));

// Routes


app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, isStudent, position } = req.body;

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
        console.error("Password Hashing Error:", hashError);
        return res.status(500).json({ message: 'Internal server error during processing.' });
    }

    const query = 'INSERT INTO users (first_name, last_name, email, password, is_student, position) VALUES ($1, $2, $3, $4, $5, $6)';
    const selectQuery = 'SELECT id, first_name, last_name, email, is_student, position FROM users WHERE email = $1'; // Select all needed columns, excluding password


   try {
        // Use await with the promise-based db.query
        await db.query(query, [firstName, lastName, email, hashedPassword, isStudent, position]);

        const results = await db.query(selectQuery, [email]);

        if (results.rows.length === 0) {
             // This case should theoretically not happen right after a successful insert
             return res.status(500).json({ message: 'User created but could not be retrieved.' });
        }

        const user = results.rows[0];
        
        // Success response
        req.session.user_id = user.id;

        return res.status(201).json({ 
            message: 'User created successfully',
            user:user 
        });
        
    } catch (err) {
        // Log the error for server-side debugging
        console.error('Signup Database Error:', err); 

        // Handle the specific Duplicate Entry error using the error code
        if (err.code === '23505') {
            // Return 409 Conflict, or 400 Bad Request if preferred. 
            // 409 is semantically better for constraint violation.
            return res.status(409).json({ message: 'Email already exists. Please login or use a different email.' });
        }
        
        // Handle all other internal database errors
        return res.status(500).json({ message: 'Database error occurred during sign-up.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const selectQuery = 'SELECT * FROM users WHERE email = $1';

    try {
        // Use the selectQuery to fetch the user record (including the hashed password)
        const results = await db.query(selectQuery, [email]);

        // Check if a user with that email exists
        if (results.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = results.rows[0];

        // 2. Use bcrypt.compare() to verify the plaintext password against the hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Password does not match the stored hash
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Login successful!
        req.session.user_id = user.id;

        // **Security Note:** Never send the password hash back to the client.
        // We exclude the 'password' property from the user object sent in the response.
        const { password: _, ...userData } = user;

        res.json({ message: 'Login successful', user: userData });

    } catch (err) {
        console.error('Login Database Error:', err);
        res.status(500).json({ message: 'Database error' });
    }


   
});

app.post('/api/transaction', async (req, res) => {
    const { userId, transactionType, amount} = req.body;

    if (!userId || !transactionType || !amount) {
        return res.status(400).json({ error: 'Missing required fields: userId, transactionType, or amount.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    try {
        // Check balance for withdrawal
        if (transactionType === 'withdraw') {
            const balanceQuery = `
                SELECT
                    COALESCE(SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END), 0) -
                    COALESCE(SUM(CASE WHEN transaction_type = 'withdraw' THEN amount ELSE 0 END), 0) AS balance
                FROM deposit_and_withdraw
                WHERE user_id = $1
            `;
            const balanceResult = await db.query(balanceQuery, [userId]);
            const currentBalance = parseFloat(balanceResult.rows[0].balance);

            if (currentBalance <= 0 || currentBalance < numericAmount) {
                return res.status(400).json({ error: 'Insufficient funds. Cannot withdraw.' });
            }
        }

        const query = `INSERT INTO deposit_and_withdraw (user_id, transaction_type, amount) VALUES ($1, $2, $3) RETURNING id`;
        const values = [userId, transactionType, numericAmount];

        const result = await db.query(query, values);

        if (result && result.rowCount === 1) {
            console.log(`Transaction successful: ${transactionType} of ${numericAmount} for User ${userId}.`);
            // Respond to the client with success message and the new transaction ID
            res.status(201).json({
                message: 'Transaction recorded successfully.',
                transactionId: result.rows[0].id,
                data: { userId, transactionType, amount: numericAmount }
            });
        } else {
             // This case is unlikely but good for robustness
            res.status(500).json({ error: 'Transaction failed to insert.', detail: result });
        }

    }  catch (error) {
        console.error('Database insertion error:', error);

        // Handle specific foreign key constraint error (user does not exist)
        if (error.code === '23503') {
            return res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
        res.status(500).json({ error: 'Database error occurred.' });
    }
});

app.get('/api/user-fullInfo', async (req, res) => {

    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const userId = req.session.user_id;
    const sqlGetFullname = "SELECT first_name, last_name, mobile_number, email, is_student, position, profile_pic_url FROM users WHERE id = $1";

    try {
        const userResult = await db.query(sqlGetFullname, [userId]);


        if (userResult.rows.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: userResult.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }

})

app.put('/api/update-profile', async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    const userId = req.session.user_id;
    const { first_name, last_name, email, position, is_student } = req.body;


    const updateQuery = `
        UPDATE users
        SET first_name = $1, last_name = $2, email = $3, position = $4, is_student = $5
        WHERE id = $6
    `;

    try {
        const result = await db.query(updateQuery, [
            first_name, 
            last_name, 
            email,  
            position, 
            is_student, 
            userId   
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }

        const updatedUser = await db.query('SELECT id, first_name, last_name, email, is_student, position FROM users WHERE id = $1', [userId]);

        res.json({ 
            message: 'Profile updated successfully!', 
            user: updatedUser.rows[0] 
        });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ message: 'Database error during update.' });
    }
});

app.post('/api/upload-profile-pic', upload.single('profilePicture'), async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ message: `unauthorized. Please Login.`});
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No File Uploaded'})
    }

    const userId = req.session.user_id;

    const profilePicPath = `/assets/profiles/${req.file.filename}`;

    const updateQuery = 'UPDATE users SET profile_pic_url = $1 WHERE id = $2';

    try {
        await db.query(updateQuery, [profilePicPath, userId]);

        res.json({
            message: 'Profile Picture updated successfully!',
            profile_pic_url: profilePicPath
        });
    } catch (err) {
        console.error('Profile Picture Upload Error', err)

        res.status(500).json({ message: 'Failed to save profile picture.' });
    }
})

app.get('/api/transactions', async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const user_id = req.session.user_id;
    const sqlGetTransactionHistory = "SELECT transaction_date, transaction_type, amount FROM deposit_and_withdraw WHERE user_id = $1 ORDER BY transaction_date DESC";
    const sqlGetMonthlyAmount = "SELECT TO_CHAR(transaction_date, 'YYYY-MM') AS month_period, SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END) - SUM(CASE WHEN transaction_type = 'withdraw' THEN amount ELSE 0 END) AS monthly_balance FROM deposit_and_withdraw WHERE user_id = $1 GROUP BY month_period ORDER BY month_period DESC"

    try {
        const transactionHistory = await db.query(sqlGetTransactionHistory, [user_id]);

        // Format the response to include date, time, action, amount
        const formattedTransactions = transactionHistory.rows.map(transaction => {
            const date = new Date(transaction.transaction_date);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
            return {
                date: formattedDate,
                time: formattedTime,
                action: transaction.transaction_type,
                amount: parseFloat(transaction.amount).toFixed(2)
            };
        });

        const monthlyTotals = await db.query(sqlGetMonthlyAmount, [user_id]);

        const formattedMonthly = monthlyTotals.rows.map(month => {
            const [year, monthNum] = month.month_period.split('-');
            const date = new Date(year, monthNum - 1);
            const formattedMonth = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            return {
                month: formattedMonth,
                amount: parseFloat(month.monthly_balance).toFixed(2)
            };
        });

        res.json({
            transactions: formattedTransactions,
            monthlyTotals: formattedMonthly
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

app.get('/api/balance/:userId', async (req, res) => {
    const { userId } = req.params;
    const sql = `
    SELECT (
        SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END) -
        SUM(CASE WHEN transaction_type = 'withdraw' THEN amount ELSE 0 END)
    ) AS balance
    FROM deposit_and_withdraw WHERE user_id = $1`

    try {
        const rows = await db.query(sql, [userId]);
        const currentBalance = rows.rows[0].balance || 0;

        res.status(200).json({
            success: true,
            balance: currentBalance
        });

    } catch (error) {

        console.error('Database Error:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error: Could not calculate balance.'
        })
    }
})

module.exports = app;