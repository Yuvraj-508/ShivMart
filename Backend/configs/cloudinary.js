// configs/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Function to connect to Cloudinary (call this in your server.js)
const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};

export { connectCloudinary, cloudinary };
