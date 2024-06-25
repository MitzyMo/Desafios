import express from "express";
import {
  getProducts,
  getProductsPaginate,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { authRole } from "../middleware/authRole.js";

const router = express.Router();

router.get("/",getProducts);
router.get("/paginate",getProductsPaginate);
router.get("/:pid",getProductById);
router.post("/",authRole('admin'),addProduct);
router.put("/:pid",authRole('admin'),updateProduct);
router.delete("/:pid",authRole('admin'),deleteProduct);

export default router;