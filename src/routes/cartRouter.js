const express = require("express");
const router = express.Router();
const CartManager = require("../dao/CartManager");

const cartManager = new CartManager();

// Route to list products in a cart
router.get("/:cid", (req, res) => {
});

// Route to create a new cart
router.post("/", (req, res) => {
});

// Route to add a product to a cart
router.post("/:cid/product/:pid", (req, res) => {

});

module.exports = router;
