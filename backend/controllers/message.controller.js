import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"

export const getUsers = async(req,res) => {
    try{
        const loggedUserId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedUserId}}).select("-password")

        return res.status(200).json({filteredUser,success:true});

    }catch(err){

        console.log(`Error in Message Controller -> getUsers ${err.message}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export const getMessages = async(req,res) => {
    try{

        const senderId = req.user._id;
        const {receiverId} = req.params;

        const messages = await Message.find({
            $or:[
                {senderId:senderId,receiverId:receiverId},
                {senderId:receiverId,receiverId:senderId},
            ],
        })

        return res.status(200).json({messages,success:true})

    }catch(err){
        console.log(`Error in Message Controller -> getMessages ${err.message}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export const sendMessage = async(req,res) => {
    try{
        const {text,image} = req.body;
        const {receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const result = await cloudinary.uploader.upload(image);
            imageUrl = result.secure_url;
        }

        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await message.save();

        return res.status(201).json({message,success:true});

    }catch(err){
        console.log(`Error in Message Controller -> sendMessage ${err.message}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}