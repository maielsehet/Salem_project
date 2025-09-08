document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            alert('Search modal would open here');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // معالجة تسجيل الدخول
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
       
          
           let authSuccessful = false;
           for (let cred of adminCredentials) {
               if (email === cred.email && password === cred.password) {
                   authSuccessful = true;
                   break;
               }
           }
           
           if (authSuccessful) {
               errorMessage.style.display = 'none';
               alert('Login successful! Redirecting to dashboard...');
               // window.location.href = 'dashboard.html';
           } else {
               errorMessage.style.display = 'block';
           }
       });
      
    });