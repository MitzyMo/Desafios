import mongoose from "mongoose";
import {
	userModel
} from "./models/UserModel.js"

export class UserManager {

	async getUsers(limit) {
		try {
			let data = await userModel.find().limit(Number(limit));
			let totalUsers = await userModel.countDocuments();
			return {
				totalUsers,
				data
			};
		} catch (error) {
			throw new Error("Internal Server Error");
		}
	}
	async create(user) {
		let newUser = await userModel.create(user)
		return newUser.toJSON()
	}
    async getUserById(uid) {
        try {
            const user = await userModel.findById(uid);
            return user;
          } catch (error) {
            throw new Error(`User with id ${uid} was not found.`);
          }
    }
	async getBy(filter = {}) {
		return await userModel.findOne(filter).lean()
	}
	async getByPopulate(filter = {}) {
		return await userModel.findOne(filter).populate("cart").lean()
	}
	async update(id, hashPassword) {
		return await userModel.findByIdAndUpdate(id, {
			password: hashPassword
		}, {
			runValidators: true,
			returnDocument: "after"
		})
	}
  async updateUser(uid, updatedUser) {
    try {
      const upUser = await userModel.findByIdAndUpdate(
        uid,
        { ...updatedUser },
        { new: true }
      );
      return upUser;
    } catch (error) {
      throw new Error(`Product with id ${uid} was not found.`);
    }
  }
}