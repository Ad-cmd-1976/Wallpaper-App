import mongoose from 'mongoose';

const imageSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    imageUrl:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

const ImageModel=mongoose.model("image", imageSchema);

export default ImageModel;