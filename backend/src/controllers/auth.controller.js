import UserModel from '../models/user.model.js';
import TokenModel from '../models/token.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { generateTokens, setCookies, storeRefreshToken } from '../lib/helper.js';
import sendEmail from '../lib/sendEmail.js';


export const signup=async (req,res)=>{
    try{
        const {name,email,password}=req.body;


        if(!name || !email || !password){
            return res.status(401).json({message:"All Fields are required!"});
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        if(password.length<6){
            return res.status(401).json({message:"Password should be atleast 6 characters long!"});
        }
        
        
        
        const user=await UserModel.findOne({email});
        if(user){
            return res.status(400).json({message:'User Already Exists',success:false});
        }
        
        
        const newUser=new UserModel({name,email,password});
        const salt=await bcrypt.genSalt(10);
        newUser.password=await bcrypt.hash(password,salt);
        await newUser.save();
        
        const {accessToken,refreshToken}=generateTokens(newUser._id);
        await storeRefreshToken(newUser._id,refreshToken);
        setCookies(res,accessToken,refreshToken);
        
        
        res.status(201).json({
            _id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            subscription:newUser.subscription,
            role:newUser.role
        });
    }
    catch(error){
        console.log("Error in signUp controller:",error);
        res.status(500).json({message:'Internal Server Error',success:false});
    }
}

export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        
        if(!email || !password) return res.status(400).json({ message:"All fields Required!" });
        
        const user=await UserModel.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid User Credentials!"});
        const isPasswordEqual=bcrypt.compare(password,user.password);
        if(!isPasswordEqual) return res.status(400).json({ message:"Invalid User Credentials!" });
        
        const {accessToken,refreshToken}=generateTokens(user._id);
        storeRefreshToken(user._id,refreshToken);
        setCookies(res,accessToken,refreshToken);
        
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            subscription:user.subscription,
            role:user.role
        })
    }
    catch(error){
        console.log("Error in login controller",error.message);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const logout=async (req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        if(refreshToken){
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await TokenModel.findOneAndDelete({ userId:decoded.userId });
        }
        res.clearCookie("accessToken",{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            path: "/"
        });
        res.clearCookie("refreshToken", {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            path: "/"
        });
        res.status(201).json({ message:"Logged Out Successfully!" });
    }
    catch(error){
        console.log("Error in logout controller:",error.response);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const getProfile=(req,res)=>{
    try{
        res.json(req.user);
    }
    catch(error){
        console.log("Error in getProfile controller:",error.message);
        return res.status(500).json({ message:"internal Server Error!" });
    }
}

export const refreshToken=async (req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken) return res.status(400).json({ message: "Login to use services" });
        let decoded;
        try{
            decoded=jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        catch(error){
            if(error.name==="TokenExpiredError") return res.status(403).json({ message:"Invalid or expired refresh token!" });
        }
        const storedToken=await TokenModel.findOne({ userId: decoded.userId, refreshToken: refreshToken});
        if(!storedToken) return res.status(404).json({ message: "Refresh Token Not Found" });
        
        const { accessToken, refreshToken: newRefreshToken }=generateTokens(decoded.userId);
        setCookies(res, accessToken, newRefreshToken);
        
        await TokenModel.findOneAndUpdate({ 
            userId: decoded.userId, refreshToken: refreshToken 
        },{ refreshToken: newRefreshToken});
        
        return res.json({ message: "Refresh Success!" });
    }
    catch(error){
        console.log("Error in refreshToken function of auth controller:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const forgetPassword=async (req,res)=>{
    try{
        const { email }=req.body;
        
        if(!email) return res.status(401).json({ message:"Email is required!" });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        
        const user=await UserModel.findOne({ email });
        if(!user) return res.status(200).json({ message: "If email exists, reset link is sent to it" });
        
        const resetToken=crypto.randomBytes(32).toString('hex');
        
        const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex");
        
        await UserModel.findOneAndUpdate({ email }, { resetPasswordToken: hashedToken, resetPasswordExpire: Date.now()+10*60*1000 });
        
        const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        console.log("➡️ Forget password request received");
        await sendEmail({
            to: user.email,
            subject: "Freepixz Account Password Reset",
            html:`
            <p>You Requeted a Password Reset</p>
            <p>Click the link below (valid for 10 minutes):</p>
            <a href="${resetUrl}">${resetUrl}</a>
            `
        });
        
        console.log("✅ Email sent successfully");
        
        res.status(200).json({
            message: "Reset Link Sent to Email"
        });
    }    
    catch(error){
        console.log("Error in forgetPassword function of auth controller:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const resetPassword=async (req,res)=>{
    try{
        const { token }=req.params;
        const { password }=req.body;
        
        if(password.length<6){
            return res.status(401).json({message:"Password should be atleast 6 characters long!"});
        }
        
        const hashed=crypto.createHash("sha256").update(token).digest("hex");
        
        const user=await UserModel.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });
        
        if(!user) return res.status(400).json({ message: "Invalid or Expired Token" });
        
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        const email=user.email;
        await UserModel.findOneAndUpdate({ email }, user );
        
        res.status(200).json({ message: "Password Reset Successfull! Please Login" });
    }
    catch(error){
        console.log("Error in resetPassword function of auth controller:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}