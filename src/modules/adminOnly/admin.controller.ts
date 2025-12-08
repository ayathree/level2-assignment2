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

// const getSingleUserForAD= async(req:Request,res:Response)=>{
//     // console.log(req.params.id);
//    try {
//     const result =await  adminServices.getSingleUserFromDBForAD(req.params.userId as string)
//     if(result.rows.length===0){
//         res.status(404).json({
//         success:false,
//         message:"user not found",
//         })
//     }
//     else{
//         res.status(200).json({
//              success:true,
//         message:"user fetched successfully",
//         data:result.rows[0]
//         })
//     }
    
//    } catch (error:any) {
//     res.status(500).json({
//         success:false,
//         message:error.message,
//     })
    
//    }
// }

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