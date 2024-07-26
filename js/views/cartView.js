<<<<<<< HEAD
class CartView {
    constructor() {
        this.listCartHTML = document.querySelector('.listCart');
        this.iconCartSpan = document.querySelector('.icon-cart span');
        this.iconCart = document.querySelector('.icon-cart');
        this.closeBtn = document.querySelector('.cartTab .close');
        this.body = document.querySelector('body');

        this.closeBtn.addEventListener('click', this.closeCart.bind(this));
    }

    renderCart(cartItems, products) {
        this.listCartHTML.innerHTML = '';
        let totalQuantity = 0;

        cartItems.forEach(cart => {
            totalQuantity += cart.quantity;
            let product = null;
            for (let p of products) {
                if (p.id === cart.productID) {
                    product = p;
                    break;
                }
            }

            if (!product) return;

            const newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.productID;

            newCart.innerHTML = `
                <div class="image">
                    <img src="${product.imgURL}" alt="${product.name}">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">${product.price * cart.quantity}đ</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            this.listCartHTML.appendChild(newCart);
        });
        this.iconCartSpan.innerText = totalQuantity;
    }

    toggleCart() {
        this.body.classList.toggle('showCart');
    }

    closeCart() {
        this.body.classList.remove('showCart');
    }

    bindChangeQuantity(handler) {
        this.listCartHTML.addEventListener('click', (event) => {
            if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {
                const productId = event.target.closest('.item').dataset.id;
                const type = event.target.classList.contains('plus') ? 'plus' : 'minus';
                handler(productId, type);
            }
        });
    }
}

export default CartView;
=======
class CartView {
    constructor() {
        this.listCartHTML = document.querySelector('.listCart');
        this.iconCartSpan = document.querySelector('.icon-cart span');
        this.iconCart = document.querySelector('.icon-cart');
        this.closeBtn = document.querySelector('.cartTab .close');
        this.checkoutBtn = document.querySelector('.cartTab .makePayment')
        this.body = document.querySelector('body');

        this.closeBtn.addEventListener('click', this.closeCart.bind(this));
        this.checkoutBtn.addEventListener('click', this.openPayment.bind(this))
    }

    renderCart(cartItems, products) {        
        this.listCartHTML.innerHTML = '';
        let totalQuantity = 0;

        cartItems.forEach(cart => {
            totalQuantity += cart.quantity;
            let product = null;
            for (let p of products) {
                if (p.id === cart.productID) {
                    product = p;
                    break;
                }
            }

            if (!product) return;

            const newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.productID;

            newCart.innerHTML = `
                <div class="image">
                    <img src="${product.imgURL}" alt="${product.name}">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">${product.price * cart.quantity}đ</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            this.listCartHTML.appendChild(newCart);
        });
        this.iconCartSpan.innerText = totalQuantity;
    }

    toggleCart() {
        this.body.classList.toggle('showCart');
    }

    closeCart() {
        this.body.classList.remove('showCart');
    }
    
    openPayment(){
        window.location.href = '../../pageCart.html'
    }

    bindChangeQuantity(handler) {
        this.listCartHTML.addEventListener('click', (event) => {
            if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {
                const productId = event.target.closest('.item').dataset.id;
                const type = event.target.classList.contains('plus') ? 'plus' : 'minus';
                handler(productId, type);
            }
        });
    }
}

export default CartView;
>>>>>>> 49cc1583c4dfc8069932a0aca774422502d99b1e
