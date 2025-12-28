// //======================== HELPER FUNCTIONS ===========================================

// // Get the JWT token from localStorage
// function getAuthToken() {
//     return localStorage.getItem('authToken');
// }

// // Set auth headers for API requests
// function getAuthHeaders() {
//     const token = getAuthToken();
//     return {
//         'Content-Type': 'application/json',
//         'Authorization': token ? `Bearer ${token}` : ''
//     };
// }

// // Check if user is logged in
// function isLoggedIn() {
//     return !!getAuthToken() && !!localStorage.getItem('user');
// }

// // Logout function
// function logout() {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     window.location.href = 'index.html';
// }


// import supabase from "./config/supabaseClient";

// //======================== S I G N   U P  ===========================================
// console.log(supabase)
// const md_breakpooint = 768

// const workingChecked = () => {
//     const isWorking = document.querySelector("#working");
//     const workingPositionmd = document.querySelector("#workingPositionmd");
//     const workingPositionsm = document.querySelector("#workingPositionsm");

//     const isLargeScreen = window.innerWidth >= md_breakpooint;
//     const isSmallScreen = window.innerWidth <= md_breakpooint;

//     if (isWorking.checked && isLargeScreen){
//         workingPositionmd.style.display='block';
//     } else if (isWorking.checked && isSmallScreen) {
//         workingPositionsm.style.display='block';
//     } else {
//         workingPositionmd.style.display='none';
//         workingPositionsm.style.display='none';
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     // UI Listeners
//     const workingCheckbox = document.querySelector("#working");
//     if (workingCheckbox) {
//         workingCheckbox.addEventListener('change', workingChecked);
//         window.addEventListener('resize', workingChecked);
//     }

//     // Form Submission Listener
//     const form = document.getElementById('signupForm');
//     if (form) {
//         form.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const firstName = document.querySelector('#fname').value;
//             const lastName = document.querySelector('#lname').value;
//             const isStudent = document.querySelector('#student').checked;
//             const isWorking = document.querySelector('#working').checked;

//             let position = null;
//             if(isWorking) {
//                 if(window.innerWidth >= md_breakpooint) {
//                     position = document.querySelector('#workingPositionmd').value;
//                 } else {
//                     position = document.querySelector('#workingPositionsm').value;
//                 }
//             }

//             const email = document.querySelector('#email').value;
//             const password = document.querySelector('#password').value;
//             const confirmPass = document.querySelector('#confirmPass').value;

//             if (password !== confirmPass) {
//                 alert("Passwords do not match!");
//                 return;
//             }

//             try {
//                 const response = await fetch('/signup', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         firstName,
//                         lastName,
//                         email,
//                         password,
//                         isStudent,
//                         position,
//                     })
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     // Store both user data and JWT token
//                     localStorage.setItem('user', JSON.stringify(data.user));
//                     localStorage.setItem('authToken', data.token);
//                     window.location.href = './dashboard.html';
//                 } else {
//                     alert('Error: ' + data.message);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert('Failed to connect to server.');
//             }
//         });
//     }

// // ======================== L O G   I N ==========================================
//     const loginForm = document.getElementById('loginForm');
//     if (loginForm) {
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const email = document.querySelector('#email').value;
//             const password = document.querySelector('#password').value;

//             try {
//                 const response = await fetch('/login', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email, password })
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     // Store both user data and JWT token
//                     localStorage.setItem('user', JSON.stringify(data.user));
//                     localStorage.setItem('authToken', data.token);
//                     window.location.href = './dashboard.html';
//                 } else {
//                     alert('Login Failed: ' + data.message);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert('Failed to connect to server.');
//             }
//         });
//     }
// });

// // ===================== D A S H B O A R D =================================

// document.addEventListener('DOMContentLoaded', () => {
//     const userFirstnameElements = document.querySelectorAll('.userFirstname');
//     const userFullname = document.querySelector('#userFullname');
//     const studPos = document.querySelector('#studPos')
    
//     const isDashboardPage = window.location.pathname.includes('dashboard.html');
    
//     // Check if user is logged in
//     if (!isLoggedIn() && isDashboardPage) {
//         alert("You are not logged in!");
//         window.location.href = 'index.html';
//         return;
//     }

//     const storedUser = localStorage.getItem('user');

//     if (storedUser && isDashboardPage) {
//         const userData = JSON.parse(storedUser);

//         userFirstnameElements.forEach(element => {
//             element.innerHTML = userData.first_name;
//         })

//         if (userFullname) {
//             userFullname.innerHTML = `${userData.first_name} ${userData.last_name}`
//         }

