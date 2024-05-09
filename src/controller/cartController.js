import { cartModel } from "../dao/models/cartModel.js";
import mongoose, { isValidObjectId } from 'mongoose';

export class CartManager {
// Route to list products in a cart
async getCartById (request, response){
    const { cid } = request.params;
    try {
        const cart = await cartModel.findById(cid).populate('products.productId');
        if (!cart) {
        return response.status(404).json({ error:`Cart with id ${cid} not found.` });
        }
        return response.status(201).json({ cart });
    } catch (error) {
        return response.status(500).json({ error:`Contact your administrator.` });
    }
 }; 
//Create a new Carrt, it creates it with the prodct passed through id
async createCart(request, response) {
    try {
        const cart = await cartModel.create({});
        return response.status(201).json({ cart });
    } catch (error) {
        return response.status(500).json({ error:`Contact your administrator.` })
    }
};

// Route to add a product to a cart
async addProductToCart(request, response){
    const { cid, pid } = request.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
        return response.status(404).json({ error:`Cart with id ${cid} not found.` });
        }
        const productIndex = cart.products.find(product => product.productId.toString() === pid);
        if (productIndex) {
        productIndex.quantity++;
        } else {
        cart.products.push({ productId: pid, quantity: 1 });
        }
        cart.save();
        return response.status(201).json({ cart });
    } catch (error) {
        return response.status(500).json({ error:`Contact your administrator.` });
    }
};
//Delete The selected Product from Cart
async deleteProductFromCart(request, response){
    const { cid, pid } = request.params;
    console.log('cart: ',cid ,'product',pid);
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return response.status(404).json({ error:`Cart with id ${cid} not found.` });
        }
        // Find the index of the product to delete
        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
        if (productIndex === -1) {
            return response.status(404).json({ error:`Product with id ${pid} not found in cart.` });
        }
        // Remove the product from the array
        cart.products.splice(productIndex, 1);
        cart.save();
        return response.status(200).json({ cart });
    } catch (error) {
        return response.status(500).json({ error:`Contact your administrator.` });
    }
};
// Delete all products from cart
async deleteAllProductsFromCart(request, response){
    const { cid } = request.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return response.status(404).json({ error:`Cart with id ${cid} not found.` });
        }
        cart.products = [];
        cart.save();
        return response.status(200).json({cart });
    } catch (error) {
        return response.status(500).json({ error:`Contact your administrator.` });
    }
};
// Update cart with an array of products
async updateCart(cid, cart, response) {
    try {
      const updatedCart = { products: cart };
      await cartModel.updateOne({ _id: cid }, updatedCart);
      return response.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Error updating cart" });
    }
  }

// Update product quantity in cart or remove product if quantity is 0
async updateProdQtyInCart(request, response) {
    const { cid, pid } = request.params;
    const { quantity } = request.body;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return response.status(404).json({ error: `Cart with id ${cid} not found.` });
        }
        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
        if (productIndex !== -1) {
            if (quantity === 0) {
                // Remove the product from the cart if quantity is 0
                cart.products.splice(productIndex, 1);
            } else {
                // Update the quantity of the product
                cart.products[productIndex].quantity = quantity;
            }
            await cart.save();
            return response.status(200).json({ cart });
        } else {
            return response.status(404).json({ error: `Product with id ${pid} not found in cart.` });
        }
    } catch (error) {
        return response.status(500).json({ error: `Contact your administrator.` });
    }
};
}

// ------------------------------------------------------------------