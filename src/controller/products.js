import { productModel } from "../dao/models/productModel.js";
import serverSocket from "../app.js"; // Import the serverSocket instance

export class ProductManager {
  //get all Products
  async getProducts(request, response) {
    try {
      let limit = request.query.limit;
      // if (Number(limit) && limit > 0) {data = data.slice(0, limit);}
      let data = await productModel.find().limit(Number(limit));
      let totalProducts = await productModel.countDocuments();
      return response.json({ totalProducts, data });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get all Products with pagination
// Get all Products with pagination and optional filters
async getProductsPaginate(limit = 10, page = 1, category, status, sort) {
  let sortQuery = {};
  if (sort === "asc") {
    sortQuery = { price: 1 };
  } else if (sort === "dsc") {
    sortQuery = { price: -1 };
  }
  let filterQuery = {};
  if (category !== "null") {
    filterQuery.category = category;
  }
  if (status !== undefined && status !== null) {
    filterQuery.status = status;
  }
  try {
    return await productModel.paginate(
      filterQuery,
      { limit, page, sort: sortQuery, lean: true }
    );
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}



  // Get Products by ID
  async getProductById(request, response) {
    let pid = request.params.pid;
    try {
      const product = await productModel.findById(pid);
      response.json({ product }); // Send the product back to the client
    } catch (error) {
      response
        .status(404)
        .json({ error: `Product with id ${pid} was not found.` });
    }
  }

  // Add Product
  async addProduct(request, response) {
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
      if (!title || !description || !code || !price || !status || !category) {
        return response.status(400).json({
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
  }

  // Update Product
  async updateProduct(request, response) {
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
  }

  // Delete Product
  async deleteProduct(request, response) {
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
  }
}
//export default { ProductManager };
