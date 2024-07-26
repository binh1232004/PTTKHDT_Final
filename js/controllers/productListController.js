import FirebaseService from '../services/firebaseService.js';
import ProductListView from '../views/productListView.js';
import Product from '../models/product.js';
import CartController from './cartController.js';

class ProductListController {
    constructor() {
        this.view = new ProductListView();
        this.products = [];

        this.init();
    }

    async init() {
        await this.fetchProducts();
        this.view.renderProducts(this.products);
        this.view.bindAddToCart(this.handleAddToCart.bind(this));
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

    handleAddToCart(productId) {
        const cartController = new CartController();
        cartController.addToCart(productId);
    }
}

export default ProductListController;
