import express from "express";
import { CartManager } from "../controller/cartController.js";
const router = express.Router();
const manager = new CartManager(); 
//add a cart
//router.post("/", createCart);
router.get("/", async (request, response) => {
    await manager.createCart(request, response);  
});
// Route to list products in a cart
router.get("/:cid", async (request, response) => {
    await manager.getCartById(request, response); 
});
//router.get("/:cid", getCartById);
// Route to add a product to a cart
//router.post("/:cid/product/:pid", addProductToCart);
router.post("/:cid/product/:pid", async (request, response) => {
    await manager.addProductToCart(request, response);
});
// Route to Delete a Product from the Cart
router.delete("/:cid/product/:pid", async (request, response) => {
    await manager.deleteProductFromCart(request, response);
});
// Route to list products in a cart
router.delete("/:cid", async (request, response) => {
    await manager.deleteAllProductsFromCart(request, response); 
});
// Route to list products in a cart
router.post("/:cid", async (request, response) => {
    await manager.updateCart(request, response); 
});
// Route to Delete a Product from the Cart
router.post("/:cid/product/:pid", async (request, response) => {
    await manager.updateProdQtyInCart(request, response);
});
export default router;