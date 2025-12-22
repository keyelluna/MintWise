//======================== S I G N   U P  ===========================================


const md_breakpooint = 768

        const workingChecked = () => {
        const isWorking = document.querySelector("#working");
        const workingPositionmd = document.querySelector("#workingPositionmd");
        const workingPositionsm = document.querySelector("#workingPositionsm");

        const isLargeScreen = window.innerWidth >= md_breakpooint;
        const isSmallScreen = window.innerWidth <= md_breakpooint;

        if (isWorking.checked && isLargeScreen){//for large screen
            workingPositionmd.style.display='block';
        } else if (isWorking.checked && isSmallScreen) {//for small screen
            workingPositionsm.style.display='block';
        } else {
            workingPositionmd.style.display='none';
            workingPositionsm.style.display='none';
        }
        
        }


        // --- API Logic (New) ---
    document.addEventListener('DOMContentLoaded', () => {
        // UI Listeners
        const workingCheckbox = document.querySelector("#working");
        if (workingCheckbox) {
            workingCheckbox.addEventListener('change', workingChecked);
            window.addEventListener('resize', workingChecked);
        }

        // Form Submission Listener
        const form = document.getElementById('signupForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); // Stop page from reloading

                // Get values
                const firstName = document.querySelector('#fname').value;
                const lastName = document.querySelector('#lname').value;
                const isStudent = document.querySelector('#student').checked;
                const isWorking = document.querySelector('#working').checked;

                // Get correct position input based on screen size
                let position = null;
                if(isWorking) {
                    if(window.innerWidth >= md_breakpooint) {
                        position = document.querySelector('#workingPositionmd').value;
                    } else {
                        position = document.querySelector('#workingPositionsm').value;
                    }
                }

                const email = document.querySelector('#email').value;

                // Note: In your HTML, the password input has id="fname".
                // I suggest changing the HTML ID to "signupPass", but targeting by placeholder here:
                const password = document.querySelector('#password').value;
                const confirmPass = document.querySelector('#confirmPass').value;

                // Simple Validation
                if (password !== confirmPass) {
                    alert("Passwords do not match!");
                    return;
                }

                // Send Data to Backend
                try {
                    const response = await fetch('http://localhost:3000/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firstName,
                            lastName,
                            email,
                            password,
                            isStudent,
                            position,
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        // alert('Account created! Redirecting to login...');
                        window.location.href = './dashboard.html'; // Redirect
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to connect to server.');
                }
            });
        }


// ======================== L O G   I N ==========================================
        // Login Form Submission Listener
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.querySelector('#email').value;
                const password = document.querySelector('#password').value;

                try {
                    const response = await fetch('http://localhost:3000/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Save user info if needed (optional)
                        localStorage.setItem('user', JSON.stringify(data.user));

                        //alert('Login Successful! Welcome ' + data.user.first_name);
                        // Redirect to a dashboard or home page
                        window.location.href = './dashboard.html';
                    } else {
                        alert('Login Failed: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to connect to server.');
                }
            });
        }
    });


// ===================== D A S H B O A R D =================================

    // ============= greet md =============
    document.addEventListener('DOMContentLoaded', () => {
        const userFirstnameElements = document.querySelectorAll('.userFirstname');
        const userFullname = document.querySelector('#userFullname');
        const studPos = document.querySelector('#studPos')
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
        // 3. Convert the string back into a JavaScript Object
        const userData = JSON.parse(storedUser);

        // 4. Display the first name
        // Note: Your database column is 'first_name', so the object key is likely 'first_name'

        userFirstnameElements.forEach(element => {
            element.innerHTML = userData.first_name;
        })

        // ============== account ==================
        userFullname.innerHTML = `${userData.first_name} ${userData.last_name}`

           if (userData.is_student  && userData.position) {
            studPos.innerHTML = `student & ${userData.position}`
            } else if (userData.position) {
                studPos.innerHTML = `${userData.position}`
            } else if (userData.is_student) {
                studPos.innerHTML = `student`
            }

        // ============== profile picture ==================
        if (userData.profile_pic_url) {
            const userProfile = document.querySelector('#userProfile');
            const userProfileSm = document.querySelector('#userProfileSm');
            const profileImage = document.querySelector('#profile-image');
            const profileImageMobile = document.querySelector('#profile-image-mobile');

            if (userProfile) userProfile.src = userData.profile_pic_url;
            if (userProfileSm) userProfileSm.src = userData.profile_pic_url;
            if (profileImage) profileImage.src = userData.profile_pic_url;
            if (profileImageMobile) profileImageMobile.src = userData.profile_pic_url;
        }



        const firstNameInput = document.querySelectorAll('.firstNameInput');
        const lastNameInput = document.querySelectorAll('.lastNameInput');
        const studentInput = document.querySelectorAll('.studentInput')
        const positionInput = document.querySelectorAll('.positionInput')
        const emailInput = document.querySelectorAll('.emailInput')
        firstNameInput.forEach(element => {element.value = userData.first_name;});

        lastNameInput.forEach(element => { element.value = userData.last_name; });

        emailInput.forEach(element => { element.value = userData.email;})

        if(userData.is_student && userData.position) {
            studentInput.forEach(element => {element.checked = true;  });
            positionInput.forEach(element => { element.value = userData.position;});
        } else if(userData.is_student) {
            studentInput.forEach(element => {element.checked = true;
        })
        } else if (userData.position) {
            positionInput.forEach(element => { element.value = userData.position;})
        }

        // Fetch and display transaction history
        fetchData();
        updateBalance();




    } else {
        // If no user is found, redirect back to login
        alert("You are not logged in!");
        window.location.href = 'index.html';
    }

    })




