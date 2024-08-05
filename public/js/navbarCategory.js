import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Cấu hình Firebase
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function formatPrice(number) {
    let formattedNumber = number.toLocaleString('vi-VN');
    return formattedNumber + "đ";
}

// Hàm lấy dữ liệu từ Firebase và hiển thị lên trang chủ
async function displayProductsOnHomepage(category = null) {
    const listProductHTML = document.getElementById('homepage-products');

    let productsRef = ref(db, 'Product');
    let q;

    if (category) {
        q = query(productsRef, orderByChild('Category'), equalTo(category));
    } else {
        q = query(productsRef, orderByChild('Name'));
    }

    try {
        const snapshot = await get(q);
        if (!snapshot.exists()) {
            listProductHTML.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
            return;
        }

        listProductHTML.innerHTML = '';

        snapshot.forEach(childSnapshot => {
            const value = childSnapshot.val();
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = value.ProductID;

            newProduct.innerHTML = `
                <a href="detail.html?id=${value.ProductID}">
                    <img class="card-img-top" src="${value.Images ? Object.values(value.Images)[0].ImgURL : ''}" alt="${value.Name}">
                </a>
                <h2>${value.Name}</h2>
                <div class="price" style="font-weight: bold;">${formatPrice(value.Price)}</div>
            `;

            listProductHTML.appendChild(newProduct);
        });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        alert('Lỗi khi lấy sản phẩm. Vui lòng thử lại sau.');
    }
}

// Gắn sự kiện lắng nghe khi trang tải
window.addEventListener('DOMContentLoaded', (event) => {
    displayProductsOnHomepage();
    initializeCategoryEvents();
});

// Hàm khởi tạo sự kiện cho danh mục
function initializeCategoryEvents() {
    const categoryElements = document.querySelectorAll('.navbar-nav .nav-item .dropdown-item');
    categoryElements.forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.innerText.trim().toUpperCase();
            displayProductsOnHomepage(category);
        });
    });
}
