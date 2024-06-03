import { Router } from "express";
import passport from "passport";
import { UserManager } from "../dao/UserManagerDB.js";
export const router = Router();

const userManager = new UserManager();

router.get("/error", (request, response) => {
  response.setHeader("Content-Type", "application/json");
  return response.status(500).json({
    error: `You've encountered an error, please validate your data.`,
  });
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
  async (request, response) => {
    let { web } = request.body;
    try {
      if (web) {
        return response.redirect(`/login?message=User registered successfully`);
      } else {
        response.setHeader("Content-Type", "application/json");
        return response.status(201).json({ payload: "Registration successful...!!!", user: request.user });
      }
    } catch (error) {
      response.status(500).json({
        error: `Unexpected error, contact your administrator`,
        detail: `${error.message}`,
      });
    }
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
  async (request, response) => {
    let { web } = request.body;
    let user = { ...request.user };
    delete user.password;
    request.session.user = user;
    if (web) {
      response.redirect("/products");
    } else {
      response.setHeader("Content-Type", "application/json");
      return response.status(200).json({ payload: "Successful login", user });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", {}),
  (request, response) => {}
);

router.get(
  "/callbackGithub",
  passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
  (request, response) => {
    request.session.user = request.user;
    response.setHeader("Content-Type", "application/json");
    return response.status(200).json({ payload: "Successful login", user: request.user });
  }
);

router.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      response.setHeader("Content-Type", "application/json");
      return response.status(500).json({
        error: `Unexpected error, contact your administrator`,
        detail: `${error.message}`,
      });
    }
    response.redirect("/?message=Logout successfully");
  });
});

router.get("/current", (request, response) => {
    if (!request.session.user) {
      return response.status(401).json({ error: "No authenticated user" });
    }
    // Respond with relevant user data (excluding password)
    const user = { ...request.session.user };
    delete user.password;
    response.status(200).json({ user });
  });

  

export default router;
