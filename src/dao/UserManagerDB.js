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
    async update(id, hashPassword) {

      return await usersModel.findByIdAndUpdate(id, {password: hashPassword}, { runValidators: true, returnDocument: "after" })
  }

    async updateRole(id, newRole) {
      return await usersModel.findByIdAndUpdate(id, {role: newRole}, { runValidators: true, returnDocument: "after" })
  }
}