import { Request, Response } from "express"
import { vehicleServices } from "./vehicles.service"

const createVehicles = async(req:Request,res:Response)=>{
   try {
     const result =await vehicleServices.createVehicleIntoDB(req.body)
    return res.status(201).json({
        success:true,
        message:"Vehicle created successfully",
        data:result
    })
    
   } catch (error : any) {
    return res.status(400).json({
        success:false,
        message:error.message

    })

    
   }
    

}

const getAllVehicles = async(req:Request,res:Response)=>{
   try {
     const result =await vehicleServices.getAllVehiclesFromDB()
    return res.status(200).json({
        success:true,
        message:"Vehicles retrieved successfully",
        data:result.rows
    })
    
   } catch (error : any) {
    return res.status(400).json({
        success:false,
        message:error.message

    })

    
   }
    

}
export const vehicleControllers={
    createVehicles,getAllVehicles
}