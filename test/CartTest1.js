const CartManager = require('../src/dao/CartManager');

async function testCartManager() {
    const cartManager = new CartManager();

    // Test createCart method
    const newCart = cartManager.createCart();
    console.log("New Cart Created:", newCart);

    // Test addProductToCart method
    try {
        const cartId = newCart.id;
        const productId = "ABC123"; // Example product ID
        const quantity = 1;
        const updatedProducts = await cartManager.addProductToCart(cartId, productId, quantity);
        console.log("Product Added to Cart:", updatedProducts);
    } catch (error) {
        console.error("Error Adding Product to Cart:", error);
    }

    // Test getCartProducts method
    try {
        const cartId = newCart.id;
        const cartProducts = cartManager.getCartProducts(cartId);
        console.log("Cart Products:", cartProducts);
    } catch (error) {
        console.error("Error Getting Cart Products:", error);
    }

    // Test saveCartData method
    try {
        await cartManager.saveCartData();
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

testCartManager();
