import { ticketModel } from "./models/ticketModel.js"

export class TicketManager {

  async createTicket(){
    try {
      const newTicket = await ticketModel.create({});
      return newTicket;
      } catch (error) {
      throw new Error("Error creating cart.");
      }
}

async getAll(){
    return await ticketModel.find().lean()
}
}
