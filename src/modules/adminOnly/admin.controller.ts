import { Request, Response } from "express"
import { adminServices } from "./admin.service"

const getAllUser = async(req:Request,res:Response)=>{
   try {
     const result =await adminServices.getAllUserFromDB()
    return res.status(200).json({
        success:true,
        message:"Users retrieved successfully",
        data:result.rows
    })
    
   } catch (error : any) {
    return res.status(400).json({
        success:false,
        message:error.message

    })

    
   }
    

}

export const adminController={
    getAllUser
}