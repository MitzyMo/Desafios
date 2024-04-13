//const express = require("express");
//const productRouter = require("./routes/productsRouter");
//const cartsRouter = require("./routes/cartsRouter");
import express from "express";
import productRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.status(200).json({ Status: "Ok" });
    return response.json("Landing Page");
});
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, (error) => {
    if (error) {
        throw new Error("Failed to start the server:", error);
    }
    return console.log(`Server connected in port ${PORT}`);
});

    /* async function startServer() {
        try {
        await app.listen(PORT);
        console.log(`Server connected in port ${PORT}`);
        } catch (error) {
        console.error('Failed to start the server:', error);
        }
    }
    
  startServer(); */
