import { cartModel } from "../dao/models/cartModel.js";

export class CartManager {
  async getCartById(cid) {
    try {
      const cart = await cartModel.findById(cid).populate('products.productId');
      return cart;
    } catch (error) {
      throw new Error(`Cart with id ${cid} not found.`);
    }
  }

  async createCart() {
    try {
      const cart = await cartModel.create({});
      return cart;
    } catch (error) {
      throw new Error("Error creating cart.");
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error(`Cart with id ${cid} not found.`);
      }

      const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity++;
      } else {
        cart.products.push({ productId: pid, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error(`Cart with id ${cid} not found.`);
      }

      const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
      if (productIndex === -1) {
        throw new Error(`Product with id ${pid} not found in cart.`);
      }

      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteAllProductsFromCart(cid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error(`Cart with id ${cid} not found.`);
      }

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCart(cid, cart) {
    try {
      const updatedCart = { products: cart };
      await cartModel.updateOne({ _id: cid }, updatedCart);
    } catch (error) {
      throw new Error("Error updating cart.");
    }
  }

  async updateProdQtyInCart(cid, pid, quantity) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error(`Cart with id ${cid} not found.`);
      }

      const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
      if (productIndex !== -1) {
        if (quantity === 0) {
          cart.products.splice(productIndex, 1);
        } else {
          cart.products[productIndex].quantity = quantity;
        }
        await cart.save();
        return cart;
      } else {
        throw new Error(`Product with id ${pid} not found in cart.`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
