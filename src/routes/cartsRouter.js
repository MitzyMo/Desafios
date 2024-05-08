import express from "express";
import { CartManager } from "../controller/cartController.js";
const router = express.Router();
//import { ProductManager } from "../controller/productController.js";
const cartManager = new CartManager();
//const prodManager = new ProductManager();
//add a cart
//router.post("/", createCart);
router.get("/", async (request, response) => {
  await cartManager.createCart(request, response);
});
// Route to list products in a cart
router.get("/:cid", async (request, response) => {
  await cartManager.getCartById(request, response);
});
//router.get("/:cid", getCartById);
// Route to add a product to a cart
//router.post("/:cid/product/:pid", addProductToCart);
router.post("/:cid/product/:pid", async (request, response) => {
  await cartManager.addProductToCart(request, response);
});
// Route to Delete a Product from the Cart
router.delete("/:cid/product/:pid", async (request, response) => {
  await cartManager.deleteProductFromCart(request, response);
});
// Route to list products in a cart
router.delete("/:cid", async (request, response) => {
  await cartManager.deleteAllProductsFromCart(request, response);
});
// Route to list products in a cart
router.put("/:cid", async (request, response) => {
  await cartManager.updateCart(request, response);
});
// Route to Delete a Product from the Cart
router.put("/:cid/product/:pid", async (request, response) => {
  await cartManager.updateProdQtyInCart(request, response);
});

router.post("/:cid/product/:pid", async (request, response) => {
  let { cid, pid } = request.params;
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    response.setHeader("Content-Type", "application/json");
    return response.status(400).json({ error: `Cart does not exist` });
  }
  let cart = await cartManager.getCartById({ _id: cid });
  if (!cart) {
    response.setHeader("Content-Type", "application/json");
    return response.status(400).json({ error: `Carrito inexistente: id ${cid}` });
  }
//aqui
  let product = await getProductById.getOneBy({ _id: pid });
  if (!product) {
    response.setHeader("Content-Type", "application/json");
    return response.status(400).json({ error: `No existe product con id ${pid}` });
  }

  console.log(cart);
  let indiceProducto = cart.products.findIndex((p) => p.product == pid);
  if (indiceProducto === -1) {
    cart.products.push({
      product: pid,
      cantidad: 1,
    });
  } else {
    cart.products[indiceProducto].cantidad++;
  }

  let resultado = await cartManager.update(cid, cart);
  if (resultado.modifiedCount > 0) {
    response.setHeader("Content-Type", "application/json");
    return response.status(200).json({ payload: "Carrito actualizado" });
  } else {
    response.setHeader("Content-Type", "application/json");
    return response.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `No se pudo realizar la actualizacion`,
    });
  }
});
export default router;
