import jwt from "jsonwebtoken";

// Token is generated and automatically stored in browser cookie 
//, so you need not to return token but for future 
// lets return token so that it may be use somewhere else if needed 

export const generateToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});

    res.cookie("token",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none":"strict" ,
        secure: process.env.NODE_ENV != "development",
    })
    return token;
};