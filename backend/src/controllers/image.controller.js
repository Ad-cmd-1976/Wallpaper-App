import cloudinary from '../lib/cloudinary.js';
import https from 'https';

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
        res.status(500).json({ messsage:'Internal Server Error!' });
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

export const downloadImage=async (req,res)=>{
    try{
        const { publicId }=req.params;
        const user=req.user;
        const { secure_url }=await cloudinary.api.resource(publicId,{
            resource_type:'image'
        });
        
        https.get(secure_url,(cloudinaryRes)=>{
            res.setHeader('Content-disposition',`attachment; filename="${publicId}.jpg"`);
            res.setHeader('Content-Type','image/jpeg');
            cloudinaryRes.pipe(res);
        }).on('error',(err)=>{
            console.error('Cloudinary stream error',err.message);
            res.status(500).json({ message:"Failed to download image" });
        })
    }
    catch(error){
        console.log("Error in downloadImage function of image controller", error.message);
        res.status(500).json({ message:"Internal Server Error" });
    }
}