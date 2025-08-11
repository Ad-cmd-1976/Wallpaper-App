import https from 'https';
import ImageModel from '../models/image.model.js';

export const getImages=async (req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;

        const images=await ImageModel.find().sort({ createdAt:-1 }).skip(skip).limit(limit);
        const total=await ImageModel.countDocuments();

        const mapping=images.map((image)=>{
            let imageObj=image.toObject();
            imageObj.imageUrl=imageObj.previewUrl || imageObj.imageUrl;
            return imageObj;
        })
        
        return res.json({
            images:mapping,
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
        
        const mapping=images.map((image)=>{
            let imageObj=image.toObject();
            imageObj.imageUrl=imageObj.previewUrl || imageObj.imageUrl;
            return imageObj;
        })
        
        res.status(200).json({ 
            resources:mapping,
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
        const { title, imageUrl, price, isPremium, tags, discountPercentage, publicId }=req.body;
        const cloudName=process.env.CLOUD_NAME;
        let previewUrl=imageUrl;

        if(publicId && cloudName){
            const ext=(imageUrl || '').split('.').pop().split('?')[0];
            previewUrl=`https://res.cloudinary.com/${cloudName}/image/upload/w_800,c_limit/${publicId}.${ext}`;
        }

        const newImage=new ImageModel({ title, previewUrl, imageUrl, price, isPremium, tags, discountPercentage, publicId });
        await newImage.save();
        return res.status(200).json({ message:"Image Uploaded Successfully!" });
    }
    catch(error){
        console.log("Error in uploadImage function of image controller",error);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}