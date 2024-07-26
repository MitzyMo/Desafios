import express from "express";
import {
  getProducts,
  getProductsPaginate,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  createProduct
} from "../controller/productController.js";
import { authRole } from "../middleware/authRole.js";

const router = express.Router();

router.get("/",getProducts);
router.post("/",createProduct);
router.get("/paginate",getProductsPaginate);
router.get("/:pid",getProductById);
router.post("/",authRole('admin', 'premium'),addProduct);
router.put("/:pid",authRole('admin'),updateProduct);
router.delete("/:pid",authRole('admin', 'premium'),deleteProduct);

export default router;