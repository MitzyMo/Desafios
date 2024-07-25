import path from 'path'; 
import __dirname from "../utils/utils.js"; 
import { promises as filePromise } from 'fs';
import ProductManagerModule from './ProductManagerFileSystem.js';

const { ProductManager } = ProductManagerModule;

let productsFilePath = path.join(__dirname,'..','src', "data", "products.json");
class CartManager {
    constructor() {
        this.cartsFilePath = path.join(__dirname,'..','src', "data", "carts.json")
        this.carts = [];
    }   
    async loadCartData() {
        console.log('Testing Path',this.cartsFilePath);
        try {
        const data = await filePromise.readFile(this.cartsFilePath, {
            encoding: "utf8",
        });
        console.log("Carts data read from file:", data);
        // Parse JSON data only if it's not empty
        this.carts = data ? JSON.parse(data) : [];
        } catch (error) {
        if (error.code === "ENOENT") {
            // If the file does not exist, return an empty array
            this.carts = [];
        } else {
            // Log any other errors
            console.error("Error reading cart:", error);
            throw error;
        }
        }
    }
    async getCartById(id) {
        await this.loadCartData(); // Wait for cart data to be loaded
        const cart = this.carts.find((cart) => cart.id === id);
        if (cart) {
        return cart;
        } else {
        throw new Error(`cart with id: "${id}" not found.`);
        }
    }
    async createCart() {
        await this.loadCartData();
        // Find the maximum ID in existing carts and increment by 1
        const newId =
        this.carts.length > 0
            ? Math.max(...this.carts.map((cart) => cart.id)) + 1
            : 1;
        // Creating a new cart with auto-incrementable id
        const newCart = {
        id: newId,
        products: [],
        };
        // Add the new cart to the existing carts array
        this.carts.push(newCart);
        // Write the updated array back to the file
        await this.writeToFile(this.carts);
        return newCart;
    }
    // Add a product into the cart
    async addProductToCart(cid, pid) {
        const manager = new ProductManager(productsFilePath);
        // Load carts data
        await this.loadCartData();
        // Find the index of the cart with the given id
        const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
        // If the cart with the given id exists
        if (cartIndex !== -1) {
            // Check if the product already exists in the cart
            const productIndex = this.carts[cartIndex].products.findIndex((product) => product.productId === pid);
            // If the product already exists in the cart
            if (productIndex !== -1) {
                // Increment the quantity of the existing product by 1
                this.carts[cartIndex].products[productIndex].quantity += 1;
            } else {
                // Get the product details
                const product = await manager.getProductById(pid);
                // If the product exists
                if (product) {
                    // Add the product to the cart with a quantity of 1
                    this.carts[cartIndex].products.push({ productId: pid, quantity: 1 });
                } else {
                    // If the product does not exist, throw an error
                    throw new Error(`Product with id ${pid} does not exist.`);
                }
            }
            // Write the updated carts data back to the file
            await this.writeToFile(this.carts);
            // Return the updated cart
            return this.carts[cartIndex];
        } else {
            // If the cart does not exist, throw an error
            throw new Error(`Cart with id ${cid} does not exist.`);
        }
    }   
    //write data to json file
    async writeToFile(carts) {
        try {
        // Write the updated array back to the file
        await filePromise.writeFile(
            this.cartsFilePath,
            JSON.stringify(carts, null, 5)
        );
        } catch (error) {
        console.error("Unable to write carts into file:", error);
        throw error; // Propagate the error
        }
    }
}
export default {CartManager};
