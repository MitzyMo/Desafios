import serverSocket from "../app.js";
import { ProductService } from "../services/ProductService.js";
import { CustomError, errorDictionary } from "../middleware/errorHandler.js"
import logger from "../middleware/logger.js";

const manager = new ProductService();

export const getProducts = async (request, response) => {
  logger.debug(`Entered getProducts`)
  try {
    const limit = request.query.limit;
    const { totalProducts, data } = await manager.getProducts(limit);
    response.json({ totalProducts, data });
  } catch (error) {
    response.status(500).json({ error: "Error fetching products." });
  }
};

export const getProductsPaginate = async (request, response) => {
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
    const { limit, page, category, status, sort } = request.query;
    const result = await manager.getProductsPaginate(limit, page, category, status, sort);
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

export const getProductById = async (request, response) => {
  try {
    const pid = request.params.pid;
    const product = await manager.getProductById(pid);
    response.json({ product });
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
};

export const addProduct = async (request, response) => {
  try {
    const product = request.body;
    const newProduct = await manager.addProduct(product);
    serverSocket.emit("products", await manager.getProducts());
    response.status(201).json({ product: newProduct });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

export const createProduct = async (request, response, next) => {
  try {
    const { title, price } = request.body;

    if (!title) {
      throw new CustomError(errorDictionary.PRODUCT_CREATION.MISSING_TITLE, 400);
    }

    if (price === undefined) {
      throw new CustomError(errorDictionary.PRODUCT_CREATION.MISSING_PRICE, 400);
    }

    if (isNaN(price)) {
      throw new CustomError(errorDictionary.PRODUCT_CREATION.INVALID_PRICE, 400);
    }

    const newProduct = request.body;
    const result = await manager.addProduct(newProduct);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (request, response) => {
  try {
    const pid = request.params.pid;
    const updatedProduct = request.body;
    const uproduct = await manager.updateProduct(pid, updatedProduct);
    serverSocket.emit("products", await manager.getProducts());
    response.json({ uproduct });
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
};

export const deleteProduct = async (request, response) => {
  try {
    const pid = request.params.pid;
    const dproduct = await manager.deleteProduct(pid);
    serverSocket.emit("products", await manager.getProducts());
    response.json(dproduct);
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
};