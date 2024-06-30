import { ticketModel } from "./models/ticketModel.js";

export class TicketManager {
    async createTicket(ticketData) {
        try {
            const newTicket = await ticketModel.create(ticketData);
            return newTicket;
        } catch (error) {
            throw new Error("Error creating ticket.");
        }
    }

    async getAll() {
        return await ticketModel.find().lean();
    }
}
