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
