const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../dao/ProductManager");
let filePath = path.join(__dirname, "..", "data", "products.json");
const manager = new ProductManager(filePath);

router.get("/", async (request, response) => {
    try {
        let data = await manager.getProducts();

        let limit = request.query.limit;
        if (Number(limit) && limit > 0) {
        data = data.slice(0, limit);
        }
        response.json(data);
    } catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
    });
    //Devuelve un producto segun su id.
    router.get("/:pid", async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
        return response.json({ error: "Enter a valid number as ID" });
    } else {
        try {
        const product = await manager.getProductById(pid);
        response.json(product); // Send the product back to the client
        } catch (error) {
        response
            .status(404)
            .json({ error: `Product with id ${pid} was not found.` });
        }
    }
    });
    //Agrega Producto
    router.post("/", async (request, response) => {
    try {
        const product = await manager.addProduct(
        request.body.title,
        request.body.description,
        request.body.code,
        request.body.price,
        request.body.discountPercentage,
        request.body.rating,
        request.body.status,
        request.body.stock,
        request.body.brand,
        request.body.category,
        request.body.thumbnails,
        request.body.images
        );
        response.status(201).json(product);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
    });
    //Update Product

    router.put("/:pid", async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
        return response.json({ error: "Enter a valid number as ID" });
    } else {
        try {
        const uproduct = await manager.updateProduct(pid, request.body);

        response.json(uproduct);
        } catch (error) {
        response.status(400).json({ error: error.message });
        }
    }
    });

    router.delete("/:pid", async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
        return response.json({ error: "Enter a valid number as ID" });
    } else {
        try {
        const dproduct = await manager.deleteProduct(pid);
        response.json(dproduct);
        } catch (error) {
        response.status(400).json({ error: error.message });
        }
    }
});

module.exports = router;
