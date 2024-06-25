import { UserDTO } from "../DTO/UserDTO.js";
import { ProductService } from "../services/ProductService.js";
import { TicketService } from "../services/TicketService.js";
import { CartService } from "../services/cartService.js";


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

export const purchaseCart = async (request, response) => {
    
    const { cid, pid } = request.params
    const { user } = request
//UserDTO
    let productsInStock = []
    let productsOutOfStock = []
    let newCart = []
    let amount = 0
    
    try {
        let {products} = await CartService.getCartById(cid)
        console.log('1.Products: ',products);
        for(let prod of products){
            console.log('2 prod: ',prod);
            if(prod.product.stock >= prod.quantity){
                console.log('3 stock: ',prod.product.stock);
                console.log('3 quantity: ',prod.product.quantity);
                
                let newStock = prod.product.stock - prod.quantity
                    // Resta del stock las cantidades compradas en cada producto
                await ProductService.updateProduct(prod.product._id, {stock: newStock})
                productsInStock.push(prod)

                amount += prod.quantity * prod.product.price
                
            }else{
                productsOutOfStock.push(prod)
                newCart.push({product:prod.product._id, quantity:prod.quantity})
            }
        }
        productsInStock=productsInStock.map(product=>new )
        productsOutOfStock=productsOutOfStock.map(product=>new )
        
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}  