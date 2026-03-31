import dotenv from "dotenv";
dotenv.config();

import {Pool} from 'pg';


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Strictly required by Supabase logic 
    }
});


pool.query("SELECT NOW()",(err,res)=>{
    if(err){
        console.error("Supabase Database connection error:", err);
    }
    else{
        console.log("Connected to Supabase PostgreSQL reliably");
    }
})

export default pool;
