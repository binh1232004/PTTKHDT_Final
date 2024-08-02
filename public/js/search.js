import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, query, orderByChild, startAt, endAt } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase configuration
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
const db = getDatabase(app);

// Function to search products
async function searchProducts(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const input = document.getElementById('cloth-input').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('search-results');

    if (input === '') {
        alert('Please enter a search term.');
        resultsContainer.innerHTML = ''; // Clear previous results
        return;
    }

    const productsRef = ref(db, 'Product');
    const q = query(
        productsRef,
        orderByChild('Name')
    );

    try {
        const snapshot = await get(q);
        if (!snapshot.exists()) {
            resultsContainer.innerHTML = '<p>No products found.</p>';
            return;
        }

        let resultsHTML = '<ul>';
        snapshot.forEach(childSnapshot => {
            const value = childSnapshot.val();
            const productName = value.Name.toLowerCase();

            if (productName.includes(input)) {
                let imagesHtml = '';
                if (value.Images) {
                    const firstImageKey = Object.keys(value.Images)[0];
                    if (firstImageKey) {
                        let imgURL = value.Images[firstImageKey].ImgURL.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        imagesHtml = `<img class="card-img-top" src="${imgURL}" alt="${value.Name}" style="width: 100px; height: auto;">`;
                    }
                }

                let sizesHtml = '';
                if (value.Size) {
                    for (let size in value.Size) {
                        if (value.Size[size]) {
                            sizesHtml += `<li class="size-item">${size}</li>`;
                        }
                    }
                }

                resultsHTML += `
                    <li class="card" style="margin: 10px; padding: 10px; border: 1px solid #ccc;">
                        <div class="product-image">
                            ${imagesHtml}
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${value.Name}</h3>
                            <div class="price">${value.Price}đ</div>
                            <div class="size-product d-flex flex-column">
                                <div class="size-top d-flex justify-content-between">
                                    <p class="card-subtitle">Kích thước:</p>
                                    <a href="#">Hướng dẫn chọn size</a>
                                </div>
                                <div class="size-option">
                                    <ul style="margin: 10px; padding: 0;">
                                        ${sizesHtml}
                                    </ul>
                                </div>
                            </div>
                            <div class="addCart d-flex">
                                <a href="detail.html?id=${value.ProductID}">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"/>
                                    </svg>
                                    <p class="card-text">Thêm vào giỏ hàng</p>
                                </a>
                            </div>
                            <div class="d-flex aftee">
                                <div class="col-2 align-self-center">Trả sau với</div>
                                <div class="col-6"><a href="#" class="af-logo"><img src="images/AFTEE_logo_no_space.png" alt=""></a></div>
                            </div>
                            <hr>
                            <div class="product-chat">
                                <a href="#"><img src="images/Logo-zalo.svg" alt="" style="width: 40px; height: 40px; margin-right: 5px;"><b>Chat để được FishBig tư vấn <b>&#40</b>8:30 - 22:00 <b>&#41</b></b></a>
                            </div>
                            <div class="d-flex product-policy">
                                <div class="d-flex row">
                                    <div class="row">
                                        <div class="col-3 policy-icon"><img src="images/Policy/return.svg" alt="Đổi trả với số điện thoại"></div>
                                        <div class="col-9 policy-title">Đổi trả cực dễ chỉ cần <br> số điện thoại</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-3 policy-icon"><img src="images/Policy/return-60.svg" alt="Đổi hàng trong 60 ngày"></div>
                                        <div class="col-9 policy-title">60 ngày đổi trả vì bất kỳ lý do gì</div>
                                    </div>
                                </div>
                                <div class="d-flex row">
                                    <div class="row">
                                        <div class="col-3 policy-icon"><img src="images/Policy/phone.svg" alt="Hotline: 0123456789"></div>
                                        <div class="col-9 policy-title">Hotline 0123456789 hỗ <br>trợ từ 8h30 - 22h mỗi ngày</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-3 policy-icon"><img src="images/Policy/location.svg" alt="Trả hàng tận nơi"></div>
                                        <div class="col-9 policy-title">Đến tận nơi nhận hàng trả, <br> hoàn tiền trong 24h</div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="product-features">
                                <div class="features">
                                    <p class="features-heading">Đặc điểm nổi bật</p>
                                    <div class="features-listing">
                                        ${value.Description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                `;
            }
        });
        resultsHTML += '</ul>';
        resultsContainer.innerHTML = resultsHTML;
    } catch (error) {
        console.error('Error searching products:', error);
        alert('Error searching products. Please try again later.');
    }
}

// Attach event listener to form on page load
window.addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('.header-actions-search form');
    if (form) {
        form.addEventListener('submit', searchProducts);
    }
});
