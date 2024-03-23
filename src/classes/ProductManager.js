const { promises: filePromise } = require("fs");
//Realizar una clase "ProductManager" que gestione un conjunto de productos.
class ProductManager {
    static idCounter = 0;

    //Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
    constructor(filePath) {
        this.path = filePath;
    }
    /*
    Debe contar con un método "getProducts" el cual debe devolver el arreglo con todos los productos creados hasta ese momento
    */
    async getProducts() {
        try {
        return JSON.parse(
            await filePromise.readFile(this.path, { encoding: "utf8" })
        );
        } catch (error) {
        if (error.code === "ENOENT") {//Si js arroja el error "Error NO ENTry" then we retunr an empty object.
            return [];
        } else {
            throw error;
        }
        }
    }

    /* 
    Cada producto que gestione debe contar con las propiedades:
    -title (nombre del producto)
    -description (descripción del producto)
    -price (precio)
    -thumbnail (ruta de imagen)
    -code (código identificador)
    -stock (número de piezas disponibles)

    Debe contar con un método "addProduct" el cual agregará un producto al arreglo de productos inicial.
    - Validar que no se repita el campo "code" y que todos los campos sean obligatorios. Al agregarlo, debe crearse con un id autoincrementable 
    */
    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts();
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("All fields are mandatory");
        }
        // Validar que no se repita el campo "code"
        if (products.some((product) => product.code === code)) {
        throw new Error("The product code already exists.");
        }
        // Creating a new product with autoincrement requested
        const newProduct = {
        id: ++ProductManager.idCounter,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        };
        //Validate if I already entered a product, and then push the new one to array
        let existingProducts = await this.getProducts();
        // Add new product
        existingProducts.push(newProduct);
        try {
        // Write the updated array back to the file
        await filePromise.writeFile(
            this.path,
            JSON.stringify(existingProducts, null, 5)
        );
        } catch (error) {
        console.error("Error writing products to file:", error);
        }

        return products;
    }
    /*
    Debe contar con un método "getProductByld" el cual debe buscar en el arreglo el producto que coincida con el id
    ーEn caso de no coincidir ningún id, mostrar en consola un error "Not found"
    */
    async getProductById(id) {
        let products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (product) {
        return product;
        } else {
        return `Product with id: ${id} was not found.`;
        }
    }

    /*
    Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo.
    NO DEBE BORRARSE SU ID
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
            return `El producto con id "${id} se ha actualizado`;
        } catch (error) {
            console.log(`Failed to update product: ${error}`);
        }
        } else {
        console.log(`No product found with ID "${id}"`);
        }
    }

    /*
    Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
    */

    async deleteProduct(id) {
        let products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (product) {
        try {
            // Eliminar el producto con el id dado por parametro
            products = products.filter((product) => product.id !== id);
            filePromise.writeFile(this.path, JSON.stringify(products));
            return `El producto con id "${id} se ha eliminado`;
        } catch (error) {
            console.log(`Error al eliminar el producto: ${error}`);
        }
        } else {
        return `No se ha encontrado el producto con id "${id}"`;
        }
    }                 
}

module.exports = ProductManager;
