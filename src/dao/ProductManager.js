const { promises: filePromise } = require("fs");

//1 . Build a "ProductManager" class that manages a set of products.
class ProductManager {
    static idCounter = 0;
    //2. It must be created from its constructor with the products element, which will be an empty array.
    constructor(filePath) {
        this.path = filePath;
    }
    //3. It must have a method "getProducts" which must return the array with all the products created up to that moment.
    async getProducts() {
        try {
        const data = await filePromise.readFile(this.path, { encoding: "utf8" });
        return JSON.parse(data);
        } catch (error) {
        if (error.code === "ENOENT") {
            // If the file does not exist, return an empty array
            return [];
        } else {
            // Log any other errors
            console.error("Error reading products:", error);
            throw error;
        }
        }
    }
    //4. You must have an "addProduct" method which will add a product to the initial product array.
    /*         
            - Validate that the "code" field is not repeated and that all fields are mandatory. When adding it, it must be created with an auto-incrementable id. 
            Each product it manages must have the following properties:
            - id: Number/String (Your choice, the id is NOT sent from body, it is auto generated as we have seen from the first deliverables, ensuring that you will NEVER repeat ids in the file)
            - title:String,
            - description:String
            - code:String (This can not be repeated).
            - price:Number
            - discountPercentage
            - rating
            - brand
            - status:Boolean*
            - stock:Number
            - category:String
            - thumbnails: Array of Strings containing the paths where the images referring to that product are stored.
                *. title, description, code, price, status, stock, category, ARE REQUIRED. 
                *. thumbnails, discountPercentage, rating, brand, images. NOT mandatory.
            */
    async addProduct(
        title,
        description,
        code,
        price,
        discountPercentage,
        rating,
        status,
        stock,
        brand,
        category,
        thumbnails = [],
        images = []
    ) {
        // Validate mandatory fields
        if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
        ) {
        throw new Error("All fields are mandatory");
        }

        let products = await this.getProducts();

        // Validate the uniqueness of the "code" and "id" fields
        if (products.some((product) => product.code === code)) {
        throw new Error("The product code already exists.");
        }
        // Find the maximum ID in existing products and increment by 1
        const maxId = products.reduce(
        (max, product) => Math.max(max, product.id),
        0
        );
        const newId = maxId + 1;
        // Creating a new product with auto-incrementable id
        const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        discountPercentage,
        rating,
        brand,
        status,
        stock,
        category,
        thumbnails,
        images,
        };

        // Add the new product to the existing products array
        products.push(newProduct);

        try {
        // Write the updated array back to the file
        await filePromise.writeFile(this.path, JSON.stringify(products, null, 5));
        } catch (error) {
        console.error("Unable to write products into file:", error);
        throw error; // Propagate the error
        }

        return newProduct; // Return the newly added product
    }

    /* 5. It must have a method "getProductByld" which must search the array for the product that matches the id.
        ーIn case no id is matched, display a "Not found" error in console.
        */
    async getProductById(id) {
        let products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (product) {
        return product;
        } else {
        return `Product with id: "${id}" not found.`;
        }
    }
    /*
            6. It must have an updateProduct method, which must receive the id of the product to update, as well as the field to  update (it can be the whole object, as in a DB), and must update the product that has that id in the file.
                ITS ID MUST NOT BE DELETED
                */
    async updateProduct(id, updatedFields) {
        let products = await this.getProducts();
        const product = products.findIndex((product) => product.id === id);
        if (product !== -1) {
        try {
            // Update product with the provided fields
            products[product] = { ...products[product], ...updatedFields };
            // Write the updated array back to the file
            await filePromise.writeFile(
            this.path,
            JSON.stringify(products, null, 5)
            );
            return `Product with id "${id}" has been updated`;
        } catch (error) {
            console.log(`Failed to update product: ${error}`);
        }
        } else {
        console.log(`Product with id "${id}" not found`);
        }
    }
    /*
            7. It must have a deleteProduct method, which must receive an id and must delete the product that has that id in the file.
                */
    async deleteProduct(id) {
        let products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (product) {
        try {
            // Delete the product with the id given by parameter
            products = products.filter((product) => product.id !== id);
            filePromise.writeFile(this.path, JSON.stringify(products));
            return `Product with id "${id}" has been deleted`;
        } catch (error) {
            console.log(`Unable to delete product: ${error}`);
        }
        } else {
        return `Product with id "${id}" not found`;
        }
    }
}

module.exports = ProductManager;

/* 
//-------------------------------- TESTING --------------------------------
    console.log(process.cwd());
    const manager = new ProductManager("./src/data/products.json");
//Get all products: 
try {
    const products = await manager.getProducts();
    console.log(products);
    } catch (error) {
    console.error("Error:", error);
}
//Adding a new product
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

// Call the addProduct method to add the new product
try {
    const newProduct = await manager.addProduct(title, description, code, price, discountPercentage, rating, status, stock, brand, category, thumbnails, images);
    console.log("New product added successfully:", newProduct);
} catch (error) {
    console.error("Error adding product:", error);
}  
//Get products by ID: 
try {
    const products = await manager.getProductById(31);
    console.log(products);
    } catch (error) {
    console.error("Error:", error);
} 
// Define the updated fields
const updatedFields = {
    price: 29.99, // New price
    stock: 50 // New stock
};
// Call the updateProduct method to update the product
try {
    const updateResult = await manager.updateProduct(31, updatedFields);
    console.log(updateResult);
} catch (error) {
    console.error("Error updating product:", error);
}
//Get products by ID: 
try {
    const products = await manager.getProductById(100);
    console.log(products);
    } catch (error) {
    console.error("Error:", error);
} 
//Delete products by ID
try {
    const products = await manager.deleteProduct(31);
    console.log(products);
    } catch (error) {
    console.error("Error:", error);
}*/
