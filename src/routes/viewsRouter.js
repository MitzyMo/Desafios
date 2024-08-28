import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken"
import { ProductManager } from "../dao/ProductManagerDB.js";
import { CartManager } from "../dao/CartManagerDB.js";
import { auth } from "../middleware/auth.js";
import { sendRegistrationEmail } from "../services/MailService.js";
import { authRole } from "../middleware/authRole.js";
import { config } from "../config/config.js";
import logger from "../middleware/logger.js";
import { UserManager } from "../dao/UserManagerDB.js";

const router = express.Router();
const prodManager = new ProductManager();
const cartManager = new CartManager();
const userManager = new UserManager();


// Home Route
router.get("/", async (request, response) => {
 try {
   request.logger.info('Accessed Home Route');
   request.logger.debug('TEST DEBUGAccessed Home Route');
   request.logger.error('Test Accessed Home Route');
   response.status(200).render("home", { styles: "main.css", login: request.session.user });
 } catch (error) {
   request.logger.error(`Error on Home Route: ${error.message}`);
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
   request.logger.error(`Error on Register Route (GET): ${error.message}`);
   response.status(500).render("error", {
     error: "Internal Server Error",
     styles: "main.css",
   });
 }
});
// Register Email
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
 async (request, response) => {
   let { web } = request.body;
   try {
     // Send registration email
     await sendRegistrationEmail(request.user.email);
     if (web) {
       return response.redirect(`/login?message=User registered successfully`);
     } else {
       response.setHeader("Content-Type", "application/json");
       return response.status(201).json({ payload: "Registration successful...!!!", user: request.user });
     }
   } catch (error) {
     request.logger.error(`Error on Register Route (POST): ${error.message}`);
     response.status(500).json({
       error: `Unexpected error, contact your administrator`,
       detail: `${error.message}`,
     });
   }
 }
);
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
   request.logger.error(`Error on Login Route (GET): ${error.message}`);
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
   request.logger.error(`Error on Profile Route: ${error.message}`);
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
   request.logger.error(`Error on Products Route: ${error.message}`);
   response.status(500).render("error", {
     error: "Internal Server Error",
     styles: "main.css",
   });
 }
});
// Cart Route
router.get("/carts/:cid", authRole(['user', 'premium']), async (request, response) => {
 try {
   const { cid } = request.params;
   const cart = await cartManager.getCartById(cid);
   logger.debug(`Testing cart ID in View Router: ${cid}`);
   logger.debug(`Testing cart in View Router:${JSON.stringify(cart.products,null,2)}`);
   return response.status(200).render("cart", { cart, login: request.session.user });
 } catch (error) {
   request.logger.error(`Error on Cart Route: ${error.message}`);
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
router.get("/chat", authRole(['user', 'premium']), (request, response) => {
 try {
   request.logger.info('Accessed Chat Route');
   return response.status(200).render("chat", { styles: "main.css", login: request.session.user });
 } catch (error) {
   request.logger.error(`Error on Chat Route: ${error.message}`);
   response.status(500).render("error", {
     error: "Internal Server Error",
     styles: "main.css",
   });
 }
});
//Forgot Password
router.get("/forgot-password", (request, response) => {
 try {
   request.logger.debug('Accessed forgot-password');
   return response.status(200).render("forgot-Password", { styles: "main.css" });
 } catch (error) {
   request.logger.error(`Error on accessing recovery password flow: ${error.message}`);
   response.status(500).render("error", {
     error: "Internal Server Error",
     styles: "main.css",
   });
 }
});
// Get new hashed password.
router.get("/newPassword/:token", (request, response) => {
  // Retrieve Token
  let token = request.params.token;
  console.log(token);
  let decodedToken;
  
  try {
      // Validate Token
      decodedToken = jwt.verify(token, config.SECRETJWT);
      request.logger.debug('Accessed forgot-password', decodedToken);
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          request.logger.info('Accessed forgot-password - Token expired', decodedToken);
      } else if (error.name === 'JsonWebTokenError') {
          request.logger.info('Accessed forgot-password - Invalid token', decodedToken);
      } else {
          request.logger.error('Accessed forgot-password - Error', error);
      }
  }
  // Redirect based on token's validation.
  if (decodedToken) {
      response.setHeader("Content-Type", "text/html");
      return response.status(200).render("newPassword", { token, ...decodedToken });
  } else {
      response.setHeader("Content-Type", "text/html");
      response.status(400).render("login", { message: "Either the token expired or is incorrect, you should request a new password reset email." });
  }
});
// Users
router.get("/users", authRole(['admin']), async (request, response) => {
  request.logger.debug(`accessing users`);
  try {
    const limit = request.query.limit || 10;
    const { totalUsers, data } = await userManager.getUsers(limit);
    request.logger.debug(`accessing users: ${totalUsers}`);
    
    const processedUsers = data.map(user => ({
      ...user.toObject(), // Spread the full user data
      roles: ['user', 'premium', 'admin'].map(role => ({
        value: role,
        selected: user.role === role
      }))
    }));
    response.render("users", { users: processedUsers, totalUsers, login: request.session.user });
  } catch (error) {
    response.status(500).render("error", { error: "Internal Server Error", styles: "main.css" });
  }
});

// Update User Role Route
router.post("/users/:uid/role", authRole('admin'), async (request, response) => {
  try {
    const uid = request.params.uid;
    const { role } = request.body;
    const updatedUser = await userManager.updateUser(uid, { role }); // Assuming UserService is available
    response.redirect("/users"); // Redirect back to the users page
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
// Delete User Route
router.post("/users/:uid/delete", authRole('admin'), async (request, response) => {
  try {
    const uid = request.params.uid;
    await userManager.deleteUser(uid); // Assuming UserService is available
    response.redirect("/users"); // Redirect back to the users page
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
export default router;