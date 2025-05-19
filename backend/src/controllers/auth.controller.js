import UserModel from '../models/user.model.js';
import TokenModel from '../models/token.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateTokens=(userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
    const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});
    return {accessToken,refreshToken};
}

const storeRefreshToken=async (userId,refreshToken)=>{
    await TokenModel.create({userId:userId,refreshToken:refreshToken});
}

const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:15*60*60*1000
    });
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })
}

export const signup=async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        // Check the data from frontend
        if(!name || !email || !password){
            return res.status(401).json({message:"All Fields are required!"});
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        if(password.length<6){
            return res.status(401).json({message:"Password should be atleast 6 characters long!"});
        }


        // Verify if the user already exists in database
        const user=await UserModel.findOne({email});
        if(user){
            return res.status(400).json({message:'User Already Exists',success:false});
        }

        //Create new user and hash the password using bcrypt
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
        });
    }catch(error){
        console.log("Error in signUp controller:",error.response.data.error);
        res.status(500).json({message:'Internal Server Error',success:false});
    }
}
export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password) return res.status(400).json({message:"All fields Required!"});

        const user=await UserModel.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid User Credentials!"});
        const isPasswordEqual=await bcrypt.compare(password,user.password);
        if(!isPasswordEqual) return res.status(400).json({message:"Invalid User Credentials!"});

        const {accessToken,refreshToken}=generateTokens(user._id);
        storeRefreshToken(user._id,refreshToken);
        setCookies(res,accessToken,refreshToken);

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            subscription:user.subscription
        })
    }
    catch(error){
        console.log("Error in login controller",error.message);
        return res.status(500).json({message:"Internal Server Error!"});
    }
}

export const logout=async (req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        if(refreshToken){
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await TokenModel.findOneAndDelete({userId:decoded.userId});
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
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
