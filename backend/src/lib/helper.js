import jwt from 'jsonwebtoken';
import TokenModel from '../models/token.model.js';
import dotenv from 'dotenv';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from './aws.js';

dotenv.config();

export const generateTokens=(userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
    const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});
    return {accessToken,refreshToken};
}

export const storeRefreshToken=async (userId,refreshToken)=>{
    await TokenModel.create({userId:userId,refreshToken:refreshToken});
}

export const setCookies=(res,accessToken,refreshToken)=>{
    const isProduction=process.env.NODE_ENV==="production";
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure: isProduction,
        sameSite: isProduction ? "None": "Lax",
        path:"/",
        maxAge:15*60*1000
    });
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction ? "None": "Lax",
        path:"/",
        maxAge:7*24*60*60*1000
    });
}

export const deleteFromS3=async (key)=>{
    const command=new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    });

    await s3.send(command);
}