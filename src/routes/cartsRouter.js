import express from "express";
import { getCartById, createCart, addProductToCart,  } from "../controller/carts.js";
const router = express.Router();

// Route to list products in a cart
router.get("/:cid", getCartById);

//add a cart
router.post("/", createCart);

// Route to add a product to a cart
router.post("/:cid/product/:pid", addProductToCart);

//module.exports = router;
export default router;