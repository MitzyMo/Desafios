import express from 'express';
import {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    deleteAllProductsFromCart,
    updateCart,
    updateProdQtyInCart,
    purchaseCart
} from '../controller/cartController.js';
import { authRole } from '../middleware/authRole.js';

const router = express.Router();
router.post("/", createCart);
router.get("/:cid", getCartById);
router.post('/:cid/product/:pid', authRole('user'), addProductToCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.delete("/:cid", deleteAllProductsFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/product/:pid", updateProdQtyInCart);
router.get("/:cid/purchase", authRole('user'), purchaseCart);

export default router;
