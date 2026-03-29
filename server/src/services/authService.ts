import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { jwtGenerator } from "../utils/jwtGenerator.js";

// The service layer handles all raw SQL and business logic so the controller stays clean
export const AuthServices = {
    async checkUserExists(email: string) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows.length > 0;
    },

    async register(name: string, email: string, passwordString: string) {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(passwordString, salt);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].id);
        return { user: newUser.rows[0], token };
    },

    async login(email: string, passwordString: string) {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (userResult.rows.length === 0) {
            return null; // User not found
        }
        
        const userRow = userResult.rows[0];
        const validPassword = await bcrypt.compare(passwordString, userRow.password_hash);
        
        if (!validPassword) {
            return null; // Invalid credentials
        }

        const token = jwtGenerator(userRow.id);
        return { user: userRow, token };
    },
    
    async getUserById(userId: string) {
        const result = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = $1", [userId]);
        return result.rows[0] || null;
    }
};
