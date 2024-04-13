//const CartManager = require('../src/dao/CartManager');
import cartManagerModule from '../src/dao/CartManager.js';
const { CartManager } = cartManagerModule;

async function testCartManager() {
    const cartManager = new CartManager();

    // Test createCart method
    try {
        const newCart = await cartManager.createCart();
        console.log("New Cart Created:", newCart);
    } catch (error) {
        console.error("Error Creating Cart:", error);
    }

    // Test addProductToCart method
    try {
        const newCart = await cartManager.createCart(); // Create a new cart
        const cartId = newCart.id;
        const productId = "ABC123"; // Example product ID
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        console.log("Product Added to Cart:", updatedCart);
    } catch (error) {
        console.error("Error Adding Product to Cart:", error);
    }

    // Test getCartById method
    try {
        const newCart = await cartManager.createCart(); // Create a new cart
        const cartId = newCart.id;
        const cart = await cartManager.getCartById(cartId);
        console.log("Cart:", cart);
    } catch (error) {
        console.error("Error Getting Cart:", error);
    }

    // Test saveCartData method
    try {
        await cartManager.writeToFile(); // Save cart data
        console.log("Cart Data Saved Successfully");
    } catch (error) {
        console.error("Error Saving Cart Data:", error);
    }

    // Test loadCartData method
    try {
        await cartManager.loadCartData();
        console.log("Cart Data Loaded Successfully");
    } catch (error) {
        console.error("Error Loading Cart Data:", error);
    }
}
console.log(process.cwd());
testCartManager();
