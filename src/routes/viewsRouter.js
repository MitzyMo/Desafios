import express from "express";
const router = express.Router();
import path from 'path'; // Import path module
import __dirname from "../utils.js"; // Import __dirname from utils.js
import ProductManagerModule from '../dao/ProductManager.js';
const { ProductManager } = ProductManagerModule;
let filePath = path.join(__dirname,'..','src', "data", "products.json");
const manager = new ProductManager(filePath);

router.get("/", async (request, response) => {
    //console.log(filePath);
    let {detail}= request.query
    try {
        let data = await manager.getProducts();
        let limit = request.query.limit;
        if (Number(limit) && limit > 0) {
        data = data.slice(0, limit);
        }
        response.status(200).render('home',{data,detail,limit});
    } catch (error) {
        response.status(500).render('error',{ error: "Internal Server Error" });
    }
    });


router.get("/realtimeproducts", (request, response) => {
    response.setHeader("Content-Type", "text/html");
    response.status(200).render('realTimeProducts',{});

});


export default router;