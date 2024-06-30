import { TicketManager } from "../dao/TicketManagerDB.js";

const manager = new TicketManager();

export const TicketService = {
    async createTicket(ticketData) {
        try {
            const ticket = await manager.createTicket(ticketData);
            return ticket;
        } catch (error) {
            throw error;
        }
    },
    async getAll() {
        try {
            const tickets = await manager.getAll();
            return tickets;
        } catch (error) {
            throw error;
        }
    },
};
