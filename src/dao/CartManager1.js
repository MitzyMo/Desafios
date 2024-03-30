const { promises: filePromise } = require("fs");
const path = require("path");

class CartManager {
    constructor() {
        this.cartsDB = [];
        this.path = path.join(__dirname, "..", "data", "cart.json");
        this.loadCartData(); // Load cart data when CartManager is instantiated
    }

    async loadCartData() {
        try {
            const data = await filePromise.readFile(this.path, "utf-8");
            this.cartsDB = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // If file doesn't exist, initialize with an empty array
                this.cartsDB = [];
            } else {
                // If there's an error reading the file for some other reason, throw the error
                throw error;
            }
        }
    }
    

    async saveCartData() {
        try {
            await filePromise.writeFile(this.path, JSON.stringify(this.cartsDB, null, 2));
        } catch (error) {
            throw new Error("Error saving cart data");
        }
    }

    generateCartId() {
        return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
    }

    createCart() {
        const newCart = {
            id: this.generateCartId(),
            products: []
        };
        this.cartsDB.push(newCart);
        return newCart;
    }

    findCartById(cartId) {
        return this.cartsDB.find(cart => cart.id === cartId);
    }

    getCartProducts(cartId) {
        const cart = this.findCartById(cartId);
        if (cart) {
            return cart.products;
        } else {
            throw new Error("Cart not found");
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.findCartById(cartId);
        if (cart) {
            const existingProduct = cart.products.find(product => product.id === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity; // Increment quantity if product already exists
            } else {
                cart.products.push({ id: productId, quantity }); // Add new product to cart
            }
            await this.saveCartData(); // Save cart data after modifying
            return cart.products;
        } else {
            throw new Error("Cart not found");
        }
    }
}

module.exports = CartManager;