//         if (studPos) {
//             if (userData.is_student && userData.position) {
//                 studPos.innerHTML = `student & ${userData.position}`
//             } else if (userData.position) {
//                 studPos.innerHTML = `${userData.position}`
//             } else if (userData.is_student) {
//                 studPos.innerHTML = `student`
//             }
//         }

//         // Profile picture
//         if (userData.profile_pic_url) {
//             const userProfile = document.querySelector('#userProfile');
//             const userProfileSm = document.querySelector('#userProfileSm');
//             const profileImage = document.querySelector('#profile-image');
//             const profileImageMobile = document.querySelector('#profile-image-mobile');

//             if (userProfile) userProfile.src = userData.profile_pic_url;
//             if (userProfileSm) userProfileSm.src = userData.profile_pic_url;
//             if (profileImage) profileImage.src = userData.profile_pic_url;
//             if (profileImageMobile) profileImageMobile.src = userData.profile_pic_url;
//         }

//         const firstNameInput = document.querySelectorAll('.firstNameInput');
//         const lastNameInput = document.querySelectorAll('.lastNameInput');
//         const studentInput = document.querySelectorAll('.studentInput')
//         const positionInput = document.querySelectorAll('.positionInput')
//         const emailInput = document.querySelectorAll('.emailInput')
        
//         firstNameInput.forEach(element => {element.value = userData.first_name;});
//         lastNameInput.forEach(element => { element.value = userData.last_name; });
//         emailInput.forEach(element => { element.value = userData.email;})

//         if(userData.is_student && userData.position) {
//             studentInput.forEach(element => {element.checked = true;  });
//             positionInput.forEach(element => { element.value = userData.position;});
//         } else if(userData.is_student) {
//             studentInput.forEach(element => {element.checked = true;})
//         } else if (userData.position) {
//             positionInput.forEach(element => { element.value = userData.position;})
//         }

//         // Fetch and display transaction history
//         fetchData();
//         updateBalance();
//     }
// })

// // ============================= C R O P   P R O F I L E ===============================

// const fileInput = document.querySelector('#profileUpload');
// const fileInputMobile = document.querySelector('#profileUploadMobile');
// const profileImage = document.querySelector('#profile-image');
// const userProfileImage = document.querySelector('#userProfile');
// const profileImageMobile = document.querySelector('#profile-image-mobile');
// const cropModal = document.querySelector('#cropModal');
// const cropImage = document.querySelector('#cropImage');
// const cropCancel = document.querySelector('#cropCancel');
// const cropConfirm = document.querySelector('#cropConfirm');

// let cropper;
// let selectedFile;
// let currentProfileImage;

// function handleFileSelect(fileInput, profileImage) {
//     const file = fileInput.files[0];
//     if (file) {
//         selectedFile = file;
//         currentProfileImage = profileImage;
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             cropImage.src = e.target.result;
//             cropModal.classList.remove('hidden');
//             if (cropper) {
//                 cropper.destroy();
//             }
//             cropper = new Cropper(cropImage, {
//                 aspectRatio: 1,
//                 viewMode: 1,
//                 autoCropArea: 1,
//                 responsive: true,
//                 restore: false,
//                 checkCrossOrigin: false,
//                 checkOrientation: false,
//                 modal: true,
//                 guides: true,
//                 center: true,
//                 highlight: false,
//                 background: false,
//                 scalable: true,
//                 zoomable: true,
//                 zoomOnTouch: true,
//                 zoomOnWheel: true,
//                 wheelZoomRatio: 0.1,
//                 cropBoxMovable: true,
//                 cropBoxResizable: true,
//                 toggleDragModeOnDblclick: false,
//             });
//         };
//         reader.readAsDataURL(file);
//     }
// }

// if (fileInput) {
//     fileInput.addEventListener('change', function(event) {
//         handleFileSelect(fileInput, profileImage);
//     });
// }

// if (fileInputMobile) {
//     fileInputMobile.addEventListener('change', function(event) {
//         handleFileSelect(fileInputMobile, profileImageMobile);
//     });
// }

// if (cropCancel) {
//     cropCancel.addEventListener('click', function() {
//         cropModal.classList.add('hidden');
//         if (cropper) {
//             cropper.destroy();
//             cropper = null;
//         }
//         if (fileInput) fileInput.value = '';
//     });
// }

// if (cropConfirm) {
//     cropConfirm.addEventListener('click', async function() {
//         if (cropper) {
//             const canvas = cropper.getCroppedCanvas({
//                 width: 300,
//                 height: 300,
//             });

//             canvas.toBlob(async function(blob) {
//                 const croppedFile = new File([blob], selectedFile.name, {
//                     type: selectedFile.type,
//                     lastModified: Date.now()
//                 });

//                 const formData = new FormData();
//                 formData.append('profilePicture', croppedFile);

