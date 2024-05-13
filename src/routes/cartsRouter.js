import express from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  updateCart,
  updateProdQtyInCart
} from "../controller/cartController.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.delete("/:cid", deleteAllProductsFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/product/:pid", updateProdQtyInCart);

export default router;
