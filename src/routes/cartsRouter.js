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
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth ,createCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", auth ,addProductToCart);
router.delete("/:cid/product/:pid", auth ,deleteProductFromCart);
router.delete("/:cid", auth ,deleteAllProductsFromCart);
router.put("/:cid", auth ,updateCart);
router.put("/:cid/product/:pid", auth ,updateProdQtyInCart);

export default router;
