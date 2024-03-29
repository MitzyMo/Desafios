const path = require("path");
const ProductManager = require("../src/dao/ProductManager");
let filePath = path.join(__dirname,'..','src', "data", "products.json");
import express from 'express';
export const router = express.Router();

const manager = new ProductManager(filePath);

//Devuelve todos los productos.
router.get("/", async(request, response) => {
    let data = await manager.getProducts();
    let limit=request.query.limit
    if(Number(limit)&&limit>0){
        data=data.slice(0, limit);
    }
    response.json(data);
});
//Devuelve un producto segun su id.
router.get("/:pid", async (request, response) => {
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
//Additional Methods

/* The root path POST / should add a new product with the fields:
- id: Number/String (Your choice, the id is NOT sent from body, it is auto generated as we have seen from the first deliverables, ensuring that you will NEVER repeat ids in the file.
- title:String,
- description:String
- code:String
- price:Number
- status:Boolean*
- stock:Number
- category:String
- thumbnails: Array of Strings containing the paths where the images referring to that product are stored.
*Status is true by default.
*All fields are required, except for thumbnails.

Translated with DeepL.com (free version)
*/
router.post('',async (request,response)=>{
const product=await manager.addProduct(request.body);
response.status(201).json(product);
})

router.put('/:id',async (request,response)=>{
    const uproduct=await manager.updateProduct(request.params.id, request.body)
    response.json(uproduct)
})

router.delete('/:id',async (request,response)=>{
    const dproduct=await manager.deleteProduct(request.params.id)
    response.json(dproduct)
})


