import serverSocket from "../app.js";
import { ProductManager } from "../dao/ProductManagerDB.js";

const manager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit;
    const { totalProducts, data } = await manager.getProducts(limit);
    res.json({ totalProducts, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsPaginate = async (req, res) => {
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
    const { limit, page, category, status, sort } = req.query;
    const result = await manager.getProductsPaginate(limit, page, category, status, sort);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await manager.getProductById(pid);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await manager.addProduct(product);
    serverSocket.emit("products", await manager.getProducts());
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    const uproduct = await manager.updateProduct(pid, updatedProduct);
    serverSocket.emit("products", await manager.getProducts());
    res.json({ uproduct });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const dproduct = await manager.deleteProduct(pid);
    serverSocket.emit("products", await manager.getProducts());
    res.json(dproduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};