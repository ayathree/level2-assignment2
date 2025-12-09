import { Request, Response } from "express";

import { userServices } from "./user.service";


const createUser = async(req:Request,res:Response)=>{
   try {
     const result =await userServices.createUserIntoDB(req.body)
    return res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:result
    })
    
   } catch (error : any) {
    return res.status(400).json({
        success:false,
        message:error.message

    })

    
   }
    

}




export const userController={
    createUser
}