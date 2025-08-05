import mongoose from 'mongoose';

const PurchaseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    imageId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Image",
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    paidAmount:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const PurchaseModel=mongoose.model("Purchase", PurchaseSchema);

export default PurchaseModel;