//                 try {
//                     const token = getAuthToken();
//                     const response = await fetch('/api/upload-profile-pic', {
//                         method: 'POST',
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         },
//                         body: formData
//                     });

//                     const data = await response.json();

//                     if (response.ok) {
//                         console.log('Image saved successfully. New URL:', data.profile_pic_url);
//                         alert('Profile Picture Saved!');

//                         if (currentProfileImage) {
//                             currentProfileImage.src = data.profile_pic_url;
//                         }

//                         if (userProfileImage) {
//                             userProfileImage.src = data.profile_pic_url;
//                         }

//                         const userProfileSm = document.querySelector('#userProfileSm');
//                         if (userProfileSm) {
//                             userProfileSm.src = data.profile_pic_url;
//                         }

//                         // Update localStorage
//                         const storedUser = localStorage.getItem('user');
//                         if (storedUser) {
//                             const userData = JSON.parse(storedUser);
//                             userData.profile_pic_url = data.profile_pic_url;
//                             localStorage.setItem('user', JSON.stringify(userData));
//                         }

//                         if (profileImage) profileImage.src = canvas.toDataURL();
//                     } else {
//                         console.error('Upload failed: ', data.message);
//                         alert('Upload Failed:' + data.message);
//                     }
//                 } catch (error) {
//                     console.error('Network or System Error', error);
//                     alert('Upload failed. Please try again.');
//                 }

//                 cropModal.classList.add('hidden');
//                 if (cropper) {
//                     cropper.destroy();
//                     cropper = null;
//                 }
//                 if (fileInput) fileInput.value = '';
//             }, selectedFile.type);
//         }
//     });
// }

// // =================== U P D A T E   U S E R ===================

// const mdSaveButton = document.querySelector('#mdSaveButton');
// if (mdSaveButton) {
//     mdSaveButton.addEventListener("click", async (e) => {
//         e.preventDefault();

//         const firstNameInput = document.querySelector('#mdFirstNameInput');
//         const lastNameInput = document.querySelector('#mdLastNameInput');
//         const emailInput = document.querySelector('#mdEmailInput');
//         const positionInput = document.querySelector('#mdPositionInput');
//         const studentInput = document.querySelector('#mdStudentInput');

//         const updatedData = {
//             first_name: firstNameInput ? firstNameInput.value : '',
//             last_name: lastNameInput ? lastNameInput.value : '',
//             email: emailInput ? emailInput.value : '',
//             position: positionInput && positionInput.value !== '' ? positionInput.value : null,
//             is_student: studentInput ? studentInput.checked : false
//         };

//         try {
//             const response = await fetch('/api/update-profile', {
//                 method: 'PUT',
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(updatedData)
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 alert('Success: ' + data.message);
//                 localStorage.setItem('user', JSON.stringify(data.user));

//                 document.querySelectorAll('.userFirstname').forEach(el => el.innerHTML = data.user.first_name);
//                 const userFullname = document.querySelector('#userFullname');
//                 if(userFullname) userFullname.innerHTML = `${data.user.first_name} ${data.user.last_name}`;

//                 const studPos = document.querySelector('#studPos')
//                 if (studPos) {
//                     if (data.user.is_student && data.user.position) {
//                         studPos.innerHTML = `student & ${data.user.position}`
//                     } else if (data.user.position) {
//                         studPos.innerHTML = `${data.user.position}`
//                     } else if (data.user.is_student) {
//                         studPos.innerHTML = `student`
//                     }
//                 }

//                 document.querySelector('#userInfo').classList.add('hidden');
//                 document.querySelector('#dashboardSection').classList.remove('blur-sm');
//             } else if (response.status === 401 || response.status === 403) {
//                 alert('Session expired. Please login again.');
//                 logout();
//             }
//         } catch (error) {
//             console.error('Error updating:', error);
//             alert('Failed to connect to server.');
//         }
//     })
// }

// const smSaveButton = document.querySelector('#smSaveButton');
// if (smSaveButton) {
//     smSaveButton.addEventListener("click", async (e) => {
//         e.preventDefault();

//         const firstNameInput = document.querySelector('#smFirstNameInput');
//         const lastNameInput = document.querySelector('#smLastNameInput');
//         const emailInput = document.querySelector('#smEmailInput');
//         const positionInput = document.querySelector('#smPositionInput');
//         const studentInput = document.querySelector('#smStudentInput');

//         const updatedData = {
//             first_name: firstNameInput ? firstNameInput.value : '',
//             last_name: lastNameInput ? lastNameInput.value : '',
//             email: emailInput ? emailInput.value : '',
//             position: positionInput ? positionInput.value : '',
//             is_student: studentInput ? +studentInput.checked : 0
//         };

