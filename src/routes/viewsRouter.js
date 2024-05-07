import express from "express";
import { ProductManager } from "../controller/productController.js";
const router = express.Router();
const manager = new ProductManager();
import { productModel } from "../dao/models/productModel.js";


//Retorna todos los productos
router.get("/products", async (request, response) => {
  try {
    // Desestructure query params
    let { limit, page, category, status, sort } = request.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!category) category = "null";
    if (!sort) sort = "asc";
    // Get products with pagination, category filter, and sorting
    let { docs: data, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await manager.getProductsPaginate(limit, page, category, status, sort);
    // Render the Handlebars template with the data
    response.status(200).render("home", {
      data, limit, category, status, sort, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage,
      styles: "main.css",
    });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});


//Retorna todos los productos
router.get("/", async (request, response) => {
  try {
    let data = await productModel.find().lean();
    let limit = request.query.limit;
    if (Number(limit) && limit > 0) {
      data = data.slice(0, limit);
    }
    response.status(200).render("home", { data, limit, styles: "main.css" });
  } catch (error) {
    response
      .status(500)
      .render("error", { error: "Internal Server Error", styles: "main.css" });
  }
});

//Products con Socket.io
router.get("/realtimeproducts", (request, response) => {
  return response
    .status(200)
    .render("realTimeProducts", { styles: "main.css" });
});
//Chat con Socket.io
router.get("/chat", (request, response) => {
  return response.status(200).render("chat", { styles: "main.css" });
});

export default router;