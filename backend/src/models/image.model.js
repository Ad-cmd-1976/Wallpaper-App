import mongoose from 'mongoose';

const ImageSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        min:0,
        default:0
    },
    previewUrl:{
        type:String
    },
    imageUrl:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    publicId:{
        type:String,
        required:true,
    },
    discountPercentage:{
        type:Number,
        default:0,
        min:0,
        max:100
    },
    isPremium:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const ImageModel=mongoose.model("Image", ImageSchema);

export default ImageModel;