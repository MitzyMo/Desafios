import { productModel } from "../dao/models/productModel.js";

export class ProductManager {
  async getProducts(limit) {
    try {
      let data = await productModel.find().limit(Number(limit));
      let totalProducts = await productModel.countDocuments();
      return { totalProducts, data };
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
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
      const result = await productModel.paginate(
        filterQuery,
        { limit, page, sort: sortQuery, lean: true }
      );
      return result;
    } catch (error) {
      return { error: "Internal Server Error" };
    }
  }
  async getProductById(pid) {
    try {
      const product = await productModel.findById(pid);
      return product;
    } catch (error) {
      throw new Error(`Product with id ${pid} was not found.`);
    }
  }
  async addProduct(product) {
    try {
      const existingProduct = await productModel.findOne({ code: product.code });
      if (existingProduct) {
        throw new Error("A product with the same code already exists");
      }

      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateProduct(pid, updatedProduct) {
    try {
      const uproduct = await productModel.findByIdAndUpdate(
        pid,
        { ...updatedProduct },
        { new: true }
      );
      return uproduct;
    } catch (error) {
      throw new Error(`Product with id ${pid} was not found.`);
    }
  }
  async deleteProduct(pid) {
    try {
      const dproduct = await productModel.findByIdAndDelete(pid);
      return dproduct;
    } catch (error) {
      throw new Error(`Product with id ${pid} was not found.`);
    }
  }
}