//         try {
//             const response = await fetch('/api/update-profile', {
//                 method: 'PUT',
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(updatedData)
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 alert('Success: ' + data.message);
//                 localStorage.setItem('user', JSON.stringify(data.user));

//                 document.querySelectorAll('.userFirstname').forEach(el => el.innerHTML = data.user.first_name);
//                 const userFullname = document.querySelector('#userFullname');
//                 if(userFullname) userFullname.innerHTML = `${data.user.first_name} ${data.user.last_name}`;

//                 document.querySelector('#userInfo').classList.add('hidden');
//                 document.querySelector('#dashboardSection').classList.remove('blur-sm');

//                 document.querySelector('#smUserInfo').classList.add('hidden');
//                 document.body.classList.remove('bg-custom-violet-300');
//                 document.querySelector('#menuSm_content').classList.remove('hidden');
//             } else if (response.status === 401 || response.status === 403) {
//                 alert('Session expired. Please login again.');
//                 logout();
//             }
//         } catch (error) {
//             console.error('Error updating:', error);
//             alert('Failed to connect to server.');
//         }
//     })
// }

// // ======================= D E P O S I T / W I T H D R A W =========================

// const depositBtn = document.querySelectorAll('.depositBtn');
// const withdrawBtn = document.querySelectorAll('.withdrawBtn');
// const successAlert = document.querySelector('#successful');

// const depositAmountBtn = document.querySelector('#depositAmountBtn');
// const withdrawAmountBtn = document.querySelector('#withdrawAmountBtn');

// const depositWithdrawKeyboard = document.querySelector('#depositWithdraw');
// const depositWithdrawBack = document.querySelectorAll('.depositWithdrawBack')
// const inputAmount = document.querySelector('#inputAmount');

// function setInputAmount(value) {
//     inputAmount.value = `₱ ${value}.00`;
// }

// const btn20 = document.querySelector('#dBtn20');
// const btn40 = document.querySelector('#dBtn40');
// const btn50 = document.querySelector('#dBtn50');
// const btn100 = document.querySelector('#dBtn100');
// const btn150 = document.querySelector('#dBtn150');
// const btn200 = document.querySelector('#dBtn200');
// const btn250 = document.querySelector('#dBtn250');
// const btn300 = document.querySelector('#dBtn300');
// const backSpace = document.querySelector('#dlt');

// if (btn20) btn20.addEventListener('click', () => { setInputAmount(btn20.value); });
// if (btn40) btn40.addEventListener('click', () => { setInputAmount(btn40.value); });
// if (btn50) btn50.addEventListener('click', () => { setInputAmount(btn50.value); });
// if (btn100) btn100.addEventListener('click', () => { setInputAmount(btn100.value); });
// if (btn150) btn150.addEventListener('click', () => { setInputAmount(btn150.value); });
// if (btn200) btn200.addEventListener('click', () => { setInputAmount(btn200.value); });
// if (btn250) btn250.addEventListener('click', () => { setInputAmount(btn250.value); });
// if (btn300) btn300.addEventListener('click', () => { setInputAmount(btn300.value); });

// if (backSpace) {
//     backSpace.addEventListener('click', () => {
//         let currentValue = inputAmount.value;
//         if (currentValue.length > 0) {
//             let newValue = currentValue.slice(0, -1);
//             inputAmount.value = newValue;
//         }
//     })
// }

// depositBtn.forEach(button => {
//     button.addEventListener('click', () => {
//         if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.remove('hidden');
//         const dashSection = document.querySelector('#dashboardSection');
//         if (dashSection) dashSection.classList.add('blur-sm');
//         const smDash = document.querySelector('#smDashhboard');
//         if (smDash) smDash.classList.add('hidden');
//         if (depositAmountBtn) depositAmountBtn.classList.remove('hidden');
//         if (withdrawAmountBtn) withdrawAmountBtn.classList.add('hidden');
//     })
// })

// withdrawBtn.forEach(button => {
//     button.addEventListener('click', () => {
//         if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.remove('hidden');
//         const dashSection = document.querySelector('#dashboardSection');
//         if (dashSection) dashSection.classList.add('blur-sm');
//         const smDash = document.querySelector('#smDashhboard');
//         if (smDash) smDash.classList.add('hidden');
//         if (depositAmountBtn) depositAmountBtn.classList.add('hidden');
//         if (withdrawAmountBtn) withdrawAmountBtn.classList.remove('hidden');
//     })
// })

// depositWithdrawBack.forEach(back => {
//     back.addEventListener('click', ()=> {
//         if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.add('hidden');
//         const dashSection = document.querySelector('#dashboardSection');
//         if (dashSection) dashSection.classList.remove('blur-sm');
//         const smDash = document.querySelector('#smDashhboard');
//         if (smDash) smDash.classList.remove('hidden');
//         if (successAlert) successAlert.classList.add('hidden');
//         if (inputAmount) inputAmount.value = '';
//         const messageDiv = document.querySelector('#message');
//         if (messageDiv) messageDiv.textContent = '';
//     })
// })

