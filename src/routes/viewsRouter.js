import express from "express";
import { ProductManager } from "../dao/ProductManagerDB.js";
import { CartManager } from "../dao/CartManagerDB.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prodManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (request, response) => {

  try {
    response.status(200).render("home", { styles: "main.css", login:request.session.user});
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css"
    });
  }
});

router.get("/register", (request, response, next)=>{
  if(request.session.user){
    response.redirect("/profile");
  }
  next()
}, (request, response) => {
  let { error } = request.query;
  try {
    response.status(200).render("register",{error, login:request.session.user});
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/login", (request, response, next)=>{
  if(request.session.user){
    response.redirect("/profile");
  }
  next()
},(request, response) => {
  let { error, message } = request.query;
  try {
    response.status(200).render("login", { error, message, login:request.session.user });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/profile", auth, (request, response) => {
  try {
    response.status(200).render("profile", { user: request.session.user, login:request.session.user });
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
      isAdmin: request.session.isAdmin,
      login:request.session.user
    });
  } catch (error) {
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});
//Cart View after being authenticated.
router.get("/carts/:cid",auth, async (request, response) => {
  try {
    // Extract cid from request params
    const { cid } = request.params;

    // Get the cart by id using the cartManager
    const cart = await cartManager.getCartById(cid);

    // Render the cart view and pass the cart data
    return response.status(200).render("cart", { cart, login:request.session.user });
  } catch (error) {
    console.error(error); // Log the error for debugging
    response.status(500).render("error", {
      error: "Internal Server Error",
      styles: "main.css",
    });
  }
});

router.get("/realtimeproducts", auth, (request, response) => {
  return response
    .status(200)
    .render("realTimeProducts", { styles: "main.css", login:request.session.user });
});

router.get("/chat", auth, (request, response) => {
  return response.status(200).render("chat", { styles: "main.css", login:request.session.user });
});

export default router;
