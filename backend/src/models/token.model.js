import mongoose from "mongoose";

const tokenSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    refreshToken:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:7*24*60*60
    }
});

const TokenModel=mongoose.model("token",tokenSchema);

export default TokenModel;