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


const updateSingleUserByAD = async(req:Request,res:Response)=>{
    
     const { userId } = req.params;
    const {name,email,phone,role}=req.body;
   try {
    const result = await adminServices.updateUser(name, email, phone, role, userId as string, req.user)
  return res.status(result.status).json(result.response);
    
   } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message,
    })
    
   }
}

const deleteSingleUserByAD = async(req:Request,res:Response)=>{
   
   try {
    const result = await adminServices.deleteUserByAD(req.params.userId as string)
    if(result.rowCount===0){
        res.status(404).json({
        success:false,
        message:"User not found",
        })
    }
    else{
        res.status(200).json({
             success:true,
        message:"User deleted successfully",
        
        })
    }
    
   } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message,
    })
    
   }
}

export const adminController={
    getAllUser,updateSingleUserByAD,deleteSingleUserByAD
}