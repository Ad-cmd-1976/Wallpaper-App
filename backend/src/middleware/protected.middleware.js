import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const protectedRoute=async (req, res, next)=>{
    try{
        const accessToken=req.cookies.accessToken;
        if(!accessToken)  return res.status(400).json({ message: "Unauthorised access token not found!" });
        try{
            const decoded=jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user=await UserModel.findById(decoded.userId).select("-password");
            if(!user) return res.status(401).json({ message:"User Not Found!"});
            req.user=user;
            return next();
        }
        catch(error){
            if(error.name==="TokenExpiredError") return res.status(401).json({ message:"Unauthorised access Token expired!" });
            throw error;
        }
    }
    catch(error){
        console.log("Error in protectedRoute middleware:",error.message);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const adminRoute=(req, res, next)=>{
    if(req.user && req.user.role=="admin") return next();
    return res.status(403).json({ message:"Access Denied - Admins Only!" })
}
