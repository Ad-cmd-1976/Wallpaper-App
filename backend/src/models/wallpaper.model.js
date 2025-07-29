import mongoose from 'mongoose';

const wallpaperSchema=new mongoose.Schema({
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

const WallpaperModel=mongoose.model("wallpaper",wallpaperSchema);

export default WallpaperModel;