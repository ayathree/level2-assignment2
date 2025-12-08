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

const getSingleVehicle= async(req:Request,res:Response)=>{
    // console.log(req.params.id);
   try {
    const result =await  vehicleServices.getSingleVehiclesFromDBForAD(req.params.vehicleId as string)
    if(result.rows.length===0){
        res.status(404).json({
        success:false,
        message:"Vehicle not found",
        })
    }
    else{
        res.status(200).json({
             success:true,
        message:"Vehicle retrieved successfully",
        data:result.rows[0]
        })
    }
    
   } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message,
    })
    
   }
}
export const vehicleControllers={
    createVehicles,getAllVehicles,getSingleVehicle
}