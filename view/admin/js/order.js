import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import Utils from "../model/utils.js";
const utils = new Utils();
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

let OrderDetail = document.getElementById('order-detail');
let ODID = document.getElementById('ODID');
let Customer = document.getElementById('Customer');
let Address = document.getElementById('Address');
let Phone = document.getElementById('Phone');
let getTotal = document.getElementById('total-full');

const db = getDatabase();
$(document).ready(function () {
    var dataSet = [];
    let objData = [];
    const dbref = ref(db);
    let cusID;
    get(child(dbref, 'orders')).then(async function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let value = childSnapshot.val();
            objData.push({
                orderID: childSnapshot.key,
                address: value.address,
                email: value.email,
                items: value.items,
                name: value.name,
                note: value.note,
                orderDate: value.orderDate,
                paymentMethod: value.paymentMethod,
                phone: value.phone,
                totalAmount: value.totalAmount,
                userID: value.userID,
            });
            dataSet.push([
                childSnapshot.key,
                value.name,
                value.orderDate,
                value.totalAmount,
                value.status == true ? "Đã thanh toán" : "Chưa thanh toán"
            ]);
        });
        console.log(objData);
        // Wait for all promises to complete
        // await Promise.all(promises);
        $('#table-order').DataTable({
            // DataTable options
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Khách hàng" },
                { title: "Ngày xuất hóa đơn" },
                { title: "Thành tiền" },
                { title: "Trạng thái" }
            ],
            rowCallback: function (row, data) {
                $(row).on('click', function () {
                    let indexRow = row._DT_RowIndex;
                    $('#order-detail tbody').remove();
                    ODID.innerText = data[0];
                    let totalFull = 0;
                    Customer.innerText = objData[indexRow].name;
                    Address.innerText = objData[indexRow].address;
                    Phone.innerText = objData[indexRow].phone;
                    const details = objData[indexRow].items;
                    for (let product in details) {
                        let id = document.createElement('th');
                        let namePro = document.createElement('td');
                        let quantity = document.createElement('td');
                        let price = document.createElement('td');
                        let total = document.createElement('td');
                        id.innerHTML = product;
                        quantity.innerHTML = details[product]['quantity'];
                        namePro.innerHTML = details[product]['item_name'];
                        price.innerHTML = utils.formatToVND( details[product]['unit_price'] );
                        total.innerHTML = utils.formatToVND( details[product]['total_price'] );
                        totalFull += details[product]['total_price'];
                        getTotal.innerHTML = utils.formatToVND( totalFull );

                        let tr = document.createElement('tr');
                        tr.append(id, namePro, quantity, price, total);
                        let tbody = document.createElement('tbody');
                        tbody.appendChild(tr);
                        OrderDetail.append(tbody);

                    }
                });
            }
        });
    });
});
const logoutBtn = document.getElementById('admin__sign-out');
const pathToLogin = "../user/login.html"
logoutBtn.addEventListener('click', () => logout(pathToLogin));
