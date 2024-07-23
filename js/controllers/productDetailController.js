import FirebaseService from '../services/firebaseService.js';
import ProductDetailView from '../views/productDetailView.js';

class ProductDetailController {
    constructor() {
        this.view = new ProductDetailView();
        this.productId = this.getProductIdFromURL();
        this.fetchProductDetails();
    }

    getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async fetchProductDetails() {
        const productRef = FirebaseService.getRef(`Product/${this.productId}`);
        const snapshot = await FirebaseService.getData(productRef);

        if (snapshot.exists()) {
            const productData = snapshot.val();
            this.view.renderProductDetails(productData);
        } else {
            console.error('Product data not found in Firebase');
        }
    }
}

export default ProductDetailController;
