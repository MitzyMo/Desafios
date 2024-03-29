//const path = require("path");
const express = require("express");
//const ProductManager = require("./dao/ProductManager");
//let filePath = path.join(__dirname,'..','src', "data", "products.json");
const {router:ProductManager } = require("./routes/productsRouter");
//import {router as CartManager} from "./routes/cartsRouter.js"
//declarar el puerto
const PORT = 3000;
//inicializar en app con express
const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/products", ProductManager)
//app.use("/api/cart", CartManager)

app.get('/',(request,response)=>{   
    response.json("Landing Page");
    response.setHeader('Content-Type','application/json')
    response.status(200).json({Status: "Ok"})})

//escuchar el servidor de acuerdo al puerto elegido
app.listen(PORT, error => {
    if (error) {
        console.error('Failed to start the server:', error);
        return;
    }
    console.log(`Server connected in port ${PORT}`);
});



/* 
//Traer clase manager
const manager = new ProductManager(filePath);
//Define urls
app.get('/',(request,response)=>{   
    response.json("Landing Page");
    response.setHeader('Content-Type','application/json')
    response.status(200).json({Status: "Ok"})})
//Devuelve todos los productos.
app.get("/products", async(request, response) => {
    let data = await manager.getProducts();
    let limit=request.query.limit
    if(Number(limit)&&limit>0){
        data=data.slice(0, limit);
    }
    response.json(data);
});
//Devuelve un producto segun su id.
app.get("/products/:pid", async (request, response) => {
    let pid = request.params.pid;
    pid = Number(pid);
    if (isNaN(pid)) {
        return response.json({ error: "Enter a valid number as ID" });
    } else {
        try {
            const product = await manager.getProductById(pid);
            response.json(product); // Send the product back to the client
        } catch (error) {
            response.status(404).json({ error: `Product with id ${pid} was not found.` });
        }
    }
}); 
*/
