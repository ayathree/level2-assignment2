import bcrypt from "bcryptjs"
import { pool } from "../../database/db"

const loginUserIntoDB = async(email:string,password:string)=>{
     const user = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[email])
        const matchPassword = await bcrypt.compare(password,user.rows[0].password);

        if(user.rows.length ===0){
            throw new Error ("User not found!")
        }

        if(!matchPassword){
            throw new Error("Invalid Credentials")
        }
        return user
}

export const authServices={
    loginUserIntoDB
}