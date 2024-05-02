import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controller/products.js";

const router = express.Router();

//Retorna todos los productos
router.get("/", getProducts);

//Devuelve un producto segun su id.
router.get("/:pid", getProductById);

//Agrega Producto
router.post("/", addProduct);

//Update Product
router.put("/:pid",updateProduct);

//Delete Product
router.delete("/:pid", deleteProduct);

//module.exports = router;
export default router;
