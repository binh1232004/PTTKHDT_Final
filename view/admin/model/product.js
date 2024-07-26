// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
// import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// const db = getDatabase();
// class ProductManager {
//     constructor(db) {
//         this.db = db;
//         this.initializeFirebase();
//         this.attachEventListeners();
//     }

//     initializeFirebase() {
//         const firebaseConfig = {
//             apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
//             authDomain: "demosoftwaretechnology.firebaseapp.com",
//             databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
//             projectId: "demosoftwaretechnology",
//             storageBucket: "demosoftwaretechnology.appspot.com",
//             messagingSenderId: "375046175781",
//             appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
//             measurementId: "G-120GXQ1F6L"
//         };
//         const app = initializeApp(firebaseConfig);
//         this.storage = getStorage();
//         this.dbRef = ref(getDatabase());
//     }

//     attachEventListeners() {
//         window.addEventListener('load', () => this.getProductCategory());
//         document.getElementById('AddBtn').addEventListener('click', (e) => this.interface(e));
//         document.getElementById('UpdateBtn').addEventListener('click', (e) => this.interface(e));
//         document.getElementById('DeleteBtn').addEventListener('click', (e) => this.interface(e));
//         document.getElementById('file-image').onchange = e => {
//             this.files = e.target.files;
//         };
//     }

//     getProductCategory() {
//         get(child(this.dbRef, 'Category')).then((category) => {
//             category.forEach((std) => {
//                 this.addProductCategory(std);
//             });
//         });
//     }

//     addProductCategory(std) {
//         let key = std.key;
//         let value = std.val();

//         let opt = document.createElement('option');
//         opt.value = value.CateID;
//         opt.innerText = value.CateName;

//         document.getElementById('ProductCategory').append(opt);
//     }

//     formatDateToYYYYMMDD(date) {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${day}/${month}/${year}`;
//     }

//     getFileName(file) {
//         var temp = file.name.split('.');
//         var fname = temp.slice(0, -1).join('.');
//         return fname;
//     }

//     async uploadProgress(file) {
//         var imgName = file.name;
//         const metaData = {
//             contentType: file.type
//         };

//         const storageRef = sRef(this.storage, "Images/" + imgName);
//         const uploadTask = uploadBytesResumable(storageRef, file, metaData);

//         return new Promise((resolve, reject) => {
//             uploadTask.on('state-changed', (snapshot) => {
//                 // Progress can be tracked here
//             }, (error) => {
//                 alert("Error: Image not uploaded!");
//                 reject(error);
//             }, () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                     resolve(downloadURL);
//                 }).catch(reject);
//             });
//         });
//     }

//     interface(e) {
//         let btnId = e.target.id;
//         let proId = document.getElementById('ProductID').value;

//         if (btnId == 'AddBtn') {
//             this.addData();
//         } else {
//             get(child(this.dbRef, 'Product/' + proId)).then((snapshot) => {
//                 if (snapshot.exists()) {
//                     if (btnId == 'UpdateBtn')
//                         this.updateData(proId);
//                     else if (btnId == 'DeleteBtn')
//                         this.deleteData(proId);
//                 } else {
//                     alert("Product does not exist");
//                 }
//             });
//         }
//     }

//     async addData() {
//         // Implementation similar to the original AddData function
//     }

//     async updateData(proId) {
//         // Implementation similar to the original UpdateData function
//     }

//     deleteData(proId) {
//         remove(ref(this.db, 'Product/' + proId)).then(() => {
//             alert("Data Deleted Successfully");
//             location.reload();
//         }).catch((error) => {
//             alert("Unsuccessful");
//             console.error(error);
//         });
//     }
// }

// // Usage
// const productManager = new ProductManager(db);
// console.log('model product')