import FirebaseService from '../services/firebaseService.js';
import CartPaymentView from '../views/cartPaymentView.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

class CartPaymentController {
    constructor() {
        this.view = new CartPaymentView();
        this.user = null;
        this.userId = localStorage.getItem('userID');
        this.isUserFetched = false;
        this.products = [];
        this.selectedItems = [];

        this.view.bindQuantityChange(this.handleQuantityChange.bind(this));
        this.view.bindSelectAll(this.handleSelectAll.bind(this));
        this.view.bindDeleteSelected(this.handleDeleteSelected.bind(this));
        this.view.bindSelectItem(this.handleSelectItem.bind(this));
        this.view.bindPaymentValidation(this.handlePayment.bind(this));
    }

    async init() {
        if (this.userId !== 'null') {
            await this.fetchUser(this.userId);
            await this.fetchProducts();
            this.isUserFetched = true;
            this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
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

    async handleQuantityChange(productId, type) {
        const currentQuantity = this.user.cart[productId];
        const newQuantity = type === 'plus' ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity <= 0) {
            await FirebaseService.removeData(FirebaseService.getRef(`User/${this.userId}/Cart/${productId}`));
            delete this.user.cart[productId];
        } else {
            await FirebaseService.updateData(FirebaseService.getRef(`User/${this.userId}/Cart`), { [productId]: newQuantity });
            this.user.cart[productId] = newQuantity;
        }

        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
        this.view.setCheckedItems(this.selectedItems);
        this.updateTotalPrice();
    }

    handleSelectAll(isChecked) {
        const checkboxes = this.view.listCartHTML.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = isChecked);
        this.updateTotalPrice();
    }

    handleSelectItem() {
        this.updateTotalPrice();
    }

    async handleDeleteSelected() {
        const checkboxes = this.view.listCartHTML.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            this.view.showAlert('Chọn sản phẩm cần xóa', 'warning');
            return;
        }

        for (const checkbox of checkboxes) {
            const productId = checkbox.id.replace('inp-', '');
            await FirebaseService.removeData(FirebaseService.getRef(`User/${this.userId}/Cart/${productId}`));
            delete this.user.cart[productId];
        }

        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
        this.updateTotalPrice();
        this.view.showAlert('Xóa sản phẩm thành công', 'success');
    }

    async handlePayment() {
        if (!this.view.validateFormPayment()) return;

        const selectedItems = this.view.getSelectedItems();
        if (selectedItems.length === 0) {
            this.view.totalPriceElement.innerHTML = "CHỌN SẢN PHẨM THANH TOÁN";
            return;
        }

        const orderData = new Order(
            this.userId,
            document.getElementById('name_recipient').value,
            document.getElementById('phoneNumber_recipient').value,
            document.getElementById('email_recipient').value,
            `${document.getElementById('street').value}, ${document.getElementById('wards').value}, ${document.getElementById('districts').value}, ${document.getElementById('provinces').value}`,
            document.getElementById('note').value,
            document.querySelector('input[name="payments"]:checked').value,
            new Date().toISOString().split('T')[0],
            parseFloat(this.view.totalPriceElement.innerText.replace('TỔNG TIỀN: ', '').replace('đ', '').replace(',', '')),
            {}
        );

        selectedItems.forEach(productId => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                orderData.items[productId] = {
                    item_name: product.name,
                    quantity: this.user.cart[productId],
                    unit_price: product.price,
                    total_price: product.price * this.user.cart[productId]
                };
            }
        });

        try {
            await FirebaseService.pushData(FirebaseService.getRef('orders'), orderData);

            // Xóa các sản phẩm đã thanh toán ra khỏi giỏ hàng
            for (const productId of selectedItems) {
                await FirebaseService.removeData(FirebaseService.getRef(`User/${this.userId}/Cart/${productId}`));
                delete this.user.cart[productId];
            }

            // Gọi hàm cập nhật giỏ hàng và hiển thị thông báo
            this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
            this.updateTotalPrice();
            this.view.showAlert('Đặt hàng thành công', 'success');
        } catch (error) {
            this.view.showAlert('Đặt hàng thất bại', 'danger');
        }
    }

    updateTotalPrice() {
        const selectedItems = this.view.getSelectedItems();
        let totalPrice = 0;

        selectedItems.forEach(productId => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                totalPrice += product.price * this.user.cart[productId];
            }
        });

        this.selectedItems = selectedItems;

        if (totalPrice > 0) {
            this.view.updateTotalPrice(totalPrice);
        } else {
            this.view.showSelectItemsMessage();
        }
    }
}

export default CartPaymentController;

