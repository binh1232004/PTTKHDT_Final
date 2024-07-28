import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import Utils from "./utils.js";
class Order {
    constructor(){
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
        const app = initializeApp(this.firebaseConfig);
        this.db = getDatabase();
        this.utils = new Utils();
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
                    if (day ) {
                        arrSales[day - 1] += value.totalAmount;
                    }
                });
                resolve(arrSales);
            });
        });
    }
}

export default Order;