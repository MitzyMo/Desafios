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
import { checkOwner } from '../middleware/checkOwner.js';

const router = express.Router();

router.get("/",getProducts);
router.post("/",authRole(['admin', 'premium']),createProduct);
router.get("/paginate",getProductsPaginate);
router.get("/:pid",getProductById);
router.post("/",authRole(['admin', 'premium']),checkOwner, addProduct);
router.put("/:pid",authRole(['admin', 'premium']),updateProduct);
router.delete("/:pid",authRole(['admin', 'premium']),checkOwner,deleteProduct);

export default router;