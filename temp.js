import filePromise from "fs/promises";

class ProductManager {
    static idCounter = 0;
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
        const data = await filePromise.readFile(this.path, { encoding: "utf8" });
        return JSON.parse(data);
        } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        } else {
            console.error("Error reading products:", error);
            throw error;
        }
        }
    }

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

        if (products.some((product) => product.code === code)) {
        throw new Error("The product code already exists.");
        }

        const maxId = products.reduce(
        (max, product) => Math.max(max, product.id),
        0
        );
        const newId = maxId + 1;

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

        products.push(newProduct);

        try {
        await filePromise.writeFile(this.path, JSON.stringify(products, null, 5));
        } catch (error) {
        console.error("Unable to write products into file:", error);
        throw error;
        }

        return newProduct;
    }

    async getProductById(id) {
        let products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (product) {
        return product;
        } else {
        return `Product with id: "${id}" not found.`;
        }
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getProducts();
        const product = products.findIndex((product) => product.id === id);
        if (product !== -1) {
        try {
            products[product] = { ...products[product], ...updatedFields };

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

export { ProductManager };
