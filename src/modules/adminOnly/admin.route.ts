import {  Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";




const router =Router()


router.get('/users',auth(Roles.admin), adminController.getAllUser)

export const adminRoute = router