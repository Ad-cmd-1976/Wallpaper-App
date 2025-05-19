import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const url=process.env.MONGO_URL;

export const connectdb=async ()=>{
    try{
        const conn=await mongoose.connect(url);
        console.log("MongoDB Connected Successfully:",conn.connection.host);
    }
    catch(error){
        console.log("Error connecting to MongoDB:",error.message);
    }
}

