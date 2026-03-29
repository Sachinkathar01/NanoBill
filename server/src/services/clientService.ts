import pool from "../config/db.js";

export const ClientServices = {
    async createClient(userId: string, name: string, email: string, phone: string, address: string) {
        const newClient = await pool.query(
            "INSERT INTO clients (user_id, name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, name, email, phone, address]
        );
        return newClient.rows[0];
    },

    async getClientsByUser(userId: string) {
        const clients = await pool.query("SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
        return clients.rows;
    },

    async updateClient(clientId: string, userId: string, name: string, email: string, phone: string, address: string) {
        const updatedClient = await pool.query(
            "UPDATE clients SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
            [name, email, phone, address, clientId, userId]
        );
        return updatedClient.rows[0] || null;
    },

    async deleteClient(clientId: string, userId: string) {
        const deleteOp = await pool.query("DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING *", [clientId, userId]);
        return deleteOp.rows.length > 0;
    }
};
