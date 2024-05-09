import { cartModel } from "./models/cartModel.js";


export class CartManager {
    async getOneById(filtro={}){
        return await cartModel.findOne(filtro).lean()
    }
}