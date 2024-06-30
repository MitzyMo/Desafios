import { CartManager } from "../dao/CartManagerDB.js";
const manager = new CartManager();

export const CartService = {
    async createCart() {
        try {
            const cart = await manager.createCart();
            return cart;
        } catch (error) {
            throw error;
        }
    },

    async getCartById(cid) {
        try {
            const cart = await manager.getCartById(cid);
            return cart;
        } catch (error) {
            throw error;
        }
    },

    async addProductToCart(cid, pid) {
        try {
            const cart = await manager.addProductToCart(cid, pid);
            return cart;
        } catch (error) {
            throw error;
        }
    },

    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await manager.deleteProductFromCart(cid, pid);
            return cart;
        } catch (error) {
            throw error;
        }
    },

    async deleteAllProductsFromCart(cid) {
        try {
            const cart = await manager.deleteAllProductsFromCart(cid);
            return cart;
        } catch (error) {
            throw error;
        }
    },

    async updateCart(cid, cart) {
        try {
            await manager.updateCart(cid, cart);
            return { message: "Cart updated successfully" };
        } catch (error) {
            throw error;
        }
    },

    async updateProdQtyInCart(cid, pid, quantity) {
        try {
            const cart = await manager.updateProdQtyInCart(cid, pid, quantity);
            return cart;
        } catch (error) {
            throw error;
        }
    },
    async createCartInternal() {
        try {
            const cart = await manager.createCart();
            return cart;
        } catch (error) {
            throw error;
        }
    }
};