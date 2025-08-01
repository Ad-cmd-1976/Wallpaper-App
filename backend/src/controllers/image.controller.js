import cloudinary from '../lib/cloudinary.js';
import https from 'https';
import ImageModel from '../models/image.model.js';

export const getImages=async (req,res)=>{
    try{
        const response=await cloudinary.api.resources({
            type:'upload',
            resource_type:'image',
            max_results:10,
            next_cursor:req.query.next_cursor
        })
        res.json(response);
    }
    catch(error){
        res.status(500).json({ message:'Internal Server Error!' });
        console.log("Error in image controller getImages function", error.message);
    }
}

export const searchImages=async (req,res)=>{
    try{
        const response=await cloudinary.search.expression(req.query.expression).sort_by('created_at','desc').max_results(10).execute();
        res.json(response);
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


export const uploadImage=async (req,res)=>{
    const { title, imageUrl, price, isPremium, tags, discountPercentage }=req.body;
    if(!title || !imageUrl) return res.status(400).json({ message:"Title and Image Url are required!" });
    try{
        const newImage=new ImageModel({ title, imageUrl, price, isPremium, tags, discountPercentage });
        await newImage.save();
        return res.status(200).json({ message:"Image Uploaded Successfully!" });
    }
    catch(error){
        console.log("Error in uploadImage function of image controller",error.message);
        return res.status(500).json({ message:"Internal Server Error!" });
    }
}