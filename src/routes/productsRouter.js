import express from "express";
import {
  getProducts,
  getProductsPaginate,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/",getProducts);
router.get("/paginate",getProductsPaginate);
router.get("/:pid",getProductById);
router.post("/", auth ,addProduct);
router.put("/:pid", auth ,updateProduct);
router.delete("/:pid", auth ,deleteProduct);

export default router;