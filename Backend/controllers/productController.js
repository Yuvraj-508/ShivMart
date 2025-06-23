import Product from '../models/Product.js';
import {cloudinary} from '../configs/cloudinary.js';
export const addProduct = async(req, res) => {
try{
    let productData = JSON.parse(req.body.productData)

    const images = req.files;

    let imageUrls = await Promise.all(
        images.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, {               
                resource_type: 'image'
            });
            return result.secure_url;
        })
    );
    await Product.create({
        ...productData,
        image: imageUrls
    })
    res.status(201).json({
        success: true,
        message: "Product added successfully"
    })

}catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}
}

export const ProductList = async(req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export const ProductById = async(req, res) => {
    try{
        const {id}=req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            product
        });
}
    catch (error) {
    console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export const changeStock = async(req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        res.status(200).json({
            success: true,
            message: "Stock updated successfully"
        });
}
catch (error) {
    console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}