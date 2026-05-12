import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to database`);
    }catch(err){
        console.log(`Error in connecting to database: ${err}`);
    }
}