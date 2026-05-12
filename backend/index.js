import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import { connectDB } from "./config/db.js"
import userRoutes from "./routes/user.routes.js"
import messageRoutes from "./routes/message.routes.js"
import dotenv from "dotenv"
dotenv.config()


connectDB()

const app = express()
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// API ENDPOINTS    
app.get("/",(req,res) =>{
    res.send("hello from server");
})

app.use("/api/user",userRoutes);
app.use("/api/messages",messageRoutes);

app.listen(PORT,()=>{
    console.log()
})