import { productModel } from "../dao/models/productModel.js";
import serverSocket from "../app.js"; // Import the serverSocket instance

//get all Products
export const getProducts = async (request, response) => {
    try {
        let data = await productModel.find();
        let limit = request.query.limit;
        if (Number(limit) && limit > 0) {
        data = data.slice(0, limit);
        }
        response.json({ data });
    } catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
};
// Get Products by ID
export const getProductById = async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
        return response.json({ error: "Enter a valid number as ID" });
    } else {
        try {
        const product = await productModel.findById(pid);
        response.json({ product }); // Send the product back to the client
        } catch (error) {
        response
            .status(404)
            .json({ error: `Product with id ${pid} was not found.` });
        }
    }
};
//Add Products
export const addProduct = async (request, response) => {
    try {
        // Validate mandatory fields
        if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
        ) {
        throw new Error("All fields are mandatory");
        }
        // Validate the uniqueness of the "code" and "id" fields
        let products = await productModel.find();      
        if (products.some((product) => product.code === code)) {
        throw new Error("The product code already exists.");
        }
        // Creating a new product with auto-incrementable id
        const product = await productModel.create(
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
        request.body.thumbnail,
        request.body.images
        );
        response.status(201).json({product});
        serverSocket.emit("products", await getProducts());
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};
//Update Product
export const updateProduct = async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
        return response.json({ error: "Enter a valid number as ID" });
        } else {
        try {
            const {_id, ...rest}= request.body;
            const uproduct = await productModel.findByIdAndUpdate(pid, {...rest},{new:true});
            response.json({uproduct});
        } catch (error) {
            response
            .status(404)
            .json({ error: `Product with id ${pid} was not found.` });
        }
    }
}

//Delete Product
export const deleteProduct = async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
    return response.json({ error: "Enter a valid number as ID" });
    } else {
    try {
        const dproduct = await productModel.findByIdAndDelete(pid);
        response.json(dproduct);
        serverSocket.emit("products", await getProducts());
    } catch (error) {
        response
            .status(404)
            .json({ error: `Product with id ${pid} was not found.` });
    }
    }
}