// // deposit withdraw API
// let USER_ID;
// const storedUser = localStorage.getItem('user');

// if (storedUser) {
//     const userData = JSON.parse(storedUser);
//     USER_ID = userData.id || 1;
// }

// async function handleTransaction(type) {
//     const rawValue = inputAmount.value.replace('₱', '').replace(/\.00/g, '').trim();
//     const amount = parseFloat(rawValue);
//     const messageDiv = document.querySelector('#message');
//     const successMessage = document.querySelector('#successTransaction')

//     if (messageDiv) messageDiv.style.visibility = 'visible'

//     if (isNaN(amount) || amount <= 0) {
//         if (messageDiv) {
//             messageDiv.textContent = '❌ Please enter a valid positive amount.';
//             messageDiv.style.color = 'red';
//         }
//         return;
//     }

//     if (!USER_ID) {
//         if (messageDiv) {
//             messageDiv.textContent = '❌ Error: User not logged in.';
//             messageDiv.style.color = 'red';
//         }
//         return;
//     }
    
//     const transactionData = {
//         userId: USER_ID,
//         transactionType: type,
//         amount: amount.toFixed(2)
//     };

//     try {
//         const response = await fetch('/api/transaction', { 
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(transactionData)
//         });

//         const result = await response.json();

//         if (response.ok) {
//             if (successMessage) {
//                 successMessage.textContent = `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} successful! Amount: ₱${result.data.amount}`;
//             }
//             if (messageDiv) messageDiv.style.color = 'green';
//             if (inputAmount) inputAmount.value = '₱ 0.00';

//             const dashSection = document.querySelector('#dashboardSection');
//             if (dashSection) dashSection.classList.add('blur-sm');
//             if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.add('hidden');
//             if (successAlert) successAlert.classList.remove('hidden');

//             fetchData();
//             updateBalance();
//         } else if (response.status === 401 || response.status === 403) {
//             alert('Session expired. Please login again.');
//             logout();
//         } else {
//             if (messageDiv) {
//                 messageDiv.textContent = `❌ Transaction failed: ${result.error || 'Server error.'}`;
//                 messageDiv.style.color = 'red';
//             }
//         }
//     } catch (error) {
//         console.error('Network Error:', error);
//         if (messageDiv) {
//             messageDiv.textContent = '❌ Could not connect to the server.';
//             messageDiv.style.color = 'red';
//         }
//     }
// }

// async function fetchData() {
//     try {
//         const response = await fetch('/api/transactions', {
//             headers: {
//                 'Authorization': `Bearer ${getAuthToken()}`
//             }
//         });

//         if (response.status === 401 || response.status === 403) {
//             logout();
//             return;
//         }

//         const data = await response.json();

//         const tbody = document.querySelectorAll('.transactionTable tbody');
//         tbody.forEach(element => {
//             element.innerHTML = '';
//             if (data.transactions) {
//                 data.transactions.forEach(row => {
//                     const tr = document.createElement('tr');
//                     tr.innerHTML = `
//                     <td>${row.date}</td>
//                     <td>${row.time}</td>
//                     <td>${row.action}</td>
//                     <td>${row.amount}</td>
//                     `;
//                     element.appendChild(tr);
//                 });
//             }
//         });

//         const monthlyTable = document.querySelector('#dashboardSection .monthlyTotalTable tbody');
//         if (monthlyTable && data.monthlyTotals) {
//             monthlyTable.innerHTML = '';
//             data.monthlyTotals.forEach(month => {
//                 const tr = document.createElement('tr');
//                 tr.innerHTML = `
//                 <td>${month.month}</td>
//                 <td>₱${month.amount}</td>
//                 `;
//                 monthlyTable.appendChild(tr);
//             });
//         }

//         const monthlyTableSm = document.querySelector('#smDashhboard .monthlyTotalTable tbody');
//         if (monthlyTableSm && data.monthlyTotals) {
//             monthlyTableSm.innerHTML = '';
//             data.monthlyTotals.forEach(month => {
//                 const tr = document.createElement('tr');
//                 tr.innerHTML = `
//                 <td>${month.month}</td>
//                 <td>₱${month.amount}</td>
//                 `;
//                 monthlyTableSm.appendChild(tr);
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// async function updateBalance() {
//     const totalBalance = document.querySelectorAll('.totalBalance');

//     totalBalance.forEach(element => {
//         if (!element) return;
//     });

//     try {
//         const response = await fetch(`/api/balance/${USER_ID}`, {
//             headers: {
//                 'Authorization': `Bearer ${getAuthToken()}`
//             }
//         });

