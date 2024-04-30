import express from "express";
import cartManagerModule from '../dao/CartManagerFileSystem.js';
const { CartManager } = cartManagerModule;
const router = express.Router();
const manager = new CartManager();

// Route to list products in a cart
router.get("/:cid", async(request, response) => {
    const {cid} = request.params;
    try {
        const cart = await manager.getCartById(Number(cid));
        response.status(201).json({ cart });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

//add a cart
router.post("/", async (request, response) => {
    try {
        const cart = await manager.createCart();
        response.status(201).json({ cart });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

// Route to add a product to a cart
router.post("/:cid/product/:pid", async(request, response) => {
    const {cid, pid} = request.params;
    try {
        const cart = await manager.addProductToCart(Number(cid),Number(pid));
        response.status(201).json({ cart });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

//module.exports = router;
export default router;