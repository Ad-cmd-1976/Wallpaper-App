import UserModel from '../models/user.model.js';
import TokenModel from '../models/token.model.js';
import bcrypt from 'bcrypt';
import { generateTokens, setCookies, storeRefreshToken } from '../lib/helper.js';


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
        const isPasswordEqual=await bcrypt.compare(password,user.password);
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
        const token=req.cookies.refreshToken;
        if(!token) return res.status(400).json({ message: "No refresh token found" });
        try{
            const decoded=jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
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