// ============================= C R O P   P R O F I L E ===============================

    const fileInput = document.querySelector('#profileUpload');
        const fileInputMobile = document.querySelector('#profileUploadMobile');
        const profileImage = document.querySelector('#profile-image');
        const userProfileImage = document.querySelector('#userProfile');
        const profileImageMobile = document.querySelector('#profile-image-mobile');
        const cropModal = document.querySelector('#cropModal');
        const cropImage = document.querySelector('#cropImage');
        const cropCancel = document.querySelector('#cropCancel');
        const cropConfirm = document.querySelector('#cropConfirm');

        let cropper;
        let selectedFile;
        let currentProfileImage;

        function handleFileSelect(fileInput, profileImage) {
            const file = fileInput.files[0];
            if (file) {
                selectedFile = file;
                currentProfileImage = profileImage;
                const reader = new FileReader();
                reader.onload = function(e) {
                    cropImage.src = e.target.result;
                    cropModal.classList.remove('hidden');
                    //smUserInfo.classList.add('opacity-5')
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(cropImage, {
                        aspectRatio: 1,
                        viewMode: 1,
                        autoCropArea: 1,
                        responsive: true,
                        restore: false,
                        checkCrossOrigin: false,
                        checkOrientation: false,
                        modal: true,
                        guides: true,
                        center: true,
                        highlight: false,
                        background: false,
                        scalable: true,
                        zoomable: true,
                        zoomOnTouch: true,
                        zoomOnWheel: true,
                        wheelZoomRatio: 0.1,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        toggleDragModeOnDblclick: false,
                    });
                };
                reader.readAsDataURL(file);
            }
        }

        fileInput.addEventListener('change', function(event) {
            handleFileSelect(fileInput, profileImage);
        });

        fileInputMobile.addEventListener('change', function(event) {
            handleFileSelect(fileInputMobile, profileImageMobile);
        });

        cropCancel.addEventListener('click', function() {
            cropModal.classList.add('hidden');
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            fileInput.value = '';
        });

        cropConfirm.addEventListener('click', async function() {
            if (cropper) {
                const canvas = cropper.getCroppedCanvas({
                    width: 300,
                    height: 300,
                });

                canvas.toBlob(async function(blob) {
                    const croppedFile = new File([blob], selectedFile.name, {
                        type: selectedFile.type,
                        lastModified: Date.now()
                    });

                    const formData = new FormData();
                    formData.append('profilePicture', croppedFile);

                    try {
                        const response = await fetch('/api/upload-profile-pic', {
                            method: 'POST',
                            body: formData
                        });

                        const data = await response.json();

                        if (response.ok) {
                            console.log('Image saved successfully. New URL:', data.profile_pic_url);
                            alert('Profile Picture Saved!');

                            if (currentProfileImage) {
                                currentProfileImage.src = data.profile_pic_url;
                            }

                            // NEW: Update the image with ID 'userProfile'
                            if (userProfileImage) {
                                userProfileImage.src = data.profile_pic_url;
                            }

                            // Update mobile profile picture
                            const userProfileSm = document.querySelector('#userProfileSm');
                            if (userProfileSm) {
                                userProfileSm.src = data.profile_pic_url;
                            }

                            // Update localStorage with new profile_pic_url
                            const storedUser = localStorage.getItem('user');
                            if (storedUser) {
                                const userData = JSON.parse(storedUser);
                                userData.profile_pic_url = data.profile_pic_url;
                                localStorage.setItem('user', JSON.stringify(userData));
                            }

                            // Update the profile image display
                            profileImage.src = canvas.toDataURL();
                        } else {
                            console.error('Upload failed: ', data.message);
                            alert('Upload Failed:' + data.message);
                        }
                    } catch (error) {
                        console.error('Network or System Error', error);
                        alert('Upload failed. Please try again.');
                    }

                    cropModal.classList.add('hidden');
                    if (cropper) {
                        cropper.destroy();
                        cropper = null;
                    }
                    fileInput.value = '';
                }, selectedFile.type);
            }
        });

    // =================== U P D A T E   U S E R ===================

    const mdSaveButton = document.querySelector('#mdSaveButton');
        if (mdSaveButton) {
            mdSaveButton.addEventListener("click", async (e) => {
                e.preventDefault();

                const fileInput = document.querySelector('#profileUpload');
                const file = fileInput.files[0];

                if (file) {
                    const formData = new FormData();
                    formData.append('profilePicture', file);

                    try {
                        const response = await fetch ('/api/upload-profile-pic', {
                            method: 'POST',
                            body: formData // Note: Do NOT set Content-Type header; FormData handles it
                        });

                        const data = await response.json();

                        if (response.ok) {
                            console.log('Image saved successfully. New URL:', data.profile_pic_url);
                            alert('Profile Picture Saved!');

                            const profileImageElement = document.querySelector('#profile-image');
                            profileImageElement.src = data.profile_pic_url;
                            profileImageElement.classList.add('rounded-full');
                        } else {
                            console.error('Upload failed: ', data.message);
                            alert('Upload Failed:' + data.message)
                        }

                    } catch (error) {
                        console.error('Network or System Error', error)
                    }
                } 

                

                    const firstNameInput = document.querySelector('#mdFirstNameInput');
                    const lastNameInput = document.querySelector('#mdLastNameInput');
                    const emailInput = document.querySelector('#mdEmailInput');
                    const positionInput = document.querySelector('#mdPositionInput');
                    const studentInput = document.querySelector('#mdStudentInput');
                    



                    const updatedData = {
                        first_name: firstNameInput ? firstNameInput.value : '',
                        last_name: lastNameInput ? lastNameInput.value : '',
                        email: emailInput ? emailInput.value : '',
                        
                        position: positionInput && positionInput.value !== '' ? positionInput.value : null,
                        is_student: studentInput ? studentInput.checked : false

                    };

                    try {
                        const response = await fetch('http://localhost:3000/api/update-profile', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedData)
                        });

                        const data = await response.json();

                        if (response.ok) {

                        
                            alert('Success: ' + data.message);
                            localStorage.setItem('user', JSON.stringify(data.user));
                            
                            

                            document.querySelectorAll('.userFirstname').forEach(el => el.innerHTML = data.user.first_name);
                            const userFullname = document.querySelector('#userFullname');
                            if(userFullname) userFullname.innerHTML = `${data.user.first_name} ${data.user.last_name}`;

                            const studPos = document.querySelector('#studPos')
                            if (data.user.is_student  && data.user.position) {
                                studPos.innerHTML = `student & ${data.user.position}`
                            } else if (data.user.position) {
                                studPos.innerHTML = `${data.user.position}`
                            } else if (data.user.is_student) {
                                studPos.innerHTML = `student`
                            }

                            document.querySelector('#userInfo').classList.add('hidden');
                            document.querySelector('#dashboardSection').classList.remove('blur-sm');

                        }
                    } catch (error) {
                    console.error('Error updating:', error);
                    alert('Failed to connect to server.');
                    }
                
               
            })
        }

        const smSaveButton = document.querySelector('#smSaveButton');
        if (smSaveButton) {
            smSaveButton.addEventListener("click", async (e) => {
                e.preventDefault();

                const firstNameInput = document.querySelector('#smFirstNameInput');
                const lastNameInput = document.querySelector('#smLastNameInput');
                const emailInput = document.querySelector('#smEmailInput');
                const positionInput = document.querySelector('#smPositionInput');
                const studentInput = document.querySelector('#smStudentInput');


                const updatedData = {
                    first_name: firstNameInput ? firstNameInput.value : '',
                    last_name: lastNameInput ? lastNameInput.value : '',
                    email: emailInput ? emailInput.value : '',
                    
                    position: positionInput ? positionInput.value : '',
                    is_student: studentInput ? +studentInput.checked : 0


                };

                try {
                    const response = await fetch('http://localhost:3000/api/update-profile', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedData)
                    });

                    const data = await response.json();

                    if (response.ok) {

                    
                        alert('Success: ' + data.message);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        

                        document.querySelectorAll('.userFirstname').forEach(el => el.innerHTML = data.user.first_name);
                        const userFullname = document.querySelector('#userFullname');
                        if(userFullname) userFullname.innerHTML = `${data.user.first_name} ${data.user.last_name}`;

                        document.querySelector('#userInfo').classList.add('hidden');
                        document.querySelector('#dashboardSection').classList.remove('blur-sm');

                        document.querySelector('#smUserInfo').classList.add('hidden');
                        document.body.classList.remove('bg-custom-violet-300');
                        document.querySelector('#menuSm_content').classList.remove('hidden');

                    }
                } catch (error) {
                console.error('Error updating:', error);
                alert('Failed to connect to server.');
                }
               
            })
        }
       
