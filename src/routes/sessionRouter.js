import { Router } from "express";
import { UserManager } from "../dao/UserManagerDB.js";
import { generateHash } from "../utils.js";
import { createCartInternal } from "../controller/cartController.js";
export const router = Router();

const userManager = new UserManager();

router.post("/register", async (request, response) => {
    let { name, email, role, password } = request.body;
    if (!name || !email || !password) {
        return response
            .status(400)
            .json({ error: `Complete name, email, & password` });
    }
    
    let exists = await userManager.getBy({ email });
    if (exists) {
        return response
            .status(400)
            .json({ error: `The ${email} is already registered` });
    }
    
    password = generateHash(password);
    try {
        let newCart = await createCartInternal();
        let newUser = await userManager.create({
            name,
            email,
            role,
            password,
            cart: newCart._id,
        });
        response.status(200).json({ message: "User registered successfully", newUser });
    } catch (error) {
        response.status(500).json({
            error: `Unexpected error, contact your administrator`,
            detail: `${error.message}`,
        });
    }
});

router.post("/login", async (request, response) => {
    let { email, password, web, role } = request.body;
    console.log("login", request.body);
    if (!email || !password) {
        if (web) {
        return response.redirect(`/login?error=Complete email, & password`);
        } else {
        response.setHeader("Content-Type", "application/json");
        return response.status(400).json({ error: `Complete email, & password` });
        }
    }
    let user = await userManager.getBy({
        email,
        password: generateHash(password),
    });
    if (!user) {
        if (web) {
        return response.redirect(`/login?error=Invalid Credentials`);
        } else {
        response.setHeader("Content-Type", "application/json");
        return response.status(400).json({ error: `Invalid Credentials` });
        }
    }
  // Check if the logged in user is the admin
    if (user.email === "adminCoder@coder.com" && password === "adminCod3r123") {
        request.session.isAdmin = true;
        console.log(role);
    }
    user = { ...user };
    delete user.password;
    request.session.user = user;

    if (web) {
        response.redirect("/products");
    } else {
        response.setHeader("Content-Type", "application/json");
        return response.status(200).json({ payload: "Login correcto", user });
    }
});

router.get("/logout", (request, response) => {
    request.session.destroy((error) => {
        if (error) {
        console.log(error);
        response.setHeader("Content-Type", "application/json");
        return response
            .status(500)
            .json({
            error: `Unexpected error, contact your administrator`,
            detalle: `${error.message}`,
            });
        }
        response.redirect("/");
    });
});

export default router;
