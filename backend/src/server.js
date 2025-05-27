import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import imageRoutes from './routes/image.route.js'
import { connectdb } from './lib/db.js';
dotenv.config();

const app=express()
const port=process.env.PORT || 8080;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
    connectdb();
})