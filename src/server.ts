import express, { Request, Response } from "express"


import { initDB } from "./database/db";
import { userRoute } from "./modules/users/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { adminRoute } from "./modules/adminOnly/admin.route";
import auth from "./middleware/auth";


const app = express()
app.use(express.json());



initDB()

app.use('/api/v1/auth',userRoute)
app.use('/api/v1/auth',authRoute)
app.use('/api/v1', auth(),adminRoute)

app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:"this is the root route",
        path:req.path
    })
})
app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})