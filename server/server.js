import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import connectDb from "./config/database.js"
import {authRoute} from "./router/authRouter.js"
import { userRoutes } from "./router/userRouter.js"
import {formRoute}  from "./router/formRoutes.js"

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://form-builder-pi-lime.vercel.app',
  'http://localhost:3000', 
  'http://localhost:5173', 
]


const app=express()
const port=process.env.PORT||4000

app.use(express.json())

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Request origin:', origin) // Debug log
    
    
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};
app.use(cors(corsOptions))
app.use(cookieParser())

connectDb()

app.get("/",(req,res)=>res.send("Api is Working"))

app.use("/api/auth",authRoute)
app.use("/api/user",userRoutes)
app.use("/api/form",formRoute)
app.use("/api/formres",formRoute)


app.listen(port, () => console.log(`Server is running on port ${port}`))
