// Import the functions you need from the SDKs you need
import { getDatabase, ref, get, update, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

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

//****************************  DATABASE  ************************* */
export class Database {
    constructor() {
        this.db = getDatabase(app);
    }

    getUser(userId) {
        const dbRef = ref(this.db);
        return get(child(dbRef, `User/${userId}`));
    }

    updateUser(userId, userData) {
        return update(ref(this.db, `User/${userId}`), userData);
    }
}
