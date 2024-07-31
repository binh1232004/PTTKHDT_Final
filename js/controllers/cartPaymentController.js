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
        this.products = {};
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
            this.products[childSnapshot.key] = product;
        });
    }

    async handleQuantityChange(productId, type) {
        const currentQuantity = this.user.cart[productId];
        let [proID, sizeCart] = productId.split('-')
        if (currentQuantity == this.products[`${proID}`][`size`][`${sizeCart}`] && type == 'plus'){
            this.view.showAlert("Số lượng bạn yêu cầu hiện không có sẵn", "info")
            return;
        }
        console.log(productId)
        // if (currentQuantity == this.products[])
        const newQuantity = type === 'plus' ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity <= 0) {
            await FirebaseService.removeData(FirebaseService.getRef(`User/${this.userId}/Cart/${productId}`));
            delete this.user.cart[productId];
        } else {
            await FirebaseService.updateData(FirebaseService.getRef(`User/${this.userId}/Cart`), { [productId]: newQuantity });
            this.user.cart[productId] = newQuantity;
        }

        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
        console.log("this.selectedItems: ", this.selectedItems)
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

            const productId = checkbox.id.replace('inp_', '');

            await FirebaseService.removeData(FirebaseService.getRef(`User/${this.userId}/Cart/${productId}`));
            delete this.user.cart[productId];
        }

        this.view.renderCart(Object.entries(this.user.cart).map(([productID, quantity]) => ({ productID, quantity })), this.products);
        this.updateTotalPrice();
        this.view.showAlert('Xóa sản phẩm thành công', 'success');
    }

    extractNumber(inputString) {
        // Sử dụng biểu thức chính quy để tìm tất cả các ký tự số
        const numberString = inputString.match(/\d+/g).join('');
        return numberString;
    }
    getVietnamDate() {
        let now = new Date();
        let vietnamTimeOffset = 7 * 60 * 60 * 1000; // Giờ Việt Nam là GMT+7
        let vietnamDate = new Date(now.getTime() + vietnamTimeOffset);
        return vietnamDate.toISOString().split('T')[0];
    }

    async handlePayment() {
        if (!this.view.validateFormPayment()) return;

        const selectedItems = this.view.getSelectedItems();
        if (selectedItems.length === 0) {
            this.view.totalPriceElement.innerHTML = "CHỌN SẢN PHẨM THANH TOÁN";
            return;
        }
        let TotalOrder = this.extractNumber(this.view.totalPriceElement.innerText)

        const selectedProvinces = document.querySelector('#provinces').selectedOptions[0].innerText;
        const selectedDistricts = document.querySelector('#districts').selectedOptions[0].innerText;
        const selectedWards = document.querySelector('#wards').selectedOptions[0].innerText;

        const orderData = new Order(
            this.userId,
            document.getElementById('name_recipient').value,
            document.getElementById('phoneNumber_recipient').value,
            document.getElementById('email_recipient').value,
            `${document.getElementById('street').value}, ${selectedWards}, ${selectedDistricts}, ${selectedProvinces}`,
            document.getElementById('note').value,
            document.querySelector('input[name="payments"]:checked').value,
            this.getVietnamDate(),
            TotalOrder,
            {}
        );

        selectedItems.forEach(prdIDSize => {
            let [idPrd, sizePrd] = prdIDSize.split('-')

            const product = this.products[idPrd]
            if (product) {
                orderData.items[prdIDSize] = {
                    item_name: product.name,
                    quantity: this.user.cart[prdIDSize],
                    unit_price: product.price,
                    size: sizePrd,
                    total_price: product.price * this.user.cart[prdIDSize]
                };
            }
        });

        console.log(orderData)

        try {
            // Tạo hóa đơn
            await FirebaseService.pushData(FirebaseService.getRef('orders'), orderData);

            // Cập nhật số lượng theo size của sản phẩm
            for (const prdIDSize of selectedItems) {
                let [idPrd, sizePrd] = prdIDSize.split('-');
                let newQuantity = this.products[idPrd].size[sizePrd] - this.user.cart[prdIDSize];
                await FirebaseService.updateData(FirebaseService.getRef(`Product/${idPrd}/Size`), { [sizePrd]: newQuantity });
            }

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

        selectedItems.forEach(prdIDSize => {
            let [prdID, size] = prdIDSize.split('-')

            const product = this.products[prdID]
            if (product) {
                totalPrice += product.price * this.user.cart[prdIDSize];
            }
        });

        this.selectedItems = selectedItems;
        console.log("totalPrice: ", totalPrice)
        if (totalPrice > 0) {
            this.view.updateTotalPrice(totalPrice);
        } else {
            this.view.showSelectItemsMessage();
        }
    }
}

export default CartPaymentController;

