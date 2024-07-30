let userProfile =  document.getElementById('go_order');
let path;

userProfile.addEventListener('click',()=>{
    if(localStorage.getItem('userID') !== "null"){
        console.log('user');
        path = "/CNPM_Final/view/user/profile/user_order_UI.html";
    }
    else
        path = "#";
    window.location.href = path;
})