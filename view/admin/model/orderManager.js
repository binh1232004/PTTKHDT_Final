import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import Utils from "./utils.js";
import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

class OrderManager {
    constructor() {
        this.utils = new Utils();
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

        this.OrderDetail = document.getElementById('order-detail');
        this.ODID = document.getElementById('ODID');
        this.Customer = document.getElementById('Customer');
        this.Address = document.getElementById('Address');
        this.Phone = document.getElementById('Phone');
        this.getTotal = document.getElementById('total-full');

        this.init();
    }

    async fetchOrders() {
        const dbref = ref(this.db);
        let objData = [];
        let dataSet = [];

        const snapshot = await get(child(dbref, 'orders'));
        snapshot.forEach(childSnapshot => {
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

        return { objData, dataSet };
    }

    initDataTable(dataSet, objData) {
        $('#table-order').DataTable({
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Khách hàng" },
                { title: "Ngày xuất hóa đơn" },
                { title: "Thành tiền" },
                { title: "Trạng thái" }
            ],
            rowCallback: (row, data) => {
                $(row).on('click', () => {
                    this.handleRowClick(row, data, objData);
                });
            }
        });
    }

    handleRowClick(row, data, objData) {
        let indexRow = row._DT_RowIndex;
        $('#order-detail tbody').remove();
        this.ODID.innerText = data[0];
        let totalFull = 0;
        this.Customer.innerText = objData[indexRow].name;
        this.Address.innerText = objData[indexRow].address;
        this.Phone.innerText = objData[indexRow].phone;
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
            price.innerHTML = this.utils.formatToVND(details[product]['unit_price']);
            total.innerHTML = this.utils.formatToVND(details[product]['total_price']);
            totalFull += details[product]['total_price'];
            this.getTotal.innerHTML = this.utils.formatToVND(totalFull);

            let tr = document.createElement('tr');
            tr.append(id, namePro, quantity, price, total);
            let tbody = document.createElement('tbody');
            tbody.appendChild(tr);
            this.OrderDetail.append(tbody);
        }
    }
    getArrSalesOnEachDayInOneMonth(month, year) {
        const dbref = ref(this.db);
        const daysInMonth = new Date(year, month, 0).getDate();
        let arrSales = Array.from({ length: daysInMonth }, () => 0);
        return new Promise((resolve, reject) => {
            get(child(dbref, 'orders')).then(snapshot => {
                snapshot.forEach(childSnapshot => {
                    let value = childSnapshot.val();
                    const { day } = this.utils.getDayMonthYearInOrder(value.orderDate);
                    if (day && value.status) {
                        arrSales[day - 1] += value.totalAmount;
                    }
                });
                resolve(arrSales);
            });
        });
    }
    async init() {
        const { objData, dataSet } = await this.fetchOrders();
        this.initDataTable(dataSet, objData);

        const logoutBtn = document.getElementById('admin__sign-out');
        const pathToLogin = "../user/login.html";
        logoutBtn.addEventListener('click', () => this.logout(pathToLogin));
    }
    logout(pathToLogin) {
        // Implement logout functionality here
        window.location.href = pathToLogin;
    }


}
export default OrderManager;
document.addEventListener('DOMContentLoaded', () => {
    new OrderManager();
});
