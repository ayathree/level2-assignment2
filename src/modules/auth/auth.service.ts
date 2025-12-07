import bcrypt from "bcryptjs"
import { pool } from "../../database/db"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import path from "path"

dotenv.config({path: path.join(process.cwd(), ".env")})

const loginUserIntoDB = async(email:string,password:string)=>{
     const userResult = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[email])
        const matchPassword = await bcrypt.compare(password,userResult.rows[0].password);

        if(userResult.rows.length === 0){
            throw new Error ("User not found!")
        }

        const user = userResult.rows[0];

        if(!matchPassword){
            throw new Error("Invalid Credentials")
        }

        const jwtPayload ={
            id: user.id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role
        }
       const jwtSecret=`${process.env.JWT_TOKEN}`
        
        const token = jwt.sign(jwtPayload,jwtSecret,{expiresIn:'7d'});
        const { 
               password: _password, 
               created_at: _created, 
               updated_at: _updated, 
               ...userWithoutPassword 
             } = user;
        return {token,user:userWithoutPassword}
}

export const authServices={
    loginUserIntoDB
}