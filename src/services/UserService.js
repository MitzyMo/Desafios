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
  async getUsersPaginate(limit = 10, page = 1, role, last_connection, sort) {
    try {
      return await manager.getProductsPaginate(limit, page, role, last_connection, sort);
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
  
      const newDocuments = [];
      if (documents.identification) newDocuments.push({ name: 'identification', reference: documents.identification[0].filename });
      if (documents.proofOfAddress) newDocuments.push({ name: 'proofOfAddress', reference: documents.proofOfAddress[0].filename });
      if (documents.proofOfAccountStatus) newDocuments.push({ name: 'proofOfAccountStatus', reference: documents.proofOfAccountStatus[0].filename });
  
      user.documents.push(...newDocuments);
  
      return await manager.updateUser(uid, user);
    } catch (error) {
      throw new Error("Failed to upload documents");
    }
  },
  async upgradeToPremium(uid) {
    try {
      const user = await manager.getUserById(uid);
      if (!user) throw new Error(`User with id ${uid} was not found.`);
      
      const requiredDocs = ['identification', 'proofOfAddress', 'proofOfAccountStatus'];
      const uploadedDocs = user.documents.map(doc => doc.name);
      
      const hasAllRequiredDocs = requiredDocs.every(docType => uploadedDocs.includes(docType));
      
      if (!hasAllRequiredDocs) {
        throw new Error("Required documents are missing for premium upgrade.");
      }
      
      user.role = 'premium';
      return await manager.updateUser(uid, user);
    } catch (error) {
      throw new Error("Failed to upgrade user to premium");
    }
  },
  async deleteUser(uid) {
    try {
      return await manager.deleteUser(uid);
    } catch (error) {
      throw new Error(`Product with id ${uid} was not found.`);
    }
  },
  async deleteInactiveUsers(cutoffDate) {
    try {
      return await manager.deleteInactiveUsers(cutoffDate);
    } catch (error) {
      throw new Error("Error deleting inactive users");
    }
  }
}
