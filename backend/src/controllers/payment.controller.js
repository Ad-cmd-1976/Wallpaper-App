import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import ImageModel from '../models/image.model.js';
import crypto from 'crypto';
import PurchaseModel from '../models/purchase.model.js';
import UserModel from '../models/user.model.js';

dotenv.config();

const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
});

export const createPlusUser=async (req,res)=>{
    try{
        const user=req.user;
        const options={
            amount: 1000,
            currency: "INR",
            receipt: `receipt_id_${user._id}`
        }

        const newOrder=await razorpay.orders.create(options);

        res.json({
            amount: options.amount,
            currency: options.currency,
            key: process.env.RAZORPAY_KEY_ID,
            orderId: newOrder.id,
            success:true
        })
    }
    catch(error){
        console.log("Error in createPlusUser function of payment controller", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const verifyPlusUser=async (req,res)=>{
    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body;


        const body=razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature=crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

        if(expectedSignature!==razorpay_signature) return res.status(400).json({ message:"Invalid Signature!" });

        await UserModel.findByIdAndUpdate(req.user._id, { subscription: "yes" });

        return res.status(200).json({ message:"Welcome V.I.P!", success: true });
    }
    catch(error){
        console.log("Error in verifyPlusUser function of payment controller!", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const createOrder=async (req,res)=>{
    try{
        const user=req.user;
        const { imageId }=req.params;

        const image=await ImageModel.findById(imageId);
        if(!image || !image.isPremium) return res.status(404).json({ message:"Premium Image Not Found!" });

        const isPlus=user.subscription=="yes";
        const discount=isPlus ? image.discountPercentage/100 : 0;
        const total=Math.round(image.price-image.price*discount);

        const options={
            amount:total*100,
            currency:"INR",
            receipt:`receipt_order_${Date.now()}`
        }

        const order=await razorpay.orders.create(options);

        res.status(200).json({
            success:"true",
            amount:options.amount,
            currency:options.currency,
            orderId:order.id,
            imageId:imageId,
            key: process.env.RAZORPAY_KEY_ID
        })
    }
    catch(error){
        console.log("Error in createOrder function of payment controller", error);
        res.status(500).json({ message:"Internal Server Error" });
    }
}

export const verifyPayment=async (req,res)=>{
    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, imageId }=req.body;

        const userId=req.user._id;

        const body=razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature=crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

        if(expectedSignature!==razorpay_signature) return res.status(400).json({ message:"Invalid Signature" }); 

        const newPurchase=await PurchaseModel.create({
           userId,
           imageId,
           paidAmount: parseInt(req.body.amount)/100,
           paymentId: razorpay_payment_id 
        });

        res.status(200).json({
            message: "Purchase Successfull & Download Unlocked",
            downloadReady: true,
            imageId: newPurchase.imageId
        })
    }
    catch(error){
        console.log("Error in verifyPayment function of payment controller!", error);
        res.status(500).json({ message:"Internal Sever Error" });
    }
}