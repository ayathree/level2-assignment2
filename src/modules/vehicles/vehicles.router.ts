import {  Router } from "express";
import { vehicleControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";





const router =Router()

router.post('/vehicles',auth(Roles.admin),vehicleControllers.createVehicles)
router.get('/vehicles', vehicleControllers.getAllVehicles)
router.get('/vehicles/:vehicleId', vehicleControllers.getSingleVehicle)
router.put('/vehicles/:vehicleId',auth(Roles.admin), vehicleControllers.updateSingleVehicle)
router.delete('/vehicles/:vehicleId',auth(Roles.admin),vehicleControllers.deleteSingleVehicle)



export const vehicleRoute = router