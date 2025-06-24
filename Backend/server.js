import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/Db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import {connectCloudinary} from './configs/cloudinary.js';


const app =express();
const port = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();
// app.use(ur)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://shiv-mart-8yin.vercel.app'],
    credentials: true
  }));

app.get('/',(req,res)=>{
    res.send("Hello Shiv Mart");
});
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.listen(port,()=>console.log(`Server is running on port ${port}`));