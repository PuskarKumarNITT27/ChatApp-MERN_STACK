import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const isAuthenticated = async(req,res,next) => {
    try{

        const token = req.cookie.token;

        if(!token){
            return res.status(401).json({message:"Unauthorized, No token Available"});
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        if(!decode){
            return res.status(401).json({message: "Unauthorized , Invalid Token"});
        }

        const user = await User.findById(decode.userId);

        if(!user){
            return res.status(401).json({message:"User Not Found"});
        }

        req.user = user;

        next();
        
    }catch(err){
        console.log(`Error in middleware : ${err.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}