import express from "express";
import { ProductManager } from "../dao/ProductManagerDB.js";
import { CartManager } from "../dao/CartManagerDB.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prodManager = new ProductManager();
const cartManager = new CartManager();

// Home Route
router.get("/", async (request, response) => {
  try {
    response.status(200).render("home", { styles: "main.css", login: request.session.user });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css"
    });
  }
});

// Register Route
router.get("/register", (request, response, next) => {
  if (request.session.user) {
    response.redirect("/profile");
  } else {
    next();
  }
}, (request, response) => {
  let { error } = request.query;
  try {
    response.status(200).render("register", { error, login: request.session.user });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

// Login Route
router.get("/login", (request, response, next) => {
  if (request.session.user) {
    response.redirect("/profile");
  } else {
    next();
  }
}, (request, response) => {
  let { error, message } = request.query;
  try {
    response.status(200).render("login", { error, message, login: request.session.user });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

// Profile Route
router.get("/profile", auth, (request, response) => {
  try {
    const user = { ...request.session.user, cart: request.session.user.cart._id }; // Extract the cart ID
    response.status(200).render("profile", { user, login: request.session.user });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

// Products Route
router.get("/products", auth, async (request, response) => {
  try {
    let cart = { _id: request.session.user.cart._id };
    let { limit, page, category, status, sort } = request.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!category) category = "null";
    if (!sort) sort = "asc";
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
      cart,
      login: request.session.user
    });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

// Cart Route
router.get("/carts/:cid", auth, async (request, response) => {
  try {
    const { cid } = request.params;
    const cart = await cartManager.getCartById(cid);
    return response.status(200).render("cart", { cart, login: request.session.user });
  } catch (error) {
    console.error(error);
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

// Real-time Products Route
router.get("/realtimeproducts", auth, (request, response) => {
  return response
    .status(200)
    .render("realTimeProducts", { styles: "main.css", login: request.session.user });
});

// Chat Route
router.get("/chat", auth, (request, response) => {
  return response.status(200).render("chat", { styles: "main.css", login: request.session.user });
});

export default router;