// ======================= D E P O S I T / W I T H D R A W =========================

const depositBtn = document.querySelectorAll('.depositBtn');
const withdrawBtn = document.querySelectorAll('.withdrawBtn');
const successAlert = document.querySelector('#successful');

const depositAmountBtn = document.querySelector('#depositAmountBtn');
const withdrawAmountBtn = document.querySelector('#withdrawAmountBtn');

const depositWithdrawKeyboard = document.querySelector('#depositWithdraw');
const depositWithdrawBack = document.querySelectorAll('.depositWithdrawBack')
const inputAmount = document.querySelector('#inputAmount');

function setInputAmount(value) {
    // Only set the currency display, keep the value clean for calculation
    inputAmount.value = `₱ ${value}.00`;
}


// Corrected button listeners to use the helper function
const btn20 = document.querySelector('#dBtn20');
const btn40 = document.querySelector('#dBtn40');
const btn50 = document.querySelector('#dBtn50');
const btn100 = document.querySelector('#dBtn100');
const btn150 = document.querySelector('#dBtn150');
const btn200 = document.querySelector('#dBtn200');
const btn250 = document.querySelector('#dBtn250');
const btn300 = document.querySelector('#dBtn300');
const backSpace = document.querySelector('#dlt');

btn20.addEventListener('click', () => { setInputAmount(btn20.value); });
btn40.addEventListener('click', () => { setInputAmount(btn40.value); });
btn50.addEventListener('click', () => { setInputAmount(btn50.value); });
btn100.addEventListener('click', () => { setInputAmount(btn100.value); });
btn150.addEventListener('click', () => { setInputAmount(btn150.value); });
btn200.addEventListener('click', () => { setInputAmount(btn200.value); });
btn250.addEventListener('click', () => { setInputAmount(btn250.value); });
btn300.addEventListener('click', () => { setInputAmount(btn300.value); });

