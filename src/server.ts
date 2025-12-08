import express, { Request, Response } from "express"


import { initDB } from "./database/db";
import { userRoute } from "./modules/users/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { adminRoute } from "./modules/adminOnly/admin.route";
import auth from "./middleware/auth";
import { vehicleRoute } from "./modules/vehicles/vehicles.router";
import { bookingRoute } from "./modules/bookings/bookings.route";


const app = express()
app.use(express.json());



initDB()

app.use('/api/v1/auth',userRoute)
app.use('/api/v1/auth',authRoute)
app.use('/api/v1',adminRoute)
app.use('/api/v1',vehicleRoute)
app.use('/api/v1',bookingRoute)
app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:"this is the root route",
        path:req.path
    })
})
app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})