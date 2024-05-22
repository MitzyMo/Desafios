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
export const createCart = async (req, res) => {
  try {
      const cart = await manager.createCart();
      res.status(201).json({ cart });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await manager.getCartById(cid);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await manager.addProductToCart(cid, pid);
    res.status(201).json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await manager.deleteProductFromCart(cid, pid);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await manager.deleteAllProductsFromCart(cid);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = req.body;
    await manager.updateCart(cid, cart);
    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProdQtyInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await manager.updateProdQtyInCart(cid, pid, quantity);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
