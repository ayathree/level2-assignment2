import { Request, Response } from "express"
import { vehicleServices } from "./vehicles.service"

const createUser = async(req:Request,res:Response)=>{
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

export const vehicleControllers={
    createUser
}