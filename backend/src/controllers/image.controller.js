import https from 'https';
import s3 from '../lib/aws.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import ImageModel from '../models/image.model.js';
import PurchaseModel from '../models/purchase.model.js';
import { deleteFromS3 } from '../lib/helper.js';

export const getImages=async (req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;

        const images=await ImageModel.find({}, { imageUrl:0 }).sort({ createdAt:-1 }).skip(skip).limit(limit);
        const total=await ImageModel.countDocuments();
        
        return res.json({
            images,
            total,
            page,
            totalPages:Math.ceil(total/limit)
        })
    }
    catch(error){
        res.status(500).json({ message:'Internal Server Error!' });
        console.log("Error in image controller getImages function", error.message);
    }
}

export const searchImages=async (req,res)=>{
    try{
        const searchQuery=req.query.q?.trim();
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;
        
        if(!searchQuery) return res.status(400).json({ message:"Search Expression is Required!" });
        
        const words=searchQuery.split(/\s+/).filter(Boolean);
        const regexes=words.map(word=>new RegExp(word,'i'));
        
        const images=await ImageModel.find({
            $or:[
                { title: { $in: regexes }},
                { tags: { $in: regexes }}
            ]
        }, { imageUrl:0 }).sort({ createdAt:-1 }).skip(skip).limit(limit);
        
        const total=await ImageModel.countDocuments();
        
        res.status(200).json({ 
            resources:images,
            page,
            total,
            totalPages:Math.ceil(total/limit)
        });
    }
    catch(error){
        res.status(500).json({ message:'Internal Server Error!' });
        console.log("Error in image controller searchImages function",error.message);
    }
}

export const getImageData=async (req,res)=>{
    try{
        const { id }=req.params;
        const imageData=await ImageModel.findById(id);
        res.status(200).json({
            title: imageData.title,
            price: imageData.price,
            tags: imageData.tags,
            discountPercentage: imageData.discountPercentage,
            isPremium: imageData.isPremium
        });
    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error!" });
        console.log("Error in getImageData function of image controller", error.message);
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

export const downloadImage = async (req, res) => {
    try{
        const publicId=req.query.publicId;

        const image=await ImageModel.findOne({ publicId });

        if(!image) return res.status(404).json({ message:"Image Not Found!" });

        https.get(image.imageUrl, (imageRes) => {
            res.setHeader('Content-disposition', `attachment; filename="${publicId}.jpg"`);
            res.setHeader('Content-Type', 'image/jpeg');

            imageRes.pipe(res);

            imageRes.on('error', (err) => {
                console.error('Aws stream error', err.message);
                if(!res.headersSent) {
                    res.status(500).json({ message: "Failed to stream image" });
                } 
                else{
                    res.end(); 
                }
            });

        }).on('error', (err) => {
            console.error('HTTPS GET error:', err.message);
            if(!res.headersSent){
                res.status(500).json({ message: "Failed to download image" });
            }
        });

    } 
    catch (error) {
        console.log("Error in downloadImage function of image controller", error.message);
        if (!res.headersSent) {
            res.status(500).json({ message:"Internal Server Error" });
        }
    }
}

export const getPresignedUrl=async (req,res)=>{
    try{
        const { fileName, fileType }=req.body;

        const key=`wallpaper/${Date.now()}-${fileName}`;
        const obj={
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: fileType
        }
        const command=new PutObjectCommand(obj);

        const uploadUrl=await getSignedUrl(s3, command, { expiresIn: 60 });
        const fileUrl=`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        const publicId=key;

        return res.json({ uploadUrl, fileUrl, publicId });
    }
    catch(error){
        console.log("Error in getPresigned function of image controller", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const uploadImageData=async (req,res)=>{
    try{
        const { title, previewUrl, imageUrl, price, isPremium, tags, discountPercentage, publicId }=req.body;

        const newImage=new ImageModel({ title, previewUrl, imageUrl, price, isPremium, tags, discountPercentage, publicId });
        await newImage.save();
        return res.status(200).json({ message:"Image Uploaded Successfully!" });
    }
    catch(error){
        console.log("Error in uploadImage function of image controller",error);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const uploadPlusImageData=async (req,res)=>{
    try{
        const { title, tags, price, discountPercentage, isPremium }=req.body;
        const timestamp=Date.now();
        const originalKey=`wallpaper/premium/${timestamp}-${req.file.originalname}`;
        const previewKey=`wallpaper/premium/preview/${timestamp}-${req.file.originalname}`;

        const originalParams={
            Key: originalKey,
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        await s3.send(new PutObjectCommand(originalParams));

        const resizedBuffer=await sharp(req.file.buffer).resize(1280, null, { withoutEnlargement: true }).jpeg({ quality: 30 }).toBuffer();
        const { width, height }=await sharp(resizedBuffer).metadata();
        
        const watermarkPath = "./watermark.png";
        const baseSize=Math.min(width, height);

        const baseWatermark = await sharp(watermarkPath)
            .resize(Math.round(baseSize * 0.16))
            .rotate(-45, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .ensureAlpha()
            .modulate({
                brightness: 0.9, 
                opacity: 0.08      
            })
            .blur(0.3)            
            .toBuffer();

        const wmMeta = await sharp(baseWatermark).metadata();
        const wmWidth = wmMeta.width;
        const wmHeight = wmMeta.height;

        const composites = [];

        const spacing = Math.round(wmWidth * 1.6);

        const lineSpacing = spacing;

        const shiftRight = Math.round(wmWidth * 0.7);
        const shiftUp = Math.round(wmHeight * 0.5);

        for (let startY = -height*2; startY < height * 3; startY += lineSpacing) {

            let x = -wmWidth + shiftRight;
            let y = startY - shiftUp;

            while (x < width + wmWidth && y < height + wmHeight) {
                composites.push({
                    input: baseWatermark,
                    top: Math.round(y),
                    left: Math.round(x)
                });

                x += spacing;
                y += spacing;
            }
        }
        const previewBuffer = await sharp(resizedBuffer)
            .composite(composites)
            .jpeg({ quality: 80 })
            .toBuffer();

        const previewParams={
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: previewKey,
            Body: previewBuffer,
            ContentType: "image/jpeg"
        }
        await s3.send(new PutObjectCommand(previewParams));

        const imageUrl=`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${originalKey}`
        const previewUrl=`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${previewKey}`

        const newImage=new ImageModel({
            title,
            price,
            tags,
            discountPercentage,
            isPremium,
            imageUrl,
            previewUrl,
            publicId: originalKey
        });

        await newImage.save();

        return res.status(200).json({ message:"Premium Image Upload Success!" });
    }
    catch(error){
        console.log("Error in uploadPlusImageData function from image controller", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}

export const deleteImage=async (req, res)=>{
    try{
        const { id }=req.params;


        const imageData=await ImageModel.findByIdAndDelete(id);
        
        if(!imageData) return res.status(404).json({ message: "Image Not Found! "});
        
        const originalKey=imageData.imageUrl.split(".amazonaws.com/")[1];
        await deleteFromS3(originalKey);

        if(imageData.isPremium){
            const previewKey=imageData.previewUrl.split(".amazonaws.com/")[1];
            await deleteFromS3(previewKey);
        }
        
        return res.status(200).json({ message: "Image Deleted Successfully!" });
    }
    catch(error){
        console.log("Error in deleteImage function from image controller", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}