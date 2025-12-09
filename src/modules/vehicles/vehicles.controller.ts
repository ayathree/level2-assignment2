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
     if(result.rows.length===0){
        res.status(200).json({
        success:true,
        message:"No vehicles found",
        data:result.rows
        })
    }
    else{
        res.status(200).json({
             success:true,
        message:"Vehicle retrieved successfully",
        data:result.rows
        })
    }
    
   } catch (error : any) {
    return res.status(400).json({
        success:false,
        message:error.message

    })

    
   }
    

}

const getSingleVehicle= async(req:Request,res:Response)=>{
    
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

const updateSingleVehicle = async(req:Request,res:Response)=>{
    
   
    const {vehicle_name , type , registration_number , daily_rent_price , availability_status}=req.body;
   try {
    const result = await vehicleServices.updateSingleVehicleByAD(vehicle_name , type , registration_number , daily_rent_price , availability_status,req.params.vehicleId as string)
  if(result.rows.length===0){
        res.status(404).json({
        success:false,
        message:"Vehicle not found",
        })
    }
    else{
        res.status(200).json({
             success:true,
        message:"Vehicle updated successfully",
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

const deleteSingleVehicle = async(req:Request,res:Response)=>{
   
   try {
    const result = await vehicleServices.deleteSingleVehicleByAD(req.params.vehicleId as string)
    if(result.rowCount===0){
        res.status(404).json({
        success:false,
        message:"Vehicle not found",
        })
    }
    else{
        res.status(200).json({
             success:true,
        message:"Vehicle deleted successfully",
        
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
    createVehicles,getAllVehicles,getSingleVehicle,updateSingleVehicle,deleteSingleVehicle
}