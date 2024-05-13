import express from "express";
import { ProductManager } from "../dao/ProductManagerDB.js";
import { CartManager } from "../dao/CartManagerDB.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prodController = new ProductManager();
const cartController = new CartManager();

router.get("/", async (request, response) => {
  try {
    response.status(200).render("home", { styles: "main.css" });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/register", (request, response) => {
  try {
    response.status(200).render("register");
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/login", (request, response) => {
  let { error } = request.query;
  try {
    response.status(200).render("login", { error });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/profile", auth, (request, response) => {
  try {
    response.status(200).render("profile", { user: request.session.user });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

// Route to handle pagination and rendering
router.get("/products", auth, async (request, response) => {
  try {
    /* let data = await productModel.find().lean();
let limit = request.query.limit;
if (Number(limit) && limit > 0) {data = data.slice(0, limit);} */
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
    } = await prodController.getProductsPaginate(
      limit,
      page,
      category,
      status,
      sort
    );
    response.status(200).render("products", {
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
      user: request.session.user,
      isAdmin: request.session.isAdmin,
    });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

//Hardcode Get cart
router.get("/carts/:cid", auth, async (request, response) => {
  try {
    console.log("testing");
    let cart = await cartController.getCartById(request, response);
    console.log("cart", cart);
    response.setHeader("Content-Type", "text/html");
    return response.status(200).render("cart", { cart });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/realtimeproducts", auth, (request, response) => {
  return response
    .status(200)
    .render("realTimeProducts", { styles: "main.css" });
});

router.get("/chat", (request, response) => {
  return response.status(200).render("chat", { styles: "main.css" });
});

export default router;
