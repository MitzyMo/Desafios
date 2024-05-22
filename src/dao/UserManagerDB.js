import { userModel } from "./models/UserModel.js"


export class UserManager{

    async create(user){
        let newUser=await userModel.create(user)
        return newUser.toJSON()
    }
    async getBy(filter={}){
        return await userModel.findOne(filter).lean()
    }
    async getByPopulate(filter={}){
        return await userModel.findOne(filter).populate("cart").lean()
    }
}