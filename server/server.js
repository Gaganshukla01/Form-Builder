import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import connectDb from "./config/database.js"
import {authRoute} from "./router/authRouter.js"
import { userRoutes } from "./router/userRouter.js"
import {notesRoute}  from "./router/noteRouter.js"
import {formRoute}  from "./router/formRoutes.js"

// Fixed: Changed FRONTED_URL to FRONTEND_URL (assuming env variable name)
// and allowedOrigin to allowedOrigins (plural)
const allowedOrigins = [process.env.FRONTEND_URL]

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

const corsOptions = {
  origin: function (origin, callback) {
    // Fixed: Using allowedOrigins instead of allowedOrigin
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Apply CORS middleware with options
app.use(cors(corsOptions))
app.use(cookieParser())

connectDb()

// Api EndPoint
app.get("/", (req, res) => res.send("Backend is Working"))
app.use("/api/auth", authRoute)
app.use("/api/user", userRoutes)
app.use("/api/notepad", notesRoute)
app.use("/api/form", formRoute)

app.listen(port, () => console.log(`Server is running on port ${port}`))
