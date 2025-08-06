import PurchaseModel from '../models/purchase.model.js';
import ImageModel from '../models/image.model.js';

export const createPurchase=async (req,res)=>{
    try{
        const userId=req.user._id;
        const { imageId }=req.params;
        const image=await ImageModel.findById(imageId);
        if(!image || !image.isPremium) return res.status(400).json({ message:"Plus Image Not Found! "});

        const alreadyPurchased=await PurchaseModel.findOne({ userId, imageId });
        if(alreadyPurchased) return res.status(200).json({ message:"Image is already purchased!" });

        const isPlus=req.user.subscription=='yes';
        const discount=isPlus?(image.discountPercentage)/100 : 0;
        const paidAmount=image.price-image.price*discount;
        const newPurchase=await PurchaseModel.create({
            userId,
            imageId,
            paidAmount,
            paymentId:'MOCK_PAYMENT'+Date.now
        })

        return res.status(201).json({
            message:"Payment Successfull",
            downloadReady:true,
            imageId:newPurchase.imageId
        });
    }
    catch(error){
        res.status(500).json({ message:"Internal Server Error!" });
        console.log("Error in createPurchase function in image controller",error);
    }
}
export const getPurchasedList=async (req,res)=>{
    try{
        const userId=req.user._id;
        
        const purchases=await PurchaseModel.find({ userId }).select("imageId");
        const purchaseIds=purchases.map((purchase)=>purchase.imageId.toString());

        return res.status(200).json({ purchaseIds });
    }
    catch(error){
        console.log("Error in getPurchasedList function in purchase controller",error);
        return res.status(500).json({ message:"Internal Server Error" });
    }
}