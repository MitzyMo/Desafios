//----------------Declaring Test Data----------------//
const path = require("path");
const ProductManager = require("./ProductManager");
let filePath = path.join(__dirname, "data", "products.json");
const manager = new ProductManager(filePath);

//----------------Initiate Test----------------//
const testGetProducts = async () => {
    try {
        console.log(await manager.getProducts());
    } catch (error) {
        console.log(error.message);
    }
};
const testGetProductsById = async (id) => {
    try {
        console.log(await manager.getProductById(id));
    } catch (error) {
        console.log(error.message);
    }
};
const testAddingProducts = async () => { 
    try {
        await manager.addProduct("producto prueba 1","Este es un producto prueba 1",200,"Sin imagen","abc123",25);
        await manager.addProduct("producto prueba 2","Este es un producto prueba 2",200,"Sin imagen","abc234",25);
        await manager.addProduct("producto prueba 3","Este es un producto prueba 3",200,"Sin imagen","abc345",25);
    } catch (error) {
        console.log(error.message);
    }
};
const testUpdateProductById = async (id, updatedFields) => {
    try {
        console.log(await manager.updateProduct(id, updatedFields));
    } catch (error) {
        console.log(error.message);
    }
};
const testDeleteProductsById = async (id) => {
    try {
        console.log(await manager.deleteProduct(id));
    } catch (error) {
        console.log(error.message);
    }
};


//----------------Calling All Tests----------------//

//----------------Initiate Test----------------//
const testAll = async () => {
    try {
        // Get all products before adding to the list
        console.log("----Get all products before adding to the list----");
        await testGetProducts();

        // Get products by ID before adding to the list
        console.log("----Get products by ID before adding to the list----");
        await testGetProductsById(1);

        // Add products
        console.log("----Adding products----");
        await testAddingProducts();

        // Get all products after being added / Validate autoincremental
        console.log("----Get all products after being added / Validate autoincremental----");
        await testGetProducts();

        // Get products by ID after being added
        console.log("----Get products by ID after being added----");
        await testGetProductsById(1);

        console.log("--------Validating that product codes cannot be repeated --------");
        await testAddingProducts();

        console.log("--------Validating error when calling an ID that does not exist: --------");
        await testDeleteProductsById(5);

        // Delete Product by ID
        console.log("----Delete Product by ID----");
        await testDeleteProductsById(2);

        // Get all products after deleting one
        console.log("----Get all products after deleting one----");
        await testGetProducts();

        // Update a product
        console.log("----Update a product----");
        await testUpdateProductById(1, { price: 20, stock: 100 });

        console.log("--------Validating that the product is updated: --------");
        await testGetProductsById(1);

    } catch (error) {
        console.log(error.message);
    }
};

testAll();
