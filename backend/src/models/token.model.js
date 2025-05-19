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

const TokenModel=new mongoose.model("refresh-token",tokenSchema);

export default TokenModel;