//         if (response.status === 401 || response.status === 403) {
//             logout();
//             return;
//         }

//         const data = await response.json();

//         if (response.ok) {
//             const formattedBalance = parseFloat(data.balance).toLocaleString('en-PH', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             });
        
//             totalBalance.forEach(element => {
//                 element.innerHTML = `₱ ${formattedBalance}`;
//             });
//         }
//     } catch (error) {
//         console.error('Error updating balance:', error);
//         totalBalance.forEach(element => {
//             element.innerHTML = "₱ --.--";
//         });
//     }
// }

//======================== API CONFIGURATION ===========================================
// IMPORTANT: Change this to your deployed backend URL
const API_BASE_URL = 'https://mint-wise-eight.vercel.app';

//======================== HELPER FUNCTIONS ===========================================

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('user');
}

// Logout function
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/api/logout`, { 
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Get headers for API requests
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}



//======================== S I G N   U P  ===========================================

const md_breakpooint = 768

const workingChecked = () => {
    const isWorking = document.querySelector("#working");
    const workingPositionmd = document.querySelector("#workingPositionmd");
    const workingPositionsm = document.querySelector("#workingPositionsm");

    const isLargeScreen = window.innerWidth >= md_breakpooint;
    const isSmallScreen = window.innerWidth <= md_breakpooint;

    if (isWorking.checked && isLargeScreen){
        workingPositionmd.style.display='block';
    } else if (isWorking.checked && isSmallScreen) {
        workingPositionsm.style.display='block';
    } else {
        workingPositionmd.style.display='none';
        workingPositionsm.style.display='none';
    }
}

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
            e.preventDefault();

            console.log('🔵 Signup form submitted');

            const firstName = document.querySelector('#fname').value;
            const lastName = document.querySelector('#lname').value;
            const isStudent = document.querySelector('#student').checked;
            const isWorking = document.querySelector('#working').checked;

            let position = null;
            if(isWorking) {
                if(window.innerWidth >= md_breakpooint) {
                    position = document.querySelector('#workingPositionmd').value;
                } else {
                    position = document.querySelector('#workingPositionsm').value;
                }
            }

            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const confirmPass = document.querySelector('#confirmPass').value;

            if (password !== confirmPass) {
                alert("Passwords do not match!");
                return;
            }

            const requestData = {
                firstName,
                lastName,
                email,
                password,
                isStudent,
                position,
            };

            console.log('🔵 Sending signup request to:', `${API_BASE_URL}/signup`);
            console.log('🔵 Request data:', { ...requestData, password: '***' });

            try {
                const response = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(requestData)
                });

                console.log('🔵 Response status:', response.status);
                console.log('🔵 Response headers:', Object.fromEntries(response.headers.entries()));

                const data = await response.json();
                console.log('🔵 Response data:', data);

                if (response.ok) {
                    console.log('✅ Signup successful!');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    console.log('✅ User saved to localStorage:', data.user);
                    
                    // Check if cookies were set
                    console.log('🍪 All cookies:', document.cookie);
                    
                    console.log('🔵 Redirecting to dashboard...');
                    window.location.href = './dashboard.html';
                } else {
                    console.error('❌ Signup failed:', data.message);
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('❌ Network error:', error);
                alert('Failed to connect to server. Check console for details.');
            }
        });
    }

// ======================== L O G   I N ==========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            console.log('🔵 Login form submitted');

            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            console.log('🔵 Attempting login for:', email);
            console.log('🔵 Sending login request to:', `${API_BASE_URL}/login`);

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                console.log('🔵 Response status:', response.status);
                console.log('🔵 Response headers:', Object.fromEntries(response.headers.entries()));

                const data = await response.json();
                console.log('🔵 Response data:', data);

                if (response.ok) {
                    console.log('✅ Login successful!');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    console.log('✅ User saved to localStorage:', data.user);
                    
                    // Check if cookies were set
                    console.log('🍪 All cookies:', document.cookie);
                    
                    console.log('🔵 Redirecting to dashboard...');
                    window.location.href = './dashboard.html';
                } else {
                    console.error('❌ Login failed:', data.message);
                    alert('Login Failed: ' + data.message);
                }
            } catch (error) {
                console.error('❌ Network error:', error);
                alert('Failed to connect to server. Check console for details.');
            }
        });
    }
});

// ===================== D A S H B O A R D =================================

document.addEventListener('DOMContentLoaded', () => {
    const userFirstnameElements = document.querySelectorAll('.userFirstname');
    const userFullname = document.querySelector('#userFullname');
    const studPos = document.querySelector('#studPos')
    
    const isDashboardPage = window.location.pathname.includes('dashboard.html');
    
    console.log('🔵 Page loaded:', window.location.pathname);
    console.log('🔵 Is dashboard page:', isDashboardPage);
    console.log('🔵 Is logged in:', isLoggedIn());
    
    // Check if user is logged in
    if (!isLoggedIn() && isDashboardPage) {
        console.log('❌ Not logged in, redirecting to index');
        alert("You are not logged in!");
        window.location.href = 'index.html';
        return;
    }

    const storedUser = localStorage.getItem('user');
    console.log('🔵 User from localStorage:', storedUser);

    if (storedUser && isDashboardPage) {
        const userData = JSON.parse(storedUser);
        console.log('✅ User data loaded:', userData);

        userFirstnameElements.forEach(element => {
            element.innerHTML = userData.first_name;
        })

        if (userFullname) {
            userFullname.innerHTML = `${userData.first_name} ${userData.last_name}`
        }

        if (studPos) {
            if (userData.is_student && userData.position) {
                studPos.innerHTML = `student & ${userData.position}`
            } else if (userData.position) {
                studPos.innerHTML = `${userData.position}`
            } else if (userData.is_student) {
                studPos.innerHTML = `student`
            }
        }

        // Profile picture
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
            studentInput.forEach(element => {element.checked = true;})
        } else if (userData.position) {
            positionInput.forEach(element => { element.value = userData.position;})
        }

        // Fetch and display transaction history
        fetchData();
        updateBalance();
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

if (fileInput) {
    fileInput.addEventListener('change', function(event) {
        handleFileSelect(fileInput, profileImage);
    });
}

if (fileInputMobile) {
    fileInputMobile.addEventListener('change', function(event) {
        handleFileSelect(fileInputMobile, profileImageMobile);
    });
}

if (cropCancel) {
    cropCancel.addEventListener('click', function() {
        cropModal.classList.add('hidden');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (fileInput) fileInput.value = '';
    });
}

if (cropConfirm) {
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
                    const response = await fetch(`${API_BASE_URL}/api/upload-profile-pic`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Image saved successfully. New URL:', data.profile_pic_url);
                        alert('Profile Picture Saved!');

                        if (currentProfileImage) {
                            currentProfileImage.src = data.profile_pic_url;
                        }

                        if (userProfileImage) {
                            userProfileImage.src = data.profile_pic_url;
                        }

                        const userProfileSm = document.querySelector('#userProfileSm');
                        if (userProfileSm) {
                            userProfileSm.src = data.profile_pic_url;
                        }

                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            const userData = JSON.parse(storedUser);
                            userData.profile_pic_url = data.profile_pic_url;
                            localStorage.setItem('user', JSON.stringify(userData));
                        }

                        if (profileImage) profileImage.src = canvas.toDataURL();
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
                if (fileInput) fileInput.value = '';
            }, selectedFile.type);
        }
    });
}

// =================== U P D A T E   U S E R ===================

const mdSaveButton = document.querySelector('#mdSaveButton');
if (mdSaveButton) {
    mdSaveButton.addEventListener("click", async (e) => {
        e.preventDefault();

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
            const response = await fetch(`${API_BASE_URL}/api/update-profile`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                credentials: 'include',
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
                if (studPos) {
                    if (data.user.is_student && data.user.position) {
                        studPos.innerHTML = `student & ${data.user.position}`
                    } else if (data.user.position) {
                        studPos.innerHTML = `${data.user.position}`
                    } else if (data.user.is_student) {
                        studPos.innerHTML = `student`
                    }
                }

                document.querySelector('#userInfo').classList.add('hidden');
                document.querySelector('#dashboardSection').classList.remove('blur-sm');
            } else if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.');
                logout();
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
            const response = await fetch(`${API_BASE_URL}/api/update-profile`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                credentials: 'include',
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
            } else if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.');
                logout();
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
    inputAmount.value = `₱ ${value}.00`;
}

const btn20 = document.querySelector('#dBtn20');
const btn40 = document.querySelector('#dBtn40');
const btn50 = document.querySelector('#dBtn50');
const btn100 = document.querySelector('#dBtn100');
const btn150 = document.querySelector('#dBtn150');
const btn200 = document.querySelector('#dBtn200');
const btn250 = document.querySelector('#dBtn250');
const btn300 = document.querySelector('#dBtn300');
const backSpace = document.querySelector('#dlt');

if (btn20) btn20.addEventListener('click', () => { setInputAmount(btn20.value); });
if (btn40) btn40.addEventListener('click', () => { setInputAmount(btn40.value); });
if (btn50) btn50.addEventListener('click', () => { setInputAmount(btn50.value); });
if (btn100) btn100.addEventListener('click', () => { setInputAmount(btn100.value); });
if (btn150) btn150.addEventListener('click', () => { setInputAmount(btn150.value); });
if (btn200) btn200.addEventListener('click', () => { setInputAmount(btn200.value); });
if (btn250) btn250.addEventListener('click', () => { setInputAmount(btn250.value); });
if (btn300) btn300.addEventListener('click', () => { setInputAmount(btn300.value); });

if (backSpace) {
    backSpace.addEventListener('click', () => {
        let currentValue = inputAmount.value;
        if (currentValue.length > 0) {
            let newValue = currentValue.slice(0, -1);
            inputAmount.value = newValue;
        }
    })
}

depositBtn.forEach(button => {
    button.addEventListener('click', () => {
        if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.remove('hidden');
        const dashSection = document.querySelector('#dashboardSection');
        if (dashSection) dashSection.classList.add('blur-sm');
        const smDash = document.querySelector('#smDashhboard');
        if (smDash) smDash.classList.add('hidden');
        if (depositAmountBtn) depositAmountBtn.classList.remove('hidden');
        if (withdrawAmountBtn) withdrawAmountBtn.classList.add('hidden');
    })
})

withdrawBtn.forEach(button => {
    button.addEventListener('click', () => {
        if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.remove('hidden');
        const dashSection = document.querySelector('#dashboardSection');
        if (dashSection) dashSection.classList.add('blur-sm');
        const smDash = document.querySelector('#smDashhboard');
        if (smDash) smDash.classList.add('hidden');
        if (depositAmountBtn) depositAmountBtn.classList.add('hidden');
        if (withdrawAmountBtn) withdrawAmountBtn.classList.remove('hidden');
    })
})

depositWithdrawBack.forEach(back => {
    back.addEventListener('click', ()=> {
        if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.add('hidden');
        const dashSection = document.querySelector('#dashboardSection');
        if (dashSection) dashSection.classList.remove('blur-sm');
        const smDash = document.querySelector('#smDashhboard');
        if (smDash) smDash.classList.remove('hidden');
        if (successAlert) successAlert.classList.add('hidden');
        if (inputAmount) inputAmount.value = '';
        const messageDiv = document.querySelector('#message');
        if (messageDiv) messageDiv.textContent = '';
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
    const rawValue = inputAmount.value.replace('₱', '').replace(/\.00/g, '').trim();
    const amount = parseFloat(rawValue);
    const messageDiv = document.querySelector('#message');
    const successMessage = document.querySelector('#successTransaction')

    if (messageDiv) messageDiv.style.visibility = 'visible'

    if (isNaN(amount) || amount <= 0) {
        if (messageDiv) {
            messageDiv.textContent = '❌ Please enter a valid positive amount.';
            messageDiv.style.color = 'red';
        }
        return;
    }

    if (!USER_ID) {
        if (messageDiv) {
            messageDiv.textContent = '❌ Error: User not logged in.';
            messageDiv.style.color = 'red';
        }
        return;
    }
    
    const transactionData = {
        userId: USER_ID,
        transactionType: type,
        amount: amount.toFixed(2)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/transaction`, { 
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(transactionData)
        });

        const result = await response.json();

        if (response.ok) {
            if (successMessage) {
                successMessage.textContent = `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} successful! Amount: ₱${result.data.amount}`;
            }
            if (messageDiv) messageDiv.style.color = 'green';
            if (inputAmount) inputAmount.value = '₱ 0.00';

            const dashSection = document.querySelector('#dashboardSection');
            if (dashSection) dashSection.classList.add('blur-sm');
            if (depositWithdrawKeyboard) depositWithdrawKeyboard.classList.add('hidden');
            if (successAlert) successAlert.classList.remove('hidden');

            fetchData();
            updateBalance();
        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please login again.');
            logout();
        } else {
            if (messageDiv) {
                messageDiv.textContent = `❌ Transaction failed: ${result.error || 'Server error.'}`;
                messageDiv.style.color = 'red';
            }
        }
    } catch (error) {
        console.error('Network Error:', error);
        if (messageDiv) {
            messageDiv.textContent = '❌ Could not connect to the server.';
            messageDiv.style.color = 'red';
        }
    }
}

async function fetchData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/transactions`, {
            credentials: 'include'
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        const data = await response.json();

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
        const response = await fetch(`${API_BASE_URL}/api/balance/${USER_ID}`, {
            credentials: 'include'
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        const data = await response.json();

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
        totalBalance.forEach(element => {
            element.innerHTML = "₱ --.--";
        });
    }
}

// Make sure these are connected to your buttons
if (depositAmountBtn) {
    depositAmountBtn.addEventListener('click', () => handleTransaction('deposit'));
}

if (withdrawAmountBtn) {
    withdrawAmountBtn.addEventListener('click', () => handleTransaction('withdraw'));
}