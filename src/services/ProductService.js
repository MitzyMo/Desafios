import { ProductManager } from "../dao/ProductManagerDB.js";
const manager = new ProductManager();
export class ProductService {
  async getProducts(limit) {
    try {
      return await manager.getProducts(limit);
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  async getProductsPaginate(limit = 10, page = 1, category, status, sort) {
    try {
      return await manager.getProductsPaginate(limit, page, category, status, sort);
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  async getProductById(pid) {
    try {
      return await manager.getProductById(pid);
    } catch (error) {
      throw new Error(`Product with id ${pid} was not found.`);
    }
  }

  async addProduct(product) {
    try {
      return await manager.addProduct(product);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(pid, updatedProduct) {
    try {
      return await manager.updateProduct(pid, updatedProduct);
    } catch (error) {
      throw new Error(`Product with id ${pid} was not found.`);
    }
  }

  async deleteProduct(pid) {
    try {
      return await manager.deleteProduct(pid);
    } catch (error) {
      throw new Error(`Product with id ${pid} was not found.`);
    }
  }
}
