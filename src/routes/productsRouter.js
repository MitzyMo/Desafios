
import express from "express";
import { ProductManager } from "../controller/products.js"; 

const router = express.Router();
const manager = new ProductManager(); 

//Retorna todos los productos
router.get("/", async (request, response) => {
  await manager.getProducts(request, response); 
});
//Devuelve un producto segun su id.
router.get("/:pid", async (request, response) => {
  await manager.getProductById(request, response);
});
//Agrega Producto
router.post("/", async (request, response) => {
  await manager.addProduct(request, response); 
});
//Update Product
router.put("/:pid", async (request, response) => {
  await manager.updateProduct(request, response); 
});
//Delete Product
router.delete("/:pid", async (request, response) => {
  await manager.deleteProduct(request, response); 
});

export default router;
