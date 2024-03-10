//Realizar una clase "ProductManager" que gestione un conjunto de productos.
class ProductManager {
    static idCounter = 0;
    
//Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
    constructor() {
        this.products = [];
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
addProduct(title, description, price, thumbnail, code, stock) {
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("All fields are mandatory");
        return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(product => product.code === code)) {
        console.error("The product code already exists.");
        return;
    }
    // Creating a new product with autoincrement
    const newProduct = {
        id: ++ProductManager.idCounter,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    };
    // Simply adding the previous product to the array.
    this.products.push(newProduct);
}

/*
Debe contar con un método "getProducts" el cual debe devolver el arreglo con todos los productos creados hasta ese momento
*/
getProducts() {
    return this.products;
}
/*
Debe contar con un método "getProductByld" el cual debe buscar en el arreglo el producto que coincida con el id
ーEn caso de no coincidir ningún id, mostrar en consola un error "Not found"
 */
getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
        return product;
    } else {
        return `Product with id: ${id} was not found.`;
    }
}

}

module.exports = ProductManager;