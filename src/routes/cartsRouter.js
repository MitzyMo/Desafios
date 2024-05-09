import express from "express";
import { CartManager } from "../controller/cartController.js";
import { ProductManager } from "../dao/ProductManagerDB.js";
import mongoose, { isValidObjectId } from 'mongoose';
const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

//router.post("/", createCart);
router.post("/", async (request, response) => {
  await cartManager.createCart(request, response);
});
// Route to list products in a cart
//router.get("/:cid", getCartById);
router.get("/:cid", async (request, response) => {
  await cartManager.getCartById(request, response);
});
// Route to Delete a Product from the Cart
router.delete("/:cid/product/:pid", async (request, response) => {
  await cartManager.deleteProductFromCart(request, response);
});
// Route to list products in a cart
router.delete("/:cid", async (request, response) => {
  await cartManager.deleteAllProductsFromCart(request, response);
});
// Route to list products in a cart
router.put("/:cid", async (request, response) => {
  const { cid } = request.params;
  if (!isValidObjectId(cid)) {
    return response.status(400).json({ error: "Invalid cart ID" });
  }
  const cart = request.body;
  await cartManager.updateCart(cid, cart, response);
});
// Route to Delete a Product from the Cart
router.put("/:cid/product/:pid", async (request, response) => {
  await cartManager.updateProdQtyInCart(request, response);
});
// Route to add a product to a cart
//router.post("/:cid/product/:pid", addProductToCart);
router.post("/:cid/product/:pid", async (request, response) => {
  await cartManager.addProductToCart(request, response);
});

router.post("/:cid/product/:pid", async (request, response) => {
  const { cid, pid } = request.params;
  try {
    // Assuming addToCart function exists in cartManager
    const cart = await cartManager.addProductToCart(cid, pid);
    response.status(200).json({ cart });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


export default router;
