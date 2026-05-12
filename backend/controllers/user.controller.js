import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

//=========================================
// ================== SIGNUP ==============
//=========================================
export const signup = async(req,res)=> {
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res
                    .status(400)
                    .json({message: "All fields required", success:false});
        }

        if(password.length < 6){
            return res
                    .status(400)
                    .json({message: "password must be at least 6 character long", success:false})
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res  
                .status(400)
                .json({message: "User already exists", success:false});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });

        generateToken(user._id,res);
        

        return res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            message: "User Created Successfully",
            success: true
        })

    }catch(err){
        console.log(`error in signup ${err}`)
        res.status(500).json({message: "Internal Server Error"});
    }
}

//=========================================
// ================== LOGIN ===============
//=========================================

export const login = async(req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res
                    .status(400)
                    .json({message: "User not Found",success : false});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res
                    .status(400)
                    .json({message: "Invalid Credentials",success: false});
        }

        generateToken(user._id,res);
        return res.status(200).json({
                _id:user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                message: "User Login Successfully",
                success: true
            })
        
    }catch(err){
        console.log(`error in login ${err}`)
        res.status(500).json({message: "Internal Server Error"});
    }
}

//=========================================
// ================== LOGOUT ==============
//=========================================

export const logout = async(req,res) => {
    try{
        res.cookie("token","",{maxAge:0});
        res.status(200)
            .json({message: "User Logout Successfully",success : true});
            
    }catch(err){
        console.log(`error in logout ${err}`)
        res.status(500).json({message: "Internal Server Error"});
    }
}

//=========================================
// ===============UPDATE PROFILE ==========
//=========================================

export const updateProfile = async(req,res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile Picture is required" ,success :false});
        }

        const result = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic: result.secure_url},{new:true});

        return res.status(201).json({
            updatedUser,
            message: "profile pic updated successfully",
            success:true
        })
    }catch(err){
        console.log(`Error in uploading Profile Pic ${err.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//=========================================
// ===============IS_AUTHENTICATED ========
//=========================================

export const isAuth = async(req,res) => {
    try{
        return req.status(200).json(req.user);
    }catch(err){
        console.log(`Error in isAuth ${err.message}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}