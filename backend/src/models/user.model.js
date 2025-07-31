import mongoose  from 'mongoose'

const UserSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            enum:["customer","admin"],
            default:"customer"
        },
        subscription:{
            type:String,
            enum:["yes","no"],
            default:"no"
        },
        subscriptionExpiresAt:{
            type:Date
        },
        purchasedWallpapers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"wallpapers"
        }]
    },
    {
        timestamps:true
    }
)

const UserModel=mongoose.model('users',UserSchema);

export default UserModel;