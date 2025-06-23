import jwt from 'jsonwebtoken';

export const sellerLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Seller login attempt with email:", email,password);

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            const token = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(200).json({ success: true, message: "Login successful." });
        } else {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

    } catch (error) {
        console.error("Error during seller login:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const isSellerAuth = async(req, res) => {
  try {
    return res.status(200).json({ success: true });
    } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
    }
}


export const sellerLogout = async (req,res)=>{
    try {
        res.clearCookie('sellerToken',{ 
          httpOnly:true, 
          secure:process.env.NODE_ENV === "production",
          sameSite:process.env.NODE_ENV === "production"?"none":"strict",
        });
        return res.status(200).json({success:true,message:"Logged out successfully"});
    } catch (error) {
        console.log(err.message);
        res.status(500).json({success:false,message:err.message});
    }
}