backSpace.addEventListener('click', () => { //backspace
    let currentValue = inputAmount.value;

    if (currentValue.length > 0) {
        let newValue = currentValue.slice(0, -1);
        inputAmount.value = newValue;
    }
})



// --- D E P O S I T ---
depositBtn.forEach(button => {
    button.addEventListener('click', () => {
        depositWithdrawKeyboard.classList.remove('hidden');
        document.querySelector('#dashboardSection').classList.add('blur-sm');
        document.querySelector('#smDashhboard').classList.add('hidden');
        depositAmountBtndepositAmountBtn.classList.remove('hidden');
        withdrawAmountBtn.classList.add('hidden');
    })
})

withdrawBtn.forEach(button => {
    button.addEventListener('click', () => {
        depositWithdrawKeyboard.classList.remove('hidden');
        document.querySelector('#dashboardSection').classList.add('blur-sm');
        document.querySelector('#smDashhboard').classList.add('hidden');
        depositAmountBtn.classList.add('hidden');
        withdrawAmountBtn.classList.remove('hidden');
    })
})



depositWithdrawBack.forEach(back => {
    back.addEventListener('click', ()=> {
    depositWithdrawKeyboard.classList.add('hidden');
    document.querySelector('#dashboardSection').classList.remove('blur-sm');
    document.querySelector('#smDashhboard').classList.remove('hidden');
    successAlert.classList.add('hidden');
    inputAmount.value = '';

   document.querySelector('#message').textContent = '';
    })
})


