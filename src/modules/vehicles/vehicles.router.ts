import {  Router } from "express";
import { vehicleControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";





const router =Router()

router.post('/vehicles',auth(Roles.admin),vehicleControllers.createVehicles)
router.get('/vehicles', vehicleControllers.getAllVehicles)



export const vehicleRoute = router