import cloudinary from '../lib/cloudinary.js';
import https from 'https';
import ImageModel from '../models/image.model.js';

export const getImages=async (req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;

        const images=await ImageModel.find().sort({ createdAt:-1 }).skip(skip).limit(limit);
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
        }).sort({ createdAt:-1 }).skip(skip).limit(limit);

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

export const downloadImage = async (req, res) => {
    try {
        const { publicId }=req.params;
        const user=req.user;

        const { secure_url }=await cloudinary.api.resource(publicId, {
            resource_type: 'image'
        });

        https.get(secure_url, (cloudinaryRes) => {
            res.setHeader('Content-disposition', `attachment; filename="${publicId}.jpg"`);
            res.setHeader('Content-Type', 'image/jpeg');

            cloudinaryRes.pipe(res);

            cloudinaryRes.on('error', (err) => {
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
            if (!res.headersSent) {
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
    const { title, imageUrl, price, isPremium, tags, discountPercentage, publicId }=req.body;
    try{
        const newImage=new ImageModel({ title, imageUrl, price, isPremium, tags, discountPercentage, publicId });
        await newImage.save();
        return res.status(200).json({ message:"Image Uploaded Successfully!" });
    }
    catch(error){
        console.log("Error in uploadImage function of image controller",error);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}