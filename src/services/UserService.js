import { UserManager } from "../dao/UserManagerDB.js";
const manager = new UserManager();

export const UserService = {
    async createUser() {
        try {
            const user = await manager.create();
            return user;
        } catch (error) {
            throw error;
        }
    },
    async getUserById(id) {
        return manager.getBy({id})
    },
    async verifyEmail (email) {
        return manager.getBy({email})
    },
    async updatePassword (id, hashedPassword) {
        console.log("New Pwd:" + hashedPassword)
        return manager.update(id, hashedPassword)
    },
    async updateRole (id, nuevoRole) {
        return manager.updateRole(id, nuevoRole)
    }
}