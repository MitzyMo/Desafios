const path = require("path");
const ProductManager = require("../src/dao/ProductManager");
let filePath = path.join(__dirname,'..','src', "data", "products.json");
//----------------Initiate Test----------------//
const manager = new ProductManager(filePath);
// Get all products
const testGetProducts = async () => {
    try {
        const products = await manager.getProducts();
        console.log(products);
        } catch (error) {
        console.error("Error:", error);
    }
};

// Adding a new product
const testAddingProduct = async () => {
    const title = "New Product";
    const description = "Description of the new product";
    const code = "ABC123"; // Unique product code
    const price = 19.99;
    const discountPercentage = 10;
    const rating = 4.5;
    const brand = "Brand Name";
    const status = true;
    const stock = 100;
    const category = "Category Name";
    const thumbnails = ["path/to/thumbnail1.jpg", "path/to/thumbnail2.jpg"];
    const images = ["path/to/image1.jpg", "path/to/image2.jpg"];

    try {
        const newProduct = await manager.addProduct(title, description, code, price, discountPercentage, rating, status, stock, brand, category, thumbnails, images);
        console.log("New product added successfully:", newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

// Get products by ID
const testGetProductById = async (id) => {
    try {
        const product = await manager.getProductById(id);
        console.log(product);
    } catch (error) {
        console.error("Error:", error);
    }
};

// Update product by ID
const testUpdateProductById = async (id, updatedFields) => {
    try {
        const updateResult = await manager.updateProduct(id, updatedFields);
        console.log(updateResult);
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

// Delete product by ID
const testDeleteProductById = async (id) => {
    try {
        const deleteResult = await manager.deleteProduct(id);
        console.log(deleteResult);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};

//----------------Calling All Tests----------------//

const testAll = async () => {
    try {
        // Get all products before adding a new one
        console.log("----Get all products before adding a new one----");
        await testGetProducts();

        // Add a new product
        console.log("----Adding a new product----");
        await testAddingProduct();

        // Get all products after adding the new one
        console.log("----Get all products after adding the new one----");
        await testGetProducts();

        // Get products by ID after adding the new one
        console.log("----Get products by ID after adding the new one----");
        await testGetProductById(31);

        // Update the newly added product
        console.log("----Update the newly added product----");
        await testUpdateProductById(31, { price: 29.99, stock: 50 });

        // Get products by ID after updating
        console.log("----Get products by ID after updating----");
        await testGetProductById(31);

        // Delete the newly added product
        console.log("----Delete the newly added product----");
        await testDeleteProductById(31);

        // Get all products after deleting the new one
        console.log("----Get all products after deleting the new one----");
        await testGetProducts(); 

    } catch (error) {
        console.error("Error:", error);
    }
};
console.log(process.cwd());
testAll();
