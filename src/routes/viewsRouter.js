import express from "express";
const router = express.Router();
import path from 'path'; // Import path module
import __dirname from "../utils.js"; // Import __dirname from utils.js
import ProductManagerModule from '../dao/ProductManagerFileSystem.js';
import { productModel } from "../dao/models/productModel.js";
const { ProductManager } = ProductManagerModule;
let filePath = path.join(__dirname,'..','src', "data", "products.json");
const manager = new ProductManager(filePath);

router.get("/", async (request, response) => {
    try {
        let data = await productModel.find();
        let limit = request.query.limit;
        if (Number(limit) && limit > 0) {
        data = data.slice(0, limit);
        }
        console.log(data);
        response.status(200).render('home',{data,limit,styles:'main.css'});
    } catch (error) {
        response.status(500).render('error',{ error: "Internal Server Error",styles:'main.css' });
    }
    });


router.get("/realtimeproducts", (request, response) => {
    return response.status(200).render('realTimeProducts',{styles:'main.css'});
    });

    router.get("/chat", (request, response) => {
        return  response.status(200).render("chat",{styles:'main.css'});

    });

export default router;