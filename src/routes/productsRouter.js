import express from "express";
import {
  getProducts,
  getProductsPaginate,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/paginate", getProductsPaginate);
router.get("/:pid", getProductById);
router.post("/", addProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);

export default router;