document.getElementById('alternateRecipient').addEventListener('change', function () {
    let popup = document.getElementById('alternateRecipient-popup');
    if (this.checked) {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const provincesSelect = document.getElementById('provinces');
    const districtsSelect = document.getElementById('districts');
    const wardsSelect = document.getElementById('wards');

    function fetchProvinces() {
        fetch('public/PDW/provinces.json')
            .then(response => response.json())
            .then(data => populateSelect(provincesSelect, data, 'PROVINCE_ID', 'PROVINCE_NAME', fetchDistricts))
            .catch(error => console.error('Error fetching provinces:', error));
    }

    function fetchDistricts(provinceId) {
        fetch('public/PDW/districts.json')
            .then(response => response.json())
            .then(data => {
                const filteredDistricts = data.filter(district => district.PROVINCE_ID == provinceId);
                populateSelect(districtsSelect, filteredDistricts, 'DISTRICT_ID', 'DISTRICT_NAME', fetchWards);
                districtsSelect.disabled = false;
            })
            .catch(error => console.error('Error fetching districts:', error));
    }

    function fetchWards(districtId) {
        fetch('public/PDW/wards.json')
            .then(response => response.json())
            .then(data => {
                const filteredWards = data.filter(ward => ward.DISTRICT_ID == districtId);
                populateSelect(wardsSelect, filteredWards, 'WARDS_ID', 'WARDS_NAME');
                wardsSelect.disabled = false;
            })
            .catch(error => console.error('Error fetching wards:', error));
    }

    function populateSelect(selectElement, data, valueField, textField, nextFetchFunction) {
        let defaultText = '-- Chọn --';
        if (selectElement === provincesSelect) defaultText = '-- Chọn Tỉnh --';
        if (selectElement === districtsSelect) defaultText = '-- Chọn Quận/Huyện --';
        if (selectElement === wardsSelect) defaultText = '-- Chọn Phường/Xã --';

        selectElement.innerHTML = `<option selected>${defaultText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });

        if (nextFetchFunction) {
            selectElement.addEventListener('change', function () {
                nextFetchFunction(this.value);
            });
        }
    }

    fetchProvinces();

    provincesSelect.addEventListener('change', function () {
        resetSelect(districtsSelect, '-- Chọn Quận/Huyện --');
        resetSelect(wardsSelect, '-- Chọn Phường/Xã --');
        if (this.value) {
            fetchDistricts(this.value);
        }
    });

    districtsSelect.addEventListener('change', function () {
        resetSelect(wardsSelect, '-- Chọn Phường/Xã --');
        if (this.value) {
            fetchWards(this.value);
        }
    });

    function resetSelect(selectElement, defaultText) {
        selectElement.innerHTML = `<option selected>${defaultText}</option>`;
        selectElement.disabled = true;
    }

    // Function to retrieve products from localStorage
    function getProductsFromLocalStorage() {
        const products = localStorage.getItem('products');
        if (products) {
            return JSON.parse(products);
        }
        return [];
    }

    const displayCartItems = () => {
        listCartHTML.innerHTML = ''; // Xóa nội dung cũ đi để cập nhật lại
    
        carts.forEach(cart => {
            let product = listProducts.find(p => p.ProductID == cart.ProductID);
            if (product) {
                let newCartItem = document.createElement('div');
                newCartItem.classList.add('cart-item');
                newCartItem.innerHTML = `
                    <div class="image">
                        <img src="${product.Images ? product.Images[0].ImgURL : ''}" alt="${product.Name}">
                    </div>
                    <div class="details">
                        <h3>${product.Name}</h3>
                        <p>Đơn giá: ${product.Price}đ</p>
                        <p>Số lượng: ${cart.quantity}</p>
                        <p>Tổng tiền: ${product.Price * cart.quantity}đ</p>
                    </div>
                `;
                listCartHTML.appendChild(newCartItem);
            }
        });
    }
    displayCartItems();
});

document.querySelectorAll('input[name="payments"]').forEach((input) => {
    input.addEventListener('change', function() {
        document.querySelectorAll('.custom-color').forEach((div) => {
            div.classList.remove('active');
        });
        if (this.checked) {
            this.closest('.custom-color').classList.add('active');
        }
    });
});

