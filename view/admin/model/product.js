import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

class ProductManager {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
            authDomain: "demosoftwaretechnology.firebaseapp.com",
            databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
            projectId: "demosoftwaretechnology",
            storageBucket: "demosoftwaretechnology.appspot.com",
            messagingSenderId: "375046175781",
            appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
            measurementId: "G-120GXQ1F6L"
        };

        this.app = initializeApp(this.firebaseConfig);
        this.db = getDatabase();

        this.AddBtn = document.getElementById('AddBtn');
        this.UpdBtn = document.getElementById('UpdateBtn');
        this.DelBtn = document.getElementById('DeleteBtn');

        this.ProductID = document.getElementById('ProductID');
        this.ProductName = document.getElementById('ProductName');
        this.ProductPrice = document.getElementById('ProductPrice');
        this.ProductCategory = document.getElementById('ProductCategory');
        this.ProductPromotion = document.getElementById('range');
        this.Description = document.getElementById('Description');

        this.files = [];
        this.proglab = document.getElementById('UpProgress');
        this.input = document.getElementById('file-image');
        this.input.onchange = e => this.files = e.target.files;

        this.stdno = 1;
        this.today = new Date();
        this.formattedDate = this.formatDateToYYYYMMDD(this.today);

        window.addEventListener('load', () => this.getProductCategory());
        this.AddBtn.addEventListener('click', (e) => this.Interface(e));
        this.UpdBtn.addEventListener('click', (e) => this.Interface(e));
        this.DelBtn.addEventListener('click', (e) => this.Interface(e));
        $(document).ready(() => {
            var dataSet = [];
            const dbref = ref(this.db);

            get(child(dbref, 'Product')).then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var value = childSnapshot.val();
                    dataSet.push([
                        value.ProductID,
                        value.Name,
                        value.Price,
                        value.CreateDate,
                        value.UpdateDate
                    ]);
                });
                console.log(dataSet);
                var table = $('#listProduct').DataTable({
                    // DataTable options
                    data: dataSet,
                    columns: [
                        { title: "ID" },
                        { title: "Name" },
                        { title: "Price" },
                        { title: "Create Date" },
                        { title: "Update Date" }
                    ],
                    rowCallback: function (row, data) {
                        $(row).on('click', function () {
                            get(child(dbref, 'Product/' + data[0])).then((snapshot) => {
                                if (snapshot.exists()) {
                                    ProductID.value = snapshot.val().ProductID;
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
                                .catch((error) => {
                                    alert("Unsuccessful");
                                    console.log(error);
                                })
                        });
                        $(row).on('mouseenter', function () {

                        });
                    }
                });
            });
        });
    }

    formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    getProductCategory() {
        const dbref = ref(this.db);
        get(child(dbref, 'Category')).then((category) => {
            category.forEach(std => {
                this.AddProductCategory(std);
            });
        });
    }

    AddProductCategory(std) {
        let key = std.key;
        let value = std.val();

        let opt = document.createElement('option');
        // opt.value = value.CateID;
        opt.value = key;
        opt.innerText = value.CateName;
        this.ProductCategory.append(opt);
        this.stdno++;
    }

    GetFileName(file) {
        var temp = file.name.split('.');
        var fname = temp.slice(0, -1).join('.');
        return fname;
    }

    async UploadProgress(file) {
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

    Interface(e) {
        const dbref = ref(this.db);
        let BtnId = e.target.id;
        let ProId = this.ProductID.value;

        if (BtnId == 'AddBtn') {
            this.AddData();
        } else {
            get(child(dbref, 'Product/' + ProId)).then((snapshot) => {
                if (snapshot.exists()) {
                    if (BtnId == 'UpdateBtn')
                        this.UpdateData(ProId);
                    else if (BtnId == 'DeleteBtn')
                        this.DeleteData(ProId);
                } else {
                    if (BtnId == 'UpdateBtn')
                        alert("Cannot update, product does not exist");
                    else if (BtnId == 'DeleteBtn')
                        alert("Cannot delete, product does not exist");
                }
            });
        }
    }

    async AddData() {
        var checkbox = document.getElementsByName('size');
        var image = {};
        for (const file of this.files) {
            try {
                const url = await this.UploadProgress(file);
                console.log(url);
                var getName = this.GetFileName(file);
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
        const counterRef = ref(this.db, 'ProductCounter');
        runTransaction(counterRef, (currentValue) => {
            return (currentValue || 0) + 1;
        }).then(({ snapshot }) => {
            const newCateId = 'SP' + this.formatCounter(snapshot.val());
            // Lấy nội dung từ TinyMCE editor
            let detailContent = tinymce.get('Detail').getContent();
            set(ref(this.db, 'Product/' + newCateId), {
                ProductID: newCateId,
                Name: this.ProductName.value,
                Price: Number(this.ProductPrice.value),
                Promotion: Number(this.ProductPromotion.value),
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
                Category: this.ProductCategory.value,
                Images: image,
                CreateDate: this.formattedDate,
                UpdateDate: this.formattedDate,
                Detail: detailContent,
                Description: this.Description.value
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

    RetData(ID) {
        const dbref = ref(this.db);

        get(child(dbref, 'Product/' + ID)).then((snapshot) => {
            if (snapshot.exists()) {
                this.ProductID.value = snapshot.val().ProductID;
                this.ProductName.value = snapshot.val().Name;
                this.ProductPrice.value = snapshot.val().Price;
                this.ProductCategory.value = snapshot.val().Category;
                // Detail.value = snapshot.val().Detail;
                // Hiển thị nội dung từ Firebase lên trình soạn thảo TinyMCE
                let detailContent = snapshot.val().Detail;
                tinymce.get('Detail').setContent(detailContent);
                this.Description.value = snapshot.val().Description;
            } else {
                alert("Product does not exist");
            }
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    async UpdateData(ProID) {
        var checkbox = document.getElementsByName('size');
        var image = {};

        for (const file of this.files) {
            try {
                const url = await this.UploadProgress(file);
                console.log(url);
                var getName = this.GetFileName(file);
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

        update(ref(this.db, 'Product/' + ProID), {
            Name: this.ProductName.value,
            Price: Number(this.ProductPrice.value),
            Promotion: Number(this.ProductPromotion.value),
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
            Category: this.ProductCategory.value,
            Images: image,
            UpdateDate: this.formattedDate,
            Detail: detailContent,
            Description: this.Description.value
        }).then(() => {
            alert("Data Updated Successfully");
            location.reload();
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    DeleteData(ProID) {
        const dbref = ref(this.db, 'Product/' + ProID);
        remove(dbref).then(() => {
            alert("Data Deleted Successfully");
            location.reload();
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    formatCounter(counter) {
        return String(counter).padStart(5, '0');
    }
}

// Initialize the ProductManager
const productManager = new ProductManager();