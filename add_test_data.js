// const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');
// dotenv.config();

// (async () => {
//   const db = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//   });

//   // Assume user ID 1 exists
//   await db.execute('INSERT INTO deposit_and_withdraw (user_id, transaction_type, amount) VALUES (1, "deposit", 100.00)');
//   await db.execute('INSERT INTO deposit_and_withdraw (user_id, transaction_type, amount) VALUES (1, "withdraw", 50.00)');
//   console.log('Test transactions added');
//   await db.end();
// })();
