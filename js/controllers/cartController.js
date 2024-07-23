import FirebaseService from '../services/firebaseService.js';
import CartView from '../views/cartView.js';
import User from '../models/user.js';
import Product from '../models/product.js';

class CartController {
    constructor() {
        this.view = new CartView();
        this.user = null;
        this.products = [];
        this.isUserFetched = false;
    }

    async init() {
        const userId = localStorage.getItem('userID');
        if (userId !== 'null') {
            await this.fetchUser(userId); // Chờ fetchUser hoàn thành
            await this.fetchProducts();   // Chờ fetchProducts hoàn thành
            this.isUserFetched = true;
            this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
            this.view.bindChangeQuantity(this.handleChangeQuantity.bind(this));
        } else {
            console.error('User ID is missing in localStorage');
        }
    }

    async fetchUser(userId) {
        const userRef = FirebaseService.getRef(`User/${userId}`);
        const snapshot = await FirebaseService.getData(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            this.user = new User(
                userId,
                userData.Address,
                userData.Birth,
                userData.Cart,
                userData.CreateDate,
                userData.Email,
                userData.FullName,
                userData.Phone,
                userData.Role,
                userData.UpdateDate
            );
            console.log("User fetched: ", this.user); // Kiểm tra xem user đã được gán đúng
        } else {
            console.error('User data not found in Firebase');
        }
    }

    async fetchProducts() {
        const productRef = FirebaseService.getRef('Product');
        const snapshot = await FirebaseService.getData(productRef);

        snapshot.forEach(childSnapshot => {
            const value = childSnapshot.val();
            const product = new Product(
                childSnapshot.key,
                value.Name,
                value.Price,
                value.Images ? Object.values(value.Images)[0].ImgURL : '',
                value.Category,
                value.CreateDate,
                value.Description,
                value.Detail,
                value.ProductID,
                value.Promotion,
                value.Size,
                value.UpdateDate
            );
            this.products.push(product);
        });
    }

    async addToCart(productId) {
        if (!this.isUserFetched) {  // Kiểm tra xem người dùng đã được tải xong chưa
            console.error('User not fetched yet');
            return;
        }

        console.log("this.user before adding to cart: ", this.user);
        this.user.addToCart(productId);
        console.log("this.user after adding to cart: ", this.user);

        await FirebaseService.updateData(FirebaseService.getRef(`User/${this.user.id}/Cart`), this.user.cart);

        console.log("this.user cart after update: ", this.user.cart);

        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);

        if (!document.body.classList.contains('showCart')) {
            this.view.toggleCart();
        }
    }

    async handleChangeQuantity(productId, type) {
        console.log("handleChangeQuantity this.user.cart: ", this.user.cart)
        if (!this.isUserFetched) {
            console.error('User not fetched yet');
            return;
        }
        if (type === 'plus') {
            this.user.addToCart(productId, 1);
        } else {
            if (this.user.cart[productId] == 1)
                await FirebaseService.removeData(FirebaseService.getRef(`User/${this.user.id}/Cart/${productId}`));
            this.user.updateCart(productId, this.user.cart[productId] - 1);
        }
        await FirebaseService.updateData(FirebaseService.getRef(`User/${this.user.id}/Cart`), this.user.cart);
        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
    }
}

export default CartController;
