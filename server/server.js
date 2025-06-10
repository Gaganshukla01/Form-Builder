import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import connectDb from "./config/database.js"
import {authRoute} from "./router/authRouter.js"
import { userRoutes } from "./router/userRouter.js"
import {notesRoute}  from "./router/noteRouter.js"
import {formRoute}  from "./router/formRoutes.js"

// const allowedOrigin=[process.env.FRONTED_URL]
const app=express()
const port=process.env.PORT||4000

app.use(express.json())
app.use(cors({origin:true,credentials:true}))
app.use(cookieParser())

connectDb()
// Api EndPoint
app.get("/",(req,res)=>res.send("Backend is Working"))

app.use("/api/auth",authRoute)
app.use("/api/user",userRoutes)
app.use("/api/notepad",notesRoute)
app.use("/api/form",formRoute)


app.listen(port,()=>console.log(`Server is running in port ${port}`))
