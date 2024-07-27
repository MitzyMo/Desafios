import mongoose from "mongoose";
import { cartModel } from "../dao/models/cartModel.js";
import { productModel } from "../dao/models/productModel.js";
import logger from "../middleware/logger.js";

export class CartManager {
    async getCartById(cid) {
        try {
        if (!mongoose.isValidObjectId(cid)) {
            throw new Error(`Cart with id ${cid} not found.`);
        }
        const cart = await cartModel
            .findById(cid)
            .populate("products.productId")
            .lean();
        logger.debug(`Validating cart ${JSON.stringify(cart, null, 2)} In manager DB`)
        if (!cart) {
            throw new Error(`Cart with id ${cid} not found.`);
        }
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
            logger.debug(`addProductToCart called with cid: ${cid}, pid: ${pid}`);
            
            if (!mongoose.isValidObjectId(cid)) {
                throw new Error(`Cart with id ${cid} not found.`);
            }
            if (!mongoose.isValidObjectId(pid)) {
                throw new Error(`Product with id ${pid} not found.`);
            }
    
            const cart = await cartModel.findById(cid);
            logger.debug(`Cart found: ${JSON.stringify(cart)}`);
            
            if (!cart) {
                throw new Error(`Cart with id ${cid} not found.`);
            }
    
            const product = await productModel.findById(pid);
            logger.debug(`Product found: ${JSON.stringify(product)}`);
            
            if (!product) {
                throw new Error(`Product with id ${pid} not found.`);
            }
    
            // Filter out invalid product entries
            cart.products = cart.products.filter(p => p.productId);
            
            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
                logger.debug(`Product quantity incremented.`);
            } else {
                cart.products.push({ productId: pid, quantity: 1 });
                logger.debug(`Product added to cart.`);
            }
    
            await cart.save();
            logger.debug(`Cart saved: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error in addProductToCart: ${error.message}`);
            throw new Error(error.message);
        }
    }
    
    async deleteProductFromCart(cid, pid) {
        try {
        if (!mongoose.isValidObjectId(cid)) {
            throw new Error(`Cart with id ${cid} not found.`);
        }
        if (!mongoose.isValidObjectId(pid)) {
            throw new Error(`Product with id ${pid} not found.`);
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            throw new Error(`Cart with id ${cid} not found.`);
        }

        const productIndex = cart.products.findIndex(
            (product) => product.productId.toString() === pid
        );
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
        if (!mongoose.isValidObjectId(cid)) {
            throw new Error(`Cart with id ${cid} not found.`);
        }

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
        if (!mongoose.isValidObjectId(cid)) {
            throw new Error(`Cart with id ${cid} not found.`);
        }

        const updatedCart = { products: cart };
        await cartModel.updateOne({ _id: cid }, updatedCart);
        } catch (error) {
        throw new Error("Error updating cart.");
        }
    }
    async updateProdQtyInCart(cid, pid, quantity) {
        try {
        if (!mongoose.isValidObjectId(cid)) {
            throw new Error(`Cart with id ${cid} not found.`);
        }
        if (!mongoose.isValidObjectId(pid)) {
            throw new Error(`Product with id ${pid} not found.`);
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            throw new Error(`Cart with id ${cid} not found.`);
        }

        const productIndex = cart.products.findIndex(
            (product) => product.productId.toString() === pid
        );
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
