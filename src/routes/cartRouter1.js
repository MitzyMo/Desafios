const express = require("express");
const router = express.Router();
const CartManager = require("../dao/CartManager");

const cartManager = new CartManager();

// Route to create a new cart
router.post("/", (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

// Route to list products in a cart
router.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    try {
        const products = cartManager.getCartProducts(cartId);
        res.json(products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Route to add a product to a cart
router.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; // Default quantity is 1

    try {
        const products = cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json(products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
