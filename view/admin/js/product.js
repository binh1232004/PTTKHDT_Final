import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);

import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const db = getDatabase();

let AddBtn = document.getElementById('AddBtn');
let UpdBtn = document.getElementById('UpdateBtn');
let DelBtn = document.getElementById('DeleteBtn');

let ProductID = document.getElementById('ProductID');
let ProductName = document.getElementById('ProductName');
let ProductPrice = document.getElementById('ProductPrice');
let ProductCategory = document.getElementById('ProductCategory');
let ProductPromotion = document.getElementById('range');
let Description = document.getElementById('Description');

//========================= HIỆN THỊ DANH MỤC SẢN PHẨM ==================================
let stdno = 1;

function getProductCategory() {
    const dbref = ref(db);
    get(child(dbref, 'Category')).then((category)=>{
        category.forEach(std => {
            AddProductCategory(std);
        });
    })
}

function AddProductCategory(std) {
    let key = std.key;
    let value = std.val();

    let opt = document.createElement('option');

    opt.value = value.CateID;
    opt.innerText = value.CateName;

    ProductCategory.append(opt);

    stdno++;
}

window.addEventListener('load', getProductCategory);

//=================================================SETUP TODAY=================================
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const today = new Date();
const formattedDate = formatDateToYYYYMMDD(today);


//=================================== ĐỌC FILE IMAGE=============================================

var files = [];
var proglab = document.getElementById('UpProgress');

var input = document.getElementById('file-image');

input.onchange = e => {
    files = e.target.files;
}

// function GetFileExt(file) {
//     var temp = file.name.split('.');
//     var ext = temp.slice((temp.length - 1), (temp.length));
//     return '.' + ext[0];
// }

function GetFileName(file) {
    var temp = file.name.split('.');
    var fname = temp.slice(0, -1).join('.');
    return fname;
}

async function UploadProgress(file) {
    var ImgToUpload = file;
    var imgName = file.name;
    const metaData = {
        contentType: ImgToUpload.type
    };

    const storage = getStorage();
    const storageRef = sRef(storage, "Images/" + imgName);
    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

    return new Promise((resolve, reject) => {
        UploadTask.on('state-changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // You can update a progress bar here if you want
        }, (error) => {
            alert("Error: Image not uploaded!");
            reject(error);
        }, () => {
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            }).catch(reject);
        });
    });
}

function Interface(e) {
    const dbref = ref(db);
    let BtnId = e.target.id;
    let ProId = document.getElementById('ProductID').value;

    if (BtnId == 'AddBtn') {
        AddData();
    } else {
        get(child(dbref, 'Product/' + ProId)).then((snapshot)=>{
            if(snapshot.exists()){
                if (BtnId == 'UpdateBtn')
                    UpdateData(ProId);
                else if (BtnId == 'DeleteBtn')
                    DeleteData(ProId); 
            }
            else {
                if (BtnId == 'UpdateBtn')
                    alert("Cannot update, product does not exist");
                else if (BtnId == 'DeleteBtn')
                    alert("Cannot delete, product does not exist");
            }
        });
    }
}

