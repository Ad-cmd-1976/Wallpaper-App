import cloudinary from '../lib/cloudinary.js';

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