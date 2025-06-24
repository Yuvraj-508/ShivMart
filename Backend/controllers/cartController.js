import User from '../models/User.js';


export const updateCart = async (req, res) => {
    try {
        const {cartItems} = req.body;
        const {id} = req.user;
        console.log("Received cart items:", cartItems);
        console.log("Received userId:", id);

        const user = await User.findByIdAndUpdate(id,{cartItems});
        res.status(200).json({
            success: true,
            message: "Cart updated successfully"
         
        });
}catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
           
        });
    }
}