async function AddData() {
    var checkbox = document.getElementsByName('size');
    var image = {};

    for (const file of files) {
        try {
            const url = await UploadProgress(file);
            console.log(url);
            var getName = GetFileName(file);
            image[getName] = {
                ImgName: file.name,
                ImgURL: url
            };
        } catch (error) {
            console.log("Failed to upload file: ", file.name, error);
            alert("Some images failed to upload. Please try again.");
            return; // Exit if any upload fails
        }
    }
    const counterRef = ref(db, 'ProductCounter');
    runTransaction(counterRef, (currentValue) => {
        return (currentValue || 0) + 1;
    }).then(({ snapshot }) => {
        const newCateId = 'SP' + formatCounter(snapshot.val());

        // Lấy nội dung từ TinyMCE editor
        let detailContent = tinymce.get('Detail').getContent();

        set(ref(db, 'Product/' + newCateId), {
            ProductID: newCateId,
            Name: ProductName.value,
            Price: Number(ProductPrice.value),
            Promotion: Number(ProductPromotion.value),
            Size: {
                XS: checkbox[0].checked,
                S: checkbox[1].checked,
                M: checkbox[2].checked,
                L: checkbox[3].checked,
                XL: checkbox[4].checked,
                '2XL': checkbox[5].checked,
                '3XL': checkbox[6].checked,
                '4XL': checkbox[7].checked
            },
            Category: ProductCategory.value,
            Images: image,
            CreateDate: formattedDate,
            UpdateDate: formattedDate,
            Detail: detailContent,
            Description: Description.value
        }).then(() => {
            alert("Data Added Successfully with ID: " + newCateId);
            location.reload();
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }).catch((error) => {
        alert("Transaction failed");
        console.log(error);
    });
}

function RetData(ID){
    const dbref = ref(db);

    get(child(dbref, 'Product/' + ID)).then((snapshot)=>{
        if(snapshot.exists()) {
            ProductID.value = snapshot.val().ProductID;
            ProductName.value = snapshot.val().Name;
            ProductPrice.value = snapshot.val().Price;
            ProductCategory.value = snapshot.val().Category;
            // Detail.value = snapshot.val().Detail;
            // Hiển thị nội dung từ Firebase lên trình soạn thảo TinyMCE
            let detailContent = snapshot.val().Detail;
            tinymce.get('Detail').setContent(detailContent);
            Description.value = snapshot.val().Description;
        }
        else {
            alert("Product does not exist");
        }
    })
    .catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}

async function UpdateData(ProID){

    var checkbox = document.getElementsByName('size');
    var image = {};

    for (const file of files) {
        try {
            const url = await UploadProgress(file);
            console.log(url);
            var getName = GetFileName(file);
            image[getName] = {
                ImgName: file.name,
                ImgURL: url
            };
        } catch (error) {
            console.log("Failed to upload file: ", file.name, error);
            alert("Some images failed to upload. Please try again.");
            return; 
        }
    }

    // Lấy nội dung từ trình soạn thảo TinyMCE
    let detailContent = tinymce.get('Detail').getContent();

    update(ref(db, 'Product/' + ProID), {
        Name: ProductName.value,
        Price: Number(ProductPrice.value),
        Promotion: Number(ProductPromotion.value),
        Size: {
            XS: checkbox[0].checked,
            S: checkbox[1].checked,
            M: checkbox[2].checked,
            L: checkbox[3].checked,
            XL: checkbox[4].checked,
            '2XL': checkbox[5].checked,
            '3XL': checkbox[6].checked,
            '4XL': checkbox[7].checked
        },
        Category: ProductCategory.value,
        Images: image,
        UpdateDate: formattedDate,
        Detail: detailContent,
        Description: Description.value
    }).then(()=>{
        alert("Data Updated Successfully");
        location.reload();
    }).catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}

function DeleteData(ProID){
    remove(ref(db, 'Product/' + ProID), {

    }).then(()=>{
        alert("Data Deleted Successfully");
        location.reload();
    }).catch((error)=>{
        alert("Unsuccessful");
        console.log(error);
    })
}

AddBtn.addEventListener('click', Interface);
UpdBtn.addEventListener('click', Interface);
DelBtn.addEventListener('click', Interface);

//===================================DANH SÁCH SẢN PHẨM=====================================

$(document).ready(function() {
    var dataSet = [];
    const dbref = ref(db);

    get(child(dbref, 'Product')).then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var value = childSnapshot.val();
            const productID = childSnapshot.key;
            dataSet.push([
                productID,
                value.Name,
                value.Price,
                value.CreateDate,
                value.UpdateDate
            ]);
        });
        var table = $('#listProduct').DataTable({
            // DataTable options
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Sản phẩm" },
                { title: "Đơn giá" },
                { title: "Ngày tạo" },
                { title: "Ngày cập nhật" }
            ],
            rowCallback: function(row, data) {
                $(row).on('click', function() {
                    get(child(dbref, 'Product/' + data[0])).then((snapshot)=>{
                        if(snapshot.exists()) {
                            ProductID.value = snapshot.key;
                            ProductName.value = snapshot.val().Name;
                            ProductPrice.value = snapshot.val().Price;
                            ProductCategory.value = snapshot.val().Category;
                            let detailContent = snapshot.val().Detail;
                            tinymce.get('Detail').setContent(detailContent);
                            Description.value = snapshot.val().Description;
                        }
                        else {
                            alert("Product does not exist");
                        }
                    })
                    .catch((error)=>{
                        alert("Unsuccessful");
                        console.log(error);
                    })
                });
                $(row).on('mouseenter', function() {
                    
                });
            }
        });
    });
});




//===================================PRIMARY KEY=============================================
function initializeCounter() {
    const counterRef = ref(db, 'ProductCounter');
    get(counterRef).then((snapshot) => {
        if (!snapshot.exists()) {
            set(counterRef, 0).then(() => {
                console.log("ProductCounter initialized to SP00000");
            }).catch((error) => {
                console.error("Error initializing counter:", error);
            });
        } else {
            console.log("ProductCounter already initialized");
        }
    }).catch((error) => {
        console.error("Error checking counter:", error);
    });
}

function formatCounter(value) {
    return value.toString().padStart(5, '0');
}

function resetCounter() {
    const counterRef = ref(db, 'ProductCounter');
    set(counterRef, + 0).then(() => {
        alert("ProductCounter has been reset to SP00000");
    }).catch((error) => {
        console.error("Error resetting counter:", error);
    });
}

// Initialize counter on application start
initializeCounter();

// Call this function to reset the counter
// resetCounter();

