import logger from "../middleware/logger.js";
import { ProductService } from "../services/ProductService.js";
import { TicketService } from "../services/TicketService.js";
import { CartService } from "../services/cartService.js";
import { emailTransport } from "../utils/utils.js";
const productService = new ProductService();

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
  logger.debug(`Adding to cart`)
  try {
    const { cid, pid } = request.params;
    logger.debug(`Adding to cart params in CART Controller ${cid} , ${pid}`);
    const cart = await CartService.addProductToCart(cid, pid);
    response.status(201).json({ cart });
  } catch (error) {
    logger.error(`Error in addProductToCart controller: ${error.message}`);
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
    //await CartService.updateCart(cid, { products: newCart });
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

export const purchaseCart = async (request, response) => {
  const { cid } = request.params;
  const { user } = request;

  let productsInStock = [];
  let productsOutOfStock = [];
  let newCart = [];
  let amount = 0;

  try {
    let { products } = await CartService.getCartById(cid);
    for (let prod of products) {
      if (prod.productId.stock >= prod.quantity) {
        let newStock = prod.productId.stock - prod.quantity;
        await productService.updateProduct(prod.productId._id, {
          stock: newStock,
        });
        productsInStock.push(prod);
        amount += prod.quantity * prod.productId.price;
      } else {
        console.log(`Product ID: ${prod.productId._id} out of stock.`);
        productsOutOfStock.push(prod);
        newCart.push({
          productId: prod.productId._id,
          quantity: prod.quantity,
        });
      }
    }
    productsInStock = productsInStock.map((product) => ({
      productId: product.productId._id,
      quantity: product.quantity,
      price: product.productId.price,
    }));
    productsOutOfStock = productsOutOfStock.map((product) => ({
      productId: product.productId._id,
      quantity: product.quantity,
      message: "Out of stock",
    }));
    let newTicket = null;
    if (productsInStock.length > 0) {
        let code = cid + "-" + Math.random().toString(36).substring(2, 15).toUpperCase();
        let purchaser = user.email;
        try {
            newTicket = await TicketService.createTicket({ code, amount, purchaser });
            console.log(`Ticket created: ${JSON.stringify(newTicket)}`);
        } catch (ticketError) {
            throw ticketError;
        }
    }

    await CartService.updateCart(cid, { products: newCart });
    console.log(
      `Updated cart with remaining products: ${JSON.stringify(newCart)}`
    );

    const htmlContent = () => {
        let html = `
          <p><b>Purchase Ticket:</b></p>
          <p>Code: ${newTicket.code}</p>
          <p>Date and Time: ${newTicket.purchase_datetime}</p>
          <p>Total: $${newTicket.amount}</p>
          <p>Email: ${newTicket.purchaser}</p>
          <br>
          <p><strong>Products Available:</strong></p>
          <ul>${productsInStock
            .map(
              (prod) =>
                `<li>${prod.productId.title} - Price: $${prod.price} - Quantity: ${prod.quantity} - Subtotal: $${prod.quantity * prod.price}</li>`
            )
            .join("")}</ul>`;
        console.log('HTML Content:', html);
        return html;
      };
      
      if (productsInStock.length > 0 && productsOutOfStock.length === 0) {
        console.log('Sending email to:', user.email);
        emailTransport(user.email, "Purchase Ticket", htmlContent());
        console.log('Response Data:', {
          status: "success",
          message: "Purchase Successful.",
          ticket: newTicket,
          confirmed: productsInStock,
        });
        return response.status(200).json({
          status: "success",
          message: "Purchase Successful.",
          ticket: newTicket,
          confirmed: productsInStock,
        });
      }
      
      if (productsInStock.length > 0 && productsOutOfStock.length > 0) {
        console.log('Partial Success Response:', {
          status: "partial_success",
          message: "The purchase of some products could not be completed due to lack of stock.",
          ticket: newTicket,
          confirmed: productsInStock,
          rejected: productsOutOfStock,
        });
      
        emailTransport(user.email, "Purchase Ticket", htmlContent());
        return response.status(200).json({
          status: "partial_success",
          message: "The purchase of some products could not be completed due to lack of stock.",
          ticket: newTicket,
          confirmed: productsInStock,
          rejected: productsOutOfStock,
        });
      }
      
      if (productsInStock.length === 0 && productsOutOfStock.length > 0) {
        console.log('Fail Response:', {
          status: "fail",
          message: "The purchase could not be completed due to lack of stock.",
          rejected: productsOutOfStock,
        });
        return response.status(200).json({
          status: "fail",
          message: "The purchase could not be completed due to lack of stock.",
          rejected: productsOutOfStock,
        });
      }
  } catch (error) {
    console.error(`Final Error during purchase process: ${error.message}`);
    response.status(500).json({ error: error.message });
  }
};