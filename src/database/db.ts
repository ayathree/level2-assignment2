import { Pool } from "pg"
import dotenv from "dotenv";
import path from "path"

dotenv.config({path: path.join(process.cwd(), ".env")})

export const pool = new Pool({
    connectionString:`${process.env.CONNECTION_STR}`   
})
export const initDB=async()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
        `)
        console.log("Database Connected")
}