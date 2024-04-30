import { cartModel } from "../dao/models/cartModel.js";

// Route to list products in a cart
export const getCartById = async (request, response) => {
    const { cid } = request.params;
    try {
        const cart = await cartModel.findById(Number(cid));
        if (!cart) {
        return response.status(404).json({ error: "Cart not found" });
        }
        return response.status(201).json({ cart });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
};

//add a cart
export const createCart = async (request, response) => {
    try {
        const cart = await cartModel.create({});
        return response.status(201).json({ cart });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
};

// Route to add a product to a cart
export const addProductToCart = async (request, response) => {
    const { cid, pid } = request.params;
    try {
        const cart = await cartModel.findById(Number(cid));
        if (!cart) {
        return response.status(404).json({ error: "Cart not found" });
        }
        const productIndex = cart.products.find(
        (product) => product.productId === pid
        );
        if (productIndex) {
        productIndex.quantity++;
        } else {
        cart.products.push({ productId: pid, quantity: 1 });
        }
        cart.save();
        return response.status(201).json({ cart });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
};
