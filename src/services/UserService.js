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
  async createUser(user) {
    try {
      const existingUser = await this.verifyEmail(user.email);
      if (existingUser) {
        throw new Error("Email already in use");
      }
      const newUser = await manager.create(user);
      return newUser;
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
    return manager.getBy({ id });
  },
  async verifyEmail(email) {
    return manager.getBy({ email });
  },
  async updatePassword(id, hashedPassword) {
    console.log("New Pwd:" + hashedPassword);
    return manager.update(id, hashedPassword);
  },
  async updateUser(uid, updatedUser) {
    try {
      return await manager.updateUser(uid, updatedUser);
    } catch (error) {
      throw new Error(`User with id ${uid} was not found.`);
    }
  },
  async uploadDocuments(uid, documents) {
    try {
      const user = await manager.getUserById(uid);
      if (!user) throw new Error(`User with id ${uid} was not found.`);

      const updatedFields = {};
      if (documents.identification) updatedFields.identification = documents.identification[0].filename;
      if (documents.proofOfAddress) updatedFields.proofOfAddress = documents.proofOfAddress[0].filename;
      if (documents.proofOfAccountStatus) updatedFields.proofOfAccountStatus = documents.proofOfAccountStatus[0].filename;

      return await manager.updateUser(uid, { ...user, ...updatedFields });
    } catch (error) {
      throw new Error("Failed to upload documents");
    }
  },
  async upgradeToPremium(uid) {
    try {
      const user = await manager.getUserById(uid);
      if (!user) throw new Error(`User with id ${uid} was not found.`);
      if (!user.identification || !user.proofOfAddress || !user.proofOfAccountStatus) {
        throw new Error("Required documents are missing for premium upgrade.");
      }
      user.role = 'premium';
      return await manager.updateUser(uid, user);
    } catch (error) {
      throw new Error("Failed to upgrade user to premium");
    }
  }
}
