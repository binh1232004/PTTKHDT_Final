import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
class OrderManager{
    constructor() {
        this.initializeFirebase();
        this.db = getDatabase();
        this.dbRef = ref(this.db);
    }

    initializeFirebase() {
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
        initializeApp(firebaseConfig);
    }

    async loadOrders() {
        let dataSet = [];
        const snapshot = await get(child(this.dbRef, 'Orders'));
        let promises = snapshot.forEach((childSnapshot) => {
            var value = childSnapshot.val();
            let userPromise = get(child(this.dbRef, 'User/' + value.UserID)).then((userSnapshot) => {
                let userName = userSnapshot.exists() ? userSnapshot.val().FullName : "Unknown";
                let checkStatus = value.Status ? "Đã thanh toán" : "Chưa thanh toán";
                dataSet.push([value.OrderID, userName, value.OrderDate, value.Total, checkStatus]);
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
            return userPromise;
        });
        await Promise.all(promises);
        this.populateDataTable(dataSet);
    }

    populateDataTable(dataSet) {
        $('#table-order').DataTable({
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Khách hàng" },
                { title: "Ngày xuất hóa đơn" },
                { title: "Thành tiền" },
                { title: "Trạng thái"}
            ]
        });
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('admin__sign-out');
        const pathToLogin = "../user/login.html";
        logoutBtn.addEventListener('click', () => this.logout(pathToLogin));
    }

    logout(pathToLogin) {
        // Implement logout functionality
        console.log(`Redirecting to ${pathToLogin}`);
    }
}

$(document).ready(function() {
    const firebaseService = new OrderManager();
    firebaseService.loadOrders();
    firebaseService.setupEventListeners();
});