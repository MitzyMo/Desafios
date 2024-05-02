import { productModel } from "../dao/models/productModel.js";
import serverSocket from "../app.js"; // Import the serverSocket instance

//get all Products
export const getProducts = async (request, response) => {
  try {
    
    let limit = request.query.limit;
    /*     
    if (Number(limit) && limit > 0) {
    data = data.slice(0, limit);
    } */
    let data = await productModel.find().limit(Number(limit));
    let totalProducts = await productModel.countDocuments();
    response.json({ totalProducts, data });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};
// Get Products by ID
export const getProductById = async (request, response) => {
  let pid = request.params.pid;
  try {
    const product = await productModel.findById(pid);
    response.json({ product }); // Send the product back to the client
  } catch (error) {
    response
      .status(404)
      .json({ error: `Product with id ${pid} was not found.` });
  }
};
//Add Products
// Add Products
export const addProduct = async (request, response) => {
    try {
        // Extracting fields from the request body
        const {
        title,
        description,
        code,
        price,
        discountPercentage,
        rating,
        status,
        stock,
        brand,
        category,
        thumbnail,
        images,
        } = request.body;

        // Validate mandatory fields
        if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !category
        ) {
        return response
            .status(400)
            .json({
            error:
                "The fields title, description, code, price, status, stock, and category are mandatory",
            });
        }

        // Check uniqueness of the "code" field
        const existingProduct = await productModel.findOne({ code: code });
        if (existingProduct) {
        return response
            .status(400)
            .json({ error: "A product with the same code already exists" });
        }

        // Creating a new product
        const product = await productModel.create({
        title,
        description,
        code,
        price,
        discountPercentage,
        rating,
        status,
        stock,
        brand,
        category,
        thumbnail,
        images,
        });

        // Emitting product update event to socket
        serverSocket.emit("products", await productModel.find());

        // Sending the newly created product in the response
        response.status(201).json({ product });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

//Update Product
export const updateProduct = async (request, response) => {
  let pid = request.params.pid;
  try {
    const { _id, ...rest } = request.body;
    const uproduct = await productModel.findByIdAndUpdate(
      pid,
      { ...rest },
      { new: true }
    );
    response.json({ uproduct });
    serverSocket.emit("products", await productModel.find());
  } catch (error) {
    response
      .status(404)
      .json({ error: `Product with id ${pid} was not found.` });
  }
};

//Delete Product
export const deleteProduct = async (request, response) => {
    let pid = request.params.pid;
    try {  
      const dproduct = await productModel.findByIdAndDelete(pid);
      response.json(dproduct);
      serverSocket.emit("products", await productModel.find());
    } catch (error) {
      response
        .status(404)
        .json({ error: `Product with id ${pid} was not found.` });
    }
  
};
