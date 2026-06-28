import dotenv from "dotenv";
dotenv.config();
import { Pool } from 'pg';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Strictly required by Supabase logic 
    }
});
pool.query("SELECT NOW()", async (err, res) => {
    if (err) {
        console.error("Supabase Database connection error:", err);
    }
    else {
        console.log("Connected to Supabase PostgreSQL reliably");
        try {
            await pool.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Owner',
                ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP DEFAULT NULL;
            `);
            console.log("Database schema migrations for auth columns executed successfully.");
        }
        catch (schemaErr) {
            console.error("Failed running DB schema migrations:", schemaErr.message);
        }
    }
});
export default pool;
//# sourceMappingURL=db.js.map