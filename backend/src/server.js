import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import authRoute from './routes/auth.route.js';
import { connectdb } from './lib/db.js';
const {parsed:config}=dotenv.config();

const app=express()
const port=process.env.PORT || 8080;
const BASE_URL=`https://api.cloudinary.com/v1_1/${config.CLOUD_NAME}`
const auth={
    username:config.API_KEY,
    password:config.API_SECRET
}

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/api/auth',authRoute);

app.get('/photos',async (req,res)=>{
    const response=await axios.get(BASE_URL+'/resources/image',{
        auth,
        params:{next_cursor:req.query.next_cursor}
    });
    res.send(response.data);
})

app.get('/search',async (req,res)=>{
    const response=await axios.get(BASE_URL+'/resources/search',{
        auth,
        params:{
            expression:req.query.expression
        }
    })
    res.send(response.data);
})

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
    connectdb();
})