import {  Router } from "express";

import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { bookingController } from "./bookings.controller";





const router =Router()

router.post('/bookings',auth(Roles.admin,Roles.customer),bookingController.createBooking)



export const bookingRoute = router