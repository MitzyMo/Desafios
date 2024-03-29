import path from "path";
import ProductManager from "../dao/ProductManager"
import { Router } from 'express';
export const router=Router()

let filePath = path.join(__dirname,'..','src', "data", "products.json");

const manager = new ProductManager(filePath);

router.get('/',(request,response)=>{   
    response.json("Landing Page");
    response.setHeader('Content-Type','application/json')
    response.status(200).json({})
})

router.get("/", async(req, res)=>{

    // let limit=req.query.limit

    let {limit, skip, nombre}=req.query

    console.log(skip, nombre)

    let usuarios=await userManager.leerUsuarios()
    if(limit){
        usuarios=usuarios.slice(0, limit)
    }

    res.json(usuarios)

})
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