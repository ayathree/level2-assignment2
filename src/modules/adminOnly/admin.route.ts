import {  Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";




const router =Router()


router.get('/users',auth(Roles.admin), adminController.getAllUser)
router.put("/users/:userId",auth(Roles.admin,Roles.customer), adminController.updateSingleUserByAD)
router.delete("/users/:userId",auth(Roles.admin),adminController.deleteSingleUserByAD)

export const adminRoute = router