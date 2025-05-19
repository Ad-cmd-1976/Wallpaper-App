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
        subscription:{
            type:String,
            enum:["yes","no"],
            default:"no"
        },
    },
    {
        timestamps:true
    }
)

const UserModel=new mongoose.model('users',UserSchema);
export default UserModel;