// deposit withdraw API
let USER_ID;
const storedUser = localStorage.getItem('user');

if (storedUser) {

    const userData = JSON.parse(storedUser);
    USER_ID = userData.id || 1;
}

async function handleTransaction(type) {
    // 1. Get the raw value and remove the currency prefix/suffix
    const rawValue = inputAmount.value.replace('₱', '').replace(/\.00/g, '').trim();
    
    // 2. Parse the clean numeric amount
    const amount = parseFloat(rawValue);
    const messageDiv = document.querySelector('#message');
    const successMessage = document.querySelector('#successTransaction')

    messageDiv.style.visibility = 'visible'

    if (isNaN(amount) || amount <= 0) {
        messageDiv.textContent = '❌ Please enter a valid positive amount.';
        messageDiv.style.color = 'red';
        return;
    }

    if (!USER_ID) {
         messageDiv.textContent = '❌ Error: User not logged in.';
         messageDiv.style.color = 'red';
         return;
    }
    
    const transactionData = {
        userId: USER_ID, // Ensure this matches your backend req.body name
        transactionType: type,
        amount: amount.toFixed(2) // Send amount as a fixed-point string
    };
    
    // ... (rest of your API call logic remains the same) ...

    try {
        const response = await fetch('/api/transaction', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        const result = await response.json();

        if (response.ok) {
            successMessage.textContent = `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} successful! Amount: ₱${result.data.amount}`;
            messageDiv.style.color = 'green';
            inputAmount.value = '₱ 0.00'; // Clear input on success

            document.querySelector('#dashboardSection').classList.add('blur-sm');
            depositWithdrawKeyboard.classList.add('hidden');
            successAlert.classList.remove('hidden');

            // Refresh transaction history after successful transaction
            fetchData();
            updateBalance();
        } else {
            // Handle errors from the backend (e.g., insufficient funds for withdraw)
            messageDiv.textContent = `❌ Transaction failed: ${result.error || 'Server error.'}`;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Network Error:', error);
        messageDiv.textContent = '❌ Could not connect to the server.';
        messageDiv.style.color = 'red';
    }
}

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/transactions', {
            credentials: 'include'
        });
        const data = await response.json();

        // Populate transaction history
        const tbody = document.querySelectorAll('.transactionTable tbody');
        tbody.forEach(element => {
            element.innerHTML = '';
            if (data.transactions) {
                data.transactions.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${row.date}</td>
                    <td>${row.time}</td>
                    <td>${row.action}</td>
                    <td>${row.amount}</td>
                    `;
                    element.appendChild(tr);
                });
            }
        });

        // Populate monthly totals for desktop
        const monthlyTable = document.querySelector('#dashboardSection .monthlyTotalTable tbody');
        if (monthlyTable && data.monthlyTotals) {
            monthlyTable.innerHTML = '';
            data.monthlyTotals.forEach(month => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${month.month}</td>
                <td>₱${month.amount}</td>
                `;
                monthlyTable.appendChild(tr);
            });
        }

        // Populate monthly totals for mobile
        const monthlyTableSm = document.querySelector('#smDashhboard .monthlyTotalTable tbody');
        if (monthlyTableSm && data.monthlyTotals) {
            monthlyTableSm.innerHTML = '';
            data.monthlyTotals.forEach(month => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${month.month}</td>
                <td>₱${month.amount}</td>
                `;
                monthlyTableSm.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function updateBalance() {
    const totalBalance = document.querySelectorAll('.totalBalance');

    totalBalance.forEach(element => {
        if (!element) return;
    });

     try {
            const response = await fetch(`http://localhost:3000/api/balance/${USER_ID}`);
            const data = await response.json()

            if (response.ok) {
                const formattedBalance = parseFloat(data.balance).toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
                });
            
                totalBalance.forEach(element => {
                    element.innerHTML = `₱ ${formattedBalance}`;
                });

            }
        } catch (error) {
            console.error('Error updating balance:', error);
            balanceElement.innerHTML = "₱ --.--"; // Fallback if server is down
        }
}

