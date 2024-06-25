import { TicketService } from "../services/TicketService.js";
import { CartService } from "../services/cartService.js";
TicketService

export const createCart = async (request, response) => {
    try {
        const cart = await CartService.createCart();
        response.status(201).json({ cart });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

export const getCartById = async (request, response) => {
    try {
        const cid = request.params.cid;
        const cart = await CartService.getCartById(cid);
        response.status(200).json({ cart });
    } catch (error) {
        response.status(404).json({ error: error.message });
    }
};

export const addProductToCart = async (request, response) => {
    try {
        const { cid, pid } = request.params;
        const cart = await CartService.addProductToCart(cid, pid);
        response.status(201).json({ cart });
    } catch (error) {
        response.status(404).json({ error: error.message });
    }
};

export const deleteProductFromCart = async (request, response) => {
    try {
        const { cid, pid } = request.params;
        const cart = await CartService.deleteProductFromCart(cid, pid);
        response.status(200).json({ cart });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

export const deleteAllProductsFromCart = async (request, response) => {
    try {
        const { cid } = request.params;
        const cart = await CartService.deleteAllProductsFromCart(cid);
        response.status(200).json({ cart });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

export const updateCart = async (request, response) => {
    try {
        const { cid } = request.params;
        const cart = request.body;
        await CartService.updateCart(cid, cart);
        response.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

export const updateProdQtyInCart = async (request, response) => {
    try {
        const { cid, pid } = request.params;
        const { quantity } = request.body;
        const cart = await CartService.updateProdQtyInCart(cid, pid, quantity);
        response.status(200).json({ cart });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};
