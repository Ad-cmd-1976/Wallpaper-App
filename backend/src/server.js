import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import imageRoutes from './routes/image.route.js';
import paymentRoutes from './routes/payment.route.js';
import googleRoutes from './routes/google.route.js';
import { connectdb } from './lib/db.js';
dotenv.config();

const app=express()
const port=process.env.PORT || 8080;

app.set("trust proxy", 1);
const corsOptions={
    origin:["http://localhost:5173","https://wallpaper-app-topaz.vercel.app"],
    credentials:true
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(passport.initialize());


app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
    connectdb();
})