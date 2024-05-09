import express from "express";
import { ProductManager } from "../dao/ProductManagerDB.js";
import { productModel } from "../dao/models/productModel.js";
import { CartManager } from "../controller/cartController.js";

const router = express.Router();
const prodManager = new ProductManager();
const cartManager = new CartManager();

// Route to handle pagination and rendering
router.get("/products", async (request, response) => {
  try {
    // Desestructure query params
    let { limit, page, category, status, sort } = request.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!category) category = "null";
    if (!sort) sort = "asc";
    // Get products with pagination, category filter, and sorting
    let {
      docs: data,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await prodManager.getProductsPaginate(
      limit,
      page,
      category,
      status,
      sort
    );
    response.status(200).render("home", {
      data,
      limit,
      category,
      status,
      sort,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      styles: "main.css",
    });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/", async (request, response) => {
  try {
    // Fetch product data
    let data = await productModel.find().lean();
    let limit = request.query.limit;
    if (Number(limit) && limit > 0) {
      data = data.slice(0, limit);
    }

    // Render the "home" template and pass cart and product data to it
    response.status(200).render("home", { data, limit, styles: "main.css" });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

//Hardcode Get cart
router.get("/carts/:cid", async(request, response)=>{
  try {
    console.log('testing');
  let cart =   await cartManager.getCartById(request, response);
  console.log('cart',cart);
    response.setHeader('Content-Type','text/html');
    return response.status(200).render("cart", {cart});
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
  })

router.get("/realtimeproducts", (request, response) => {
  return response
    .status(200)
    .render("realTimeProducts", { styles: "main.css" });
});

router.get("/chat", (request, response) => {
  return response.status(200).render("chat", { styles: "main.css" });
});

export default router;
