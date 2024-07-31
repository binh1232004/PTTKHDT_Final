<<<<<<< HEAD
class ProductListView {
    constructor() {
        this.listProductHTML = document.getElementById('listProduct');
    }

    formatPrice(number) {
        let formattedNumber = number.toLocaleString('vi-VN');
        return formattedNumber + "đ";
    }
 
    renderProducts(products) {
        this.listProductHTML.innerHTML = '';

        // Lặp qua các giá trị của đối tượng products
        Object.values(products).forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.productID;

            newProduct.innerHTML = `
                <a href="detail.html?id=${product.productID}">
                    <img class="card-img-top" src="${product.imgURL}" alt="${product.name}">
                </a>
                <h2>${product.name}</h2>
                <div class="price" style="font-weight: bold;">${this.formatPrice(product.price)}</div>
            `;
            this.listProductHTML.appendChild(newProduct);
        });
    }
}

export default ProductListView;
=======
class ProductListView {
    constructor() {
        this.listProductHTML = document.getElementById('listProduct');
    }

    renderProducts(products) {
        this.listProductHTML.innerHTML = '';
        products.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.productID;

            newProduct.innerHTML = `
                <a href="detail.html?id=${product.productID}">
                    <img class="card-img-top" src="${product.imgURL}" alt="${product.name}">
                </a>
                <h2>${product.name}</h2>
                <div class="price">${product.price}đ</div>
                <button class="addCart">Thêm vào giỏ hàng</button>
            `;
            this.listProductHTML.appendChild(newProduct);
        });
    }

    bindAddToCart(handler) {
        this.listProductHTML.addEventListener('click', (event) => {
            if (event.target.classList.contains('addCart')) {
                const productId = event.target.closest('.item').dataset.id;
                handler(productId);
            }
        });
    }
}

export default ProductListView;
>>>>>>> 112f5d1b5ff7b037e7c0aeef85ce575b4838aee1
