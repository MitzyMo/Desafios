import { TicketManager } from "../dao/TicketManagerDB.js"

const manager = new TicketManager();

export const TicketService = {
  async createTicket() {
      try {
          const ticket = await manager.createTicket();
          return ticket;
      } catch (error) {
          throw error;
      }
  },
  async getAll() {
    try {
        const ticket = await manager.getAll();
        return ticket;
    } catch (error) {
        throw error;
    }
},
};