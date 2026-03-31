import pool from "../config/db.js";
export const ItemServices = {
    async createItem(userId, name, description, defaultPrice, imageUrl = null) {
        const newItem = await pool.query("INSERT INTO items (user_id, name, description, default_price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *", [userId, name, description, defaultPrice, imageUrl]);
        return newItem.rows[0];
    },
    async getItemsByUser(userId) {
        const items = await pool.query("SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
        return items.rows;
    },
    async updateItem(itemId, userId, name, description, defaultPrice, imageUrl = null) {
        let query = "UPDATE items SET name = $1, description = $2, default_price = $3";
        const values = [name, description, defaultPrice];
        if (imageUrl !== null && imageUrl !== undefined) {
            values.push(imageUrl);
            query += `, image_url = $${values.length}`;
        }
        values.push(itemId, userId);
        query += ` WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`;
        const updatedItem = await pool.query(query, values);
        return updatedItem.rows[0] || null;
    },
    async deleteItem(itemId, userId) {
        const deleteOp = await pool.query("DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *", [itemId, userId]);
        return deleteOp.rows.length > 0;
    }
};
//# sourceMappingURL=itemService.js.map