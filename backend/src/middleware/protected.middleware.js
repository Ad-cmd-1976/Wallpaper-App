import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

export const protectedRoute=async (req, res, next)=>{
    try{
        const accessToken=req.cookies.accessToken;
        if(!accessToken)  return res.status(400).json({ message: "Login to use the services!" });
        try{
            const decoded=jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user=await UserModel.findById(decoded.userId).select("-password");
            if(!user) return res.status(401).json({ message:"User Not Found!"});
            req.user=user;
            return next();
        }
        catch(error){
            if(error.name==="TokenExpiredError") return res.status(401).json({ message:"Please login again from homepage!" });
            throw error;
        }
    }
    catch(error){
        console.log("Error in protectedRoute middleware:",error.message);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}

const storage=multer.memoryStorage();

export const uploadMemory=multer({
    storage,
    limits:{
        fileSize: 60*1024*1024
    }
})

export const checkSubscription=async (req, res, next)=>{
    try{
        const userId=req.user.id;
        const user=await UserModel.findById(userId);

        if((user.subscription==="yes" && user.subscriptionExpiresAt<new Date()) || user.subscription==="no") return next();

        return res.json({
            success:false,
            message:`Your subscription expires At ${user.subscriptionExpiresAt}`
        })
    }
    catch(error){
        console.log("Error in checkSubscription middleware:", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const adminRoute=(req, res, next)=>{
    if(req.user && req.user.role=="admin") return next();
    return res.status(403).json({ message:"Access Denied - Admins Only!" })
}
