import { UserManager } from "../dao/UserManagerDB.js";
const manager = new UserManager();

export const UserService = {
    async getUsers(limit) {
        try {
            return await manager.getUsers(limit);
            } catch (error) {
            throw new Error("Internal Server Error");
            }
        },
    async createUser() {
        try {
            const user = await manager.create();
            return user;
        } catch (error) {
            throw error;
        }
    },
    async getUserById(uid) {
        try {
            return await manager.getUserById(uid);
          } catch (error) {
            throw new Error(`User with id ${uid} was not found.`);
          }
    },
    async getUserBy(id) {
        return manager.getBy({id})
    },
    async verifyEmail (email) {
        return manager.getBy({email})
    },
    async updatePassword (id, hashedPassword) {
        console.log("New Pwd:" + hashedPassword)
        return manager.update(id, hashedPassword)
    },
    async updateUser(uid, updatedUser) {
        try {
          return await manager.updateUser(uid, updatedUser);
        } catch (error) {
          throw new Error(`Product with id ${uid} was not found.`);
        }
      }
}