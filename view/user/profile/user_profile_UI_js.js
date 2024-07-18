// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
  
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
  authDomain: "demosoftwaretechnology.firebaseapp.com",
  databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
  projectId: "demosoftwaretechnology",
  storageBucket: "demosoftwaretechnology.appspot.com",
  messagingSenderId: "375046175781",
  appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
  measurementId: "G-120GXQ1F6L"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import{getDatabase, ref, get, set, child, update, remove}
from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
    
const db=getDatabase();

//****************************  USER_ID  ************************* */
var user_id = localStorage.getItem('userID');


//************************************ get element ***********************************
var user_fullname=document.getElementById("user_fullName")
var user_phone=document.getElementById("user_phone")
var user_address=document.getElementById("user_address")
var user_email=document.getElementById("user_email")
var user_birth=document.getElementById("user_birth")
var user_createDate=document.getElementById("user_createDate")

var updUser = document.getElementById("updUser")

//********************** select user function ************************
document.addEventListener('DOMContentLoaded', function SelectUser(){
    const dbref=ref(db);
    get(child(dbref, "User/"+ user_id)).then((snapshot)=>{
        if(snapshot.exists()){
        user_fullname.value=snapshot.val().FullName;
        user_phone.value=snapshot.val().Phone;
        user_address.value=snapshot.val().Address;
        user_email.value=snapshot.val().Email;
        user_birth.value=snapshot.val().Birth;
        user_createDate.value=snapshot.val().CreateDate;
        }
        else{
        alert("No data found");
        }
    })
    .catch((error)=>{
        alert("unsuccessful, error"+error);
    });
});

//******************** Update user ********************
function UpdateUser(){
if (confirm("Do you want to save changes?") == true) {	
    var curDate = new Date();
    var curDay = curDate.getDate();
    var curMonth = curDate.getMonth() + 1;
    var curYear = curDate.getFullYear();
    var now = curDay + "/" + curMonth + "/" + curYear
  update(ref(db, "User/" + user_id), {
    FullName: user_fullname.value,
    Phone: user_phone.value,
    Address: user_address.value,
    Email: user_email.value,
    Birth: user_birth.value,
    CreateDate: user_createDate.value,
    UpdateDate: now,
  })
  .then(()=>{
    alert("data stored successfully");
  })
  .catch((error)=>{
    alert("unsuccessful, error"+error);
  });
} else {
    alert("Save Canceled!");
}
}

updUser.addEventListener('click', UpdateUser);