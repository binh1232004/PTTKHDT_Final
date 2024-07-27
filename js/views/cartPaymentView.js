class CartPaymentView {
    constructor() {
        this.listCartHTML = document.getElementById('showProduct');
        this.selectAllCheckbox = document.getElementById('allProduct');
        this.deleteSelectedButton = document.getElementById('deleteProduct');
        this.totalPriceElement = document.getElementById('totalPrice');
        this.paymentButton = document.getElementById('btnMakePayment');
        this.alertPlaceholder = document.getElementById('alertPlaceholder');
        this.paymentFormFields = [
            { id: 'name_recipient', message: 'Chưa nhập Họ và tên' },
            { id: 'phoneNumber_recipient', message: 'Chưa nhập Số điện thoại' },
            { id: 'email_recipient', message: 'Chưa nhập Email' },
            { id: 'street', message: 'Chưa nhập Địa chỉ' },
            { id: 'provinces', message: 'Chưa chọn Tỉnh' },
            { id: 'districts', message: 'Chưa chọn Quận/Huyện' },
            { id: 'wards', message: 'Chưa chọn Phường/Xã' }
        ];
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

            const divProduct = document.createElement("div");
            divProduct.classList.add("card", "mb-3", "px-0");
            divProduct.id = `${cart.productID}`;
            divProduct.innerHTML = `
                <div class="card px-0">
                    <div class="row g-0">
                        <div class="col-xl-4 col-lg-5 col-sm-4 d-flex align-items-center">
                            <div class="d-flex align-items-center p-3">
                                <input class="form-check-input m-0 me-2" type="checkbox" name="shopping_cart_items" id="inp-${cart.productID}">
                                <img src="${product.imgURL}" class="img-fluid img-thumbnail" alt="Hình ảnh thẻ">
                            </div>
                        </div>
                        <div class="col-xl-8 col-lg-7 col-sm-8">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <div class="row">
                                    <div class="col">
                                        <label class="form-label">Số Lượng</label>
                                        <div class="input-group small-input-group">
                                            <button id="minus-${cart.productID}" class="btn btn-outline-secondary button-minus" type="button" style="background-color: whitesmoke; border-right: 0;">
                                                <i class="fa-solid fa-minus"></i>
                                            </button>
                                            <input id="amount-${cart.productID}" type="text" class="form-control input-number" value="${cart.quantity}" readonly style="background-color: whitesmoke;">
                                            <button id="plus-${cart.productID}" class="btn btn-outline-secondary button-plus" type="button" style="background-color: whitesmoke; border-left: 0;">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div>
                                        <label class="form-label">Giá: <b id="price-${cart.productID}">${this.formatPrice(product.price * cart.quantity)}</b></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            this.listCartHTML.appendChild(divProduct);
        });

        if (cartItems.length === 0) {
            this.listCartHTML.innerHTML = "Giỏ hàng hiện đang trống";
            document.getElementById('areaButtonPayment').style.display = 'none';
        } else {
            document.getElementById('areaButtonPayment').style.display = 'block';
        }
    }

    bindQuantityChange(handler) {
        this.listCartHTML.addEventListener('click', (event) => {
            if (event.target.closest('.button-plus') || event.target.closest('.button-minus')) {
                const target = event.target.closest('.button-plus') || event.target.closest('.button-minus');
                const productId = target.id.split('-')[1];
                const type = target.classList.contains('button-plus') ? 'plus' : 'minus';
                handler(productId, type);
            }
        });
    }

    bindSelectAll(handler) {
        this.selectAllCheckbox.addEventListener('change', (event) => {
            handler(event.target.checked);
        });
    }

    bindDeleteSelected(handler) {
        this.deleteSelectedButton.addEventListener('click', () => {
            handler();
        });
    }

    bindSelectItem(handler) {
        this.listCartHTML.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                handler();
            }
        });
    }

    bindPaymentValidation(handler) {
        this.paymentButton.addEventListener('click', handler);
    }

    getSelectedItems() {
        const selectedItems = [];
        const checkboxes = this.listCartHTML.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const productId = checkbox.id.replace('inp-', '');
            selectedItems.push(productId);
        });
        return selectedItems;
    }

    updateTotalPrice(totalPrice) {
        this.totalPriceElement.innerHTML = `TỔNG TIỀN: ${this.formatPrice(totalPrice)}`;
    }

    showSelectItemsMessage() {
        this.totalPriceElement.innerHTML = "CHỌN SẢN PHẨM THANH TOÁN";
    }

    setCheckedItems(checkedItems) {
        checkedItems.forEach(productId => {
            const checkbox = this.listCartHTML.querySelector(`#inp-${productId}`);
            if (checkbox) checkbox.checked = true;
        });
    }

    formatPrice(number) {
        let formattedNumber = number.toLocaleString('vi-VN');
        return formattedNumber + "đ";
    }

    showAlert(message, type) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        this.alertPlaceholder.append(wrapper);
    }

    validateFormPayment() {
        let isValid = true;
        let firstInvalidElement = null;

        this.paymentFormFields.forEach(({ id, message }) => {
            const element = document.getElementById(id);
            if (element.tagName === 'SELECT') {
                const isDefaultValue = element.value.startsWith('-- Chọn');
                if (isDefaultValue) {
                    element.classList.add('error');
                    this.addErrorMessage(element, message);
                    isValid = false;
                    if (!firstInvalidElement) firstInvalidElement = element;
                } else {
                    element.classList.remove('error');
                    this.removeErrorMessage(element);
                }
            } else {
                if (element.value.trim() === '') {
                    element.classList.add('error');
                    this.addErrorMessage(element, message);
                    isValid = false;
                    if (!firstInvalidElement) firstInvalidElement = element;
                } else {
                    element.classList.remove('error');
                    this.removeErrorMessage(element);
                }
            }
        });

        const paymentMethodHeader = document.getElementById('paymentMethod');
        let paymentSelected = document.querySelector('input[name="payments"]:checked');
        let paymentErrorMessage = document.querySelector('#paymentMethod + .error-message');

        if (paymentSelected) {
            if (paymentErrorMessage) {
                paymentErrorMessage.remove();
            }
        } else {
            if (!paymentErrorMessage) {
                paymentErrorMessage = document.createElement('div');
                paymentErrorMessage.className = 'error-message';
                paymentErrorMessage.textContent = 'Chưa chọn hình thức thanh toán';
                paymentErrorMessage.style.color = "red";
                paymentErrorMessage.style.fontSize = "15px";
                paymentMethodHeader.parentNode.appendChild(paymentErrorMessage);
            }
            if (!firstInvalidElement) firstInvalidElement = paymentMethodHeader;
        }

        if (!isValid || !paymentSelected) {
            if (firstInvalidElement) {
                this.scrollToElement(firstInvalidElement);
            }
        }

        return isValid && paymentSelected;
    }

    addErrorMessage(element, message) {
        let errorMessage = document.querySelector(`#${element.id} + .error-message`);
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = message;
            element.parentNode.appendChild(errorMessage);
        }
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "15px";
    }

    removeErrorMessage(element) {
        const errorMessage = document.querySelector(`#${element.id} + .error-message`);
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

export default CartPaymentView;