import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv";
import path from "path"
import { pool } from "../database/db";

dotenv.config({path: path.join(process.cwd(), ".env")})

const auth = (...roles:string[])=>{
    console.log(roles)
   return async(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
     const token = authHeader.split(" ")[1];
    if(!token){
         return res.status(401).json({
        success:false,
        message:"Unauthorized"
    })
    }
    const jwtSecret=`${process.env.JWT_TOKEN}` as string 
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    
    const user = await pool.query(
        `SELECT * FROM users WHERE id=$1`,[decoded.id]
    );
    if(user.rows.length===0){
          return res.status(404).json({
        success:false,
        message:"User not found"
    })
}
req.user = decoded
if(roles.length && !roles.includes(decoded.role)){
 return res.status(403).json({
        success:false,
        message:"Forbidden"
    })
}
next()
}
}
export default auth