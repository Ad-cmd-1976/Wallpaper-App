import https from 'https';
import cloudinary from '../lib/cloudinary.js';
import ImageModel from '../models/image.model.js';
import PurchaseModel from '../models/purchase.model.js';

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
                console.error('Cloudinary stream error', err.message);
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
        const { title, file, tags, price, discountPercentage, isPremium }=req.body;

        const previewTransformation = {
            width: 800,                
            height: 600,               
            crop: "fill",             
            quality: "30",             
            fetch_format: "auto",      
            effect: "blur:200",        
            flags: "lossy",            
            overlay: {
                font_family: "Arial",
                font_size: 40,
                font_weight: "bold",
                text: "PREVIEW   PREVIEW   PREVIEW", 
            },
            gravity: "center",         
            opacity: 50,              
            color: "#ffffff",          
        };

        const uploadOpts = {
            folder: "wallpapers/premium",
            resource_type: "image",
            eager: [previewTransformation], 
            eager_async: false,             
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            context: {
                caption: title,
                alt: title,
            },
        };

        const response=await new Promise((resolve,reject)=>{
            const stream=cloudinary.uploader.upload_stream(uploadOpts, (err, resData)=>{
                if(err) return reject(err);
                resolve(resData);
            });
            stream.end(req.file.buffer);
        });

        const publicId=response.public_id;
        const imageUrl=response.secure_url;
        const previewUrl=response.eager?.[0]?.secure_url || cloudinary.url(publicId, { 
            secure:true, 
            transformation:[previewTransformation]
        });

        const newImage=new ImageModel({
            title,
            price,
            tags,
            discountPercentage,
            isPremium,
            imageUrl,
            previewUrl,
            publicId
        });

        await newImage.save();

        return res.status(200).json({ message:"Premium Image Upload Success!" });
    }
    catch(error){
        console.log("Error in uploadPlusImageData function from image controller", error);
        res.status(500).json({ message:"Internal Server Error!" });
    }
}