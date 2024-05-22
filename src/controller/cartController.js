import { CartManager } from "../dao/CartManagerDB.js";
const manager = new CartManager();

// Separate function for internal use
export const createCartInternal = async () => {
  try {
      const cart = await manager.createCart();
      return cart;
  } catch (error) {
      throw error;  // Ensure to throw error for internal calls
  }
};

// External API function
export const createCart = async (request, response) => {
  try {
      const cart = await manager.createCart();
      response.status(201).json({ cart });
  } catch (error) {
      response.status(500).json({ error: error.message });
  }
};

export const getCartById = async (request, response) => {
  try {
    const cid = request.params.cid;
    const cart = await manager.getCartById(cid);
    response.status(200).json({ cart });
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
};

export const addProductToCart = async (request, response) => {
  try {
    const { cid, pid } = request.params;
    const cart = await manager.addProductToCart(cid, pid);
    response.status(201).json({ cart });
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
};


export const deleteProductFromCart = async (request, response) => {
  try {
    const { cid, pid } = request.params;
    const cart = await manager.deleteProductFromCart(cid, pid);
    response.status(200).json({ cart });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

export const deleteAllProductsFromCart = async (request, response) => {
  try {
    const { cid } = request.params;
    const cart = await manager.deleteAllProductsFromCart(cid);
    response.status(200).json({ cart });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

export const updateCart = async (request, response) => {
  try {
    const { cid } = request.params;
    const cart = request.body;
    await manager.updateCart(cid, cart);
    response.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

export const updateProdQtyInCart = async (request, response) => {
  try {
    const { cid, pid } = request.params;
    const { quantity } = request.body;
    const cart = await manager.updateProdQtyInCart(cid, pid, quantity);
    response.status(200).json({ cart });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
