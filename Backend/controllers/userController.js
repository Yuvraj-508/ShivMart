import Jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {sendOtpEmail} from '../configs/OtpSent.js';
import Otp from '../models/OtpModel.js';


// Step 1: Get details, generate OTP, email it, and store in DB
export const sendOtpRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);


    // Store in DB (replace if exists)
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, expireAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true }
    );

    await sendOtpEmail(email, otp);

    return res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.log("OTP Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOtpRegister = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    console.log(name, email, password, otp);

    if (!name || !email || !password || !otp)
      return res.status(400).json({ message: "All fields required" });

    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp || existingOtp.otp !== otp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // ✅ Create user now
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🧹 Delete OTP after use
    await Otp.deleteOne({ email });

    return res.status(201).json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("OTP Verify Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // ✅ required for HTTPS
      sameSite: 'None', // ✅ allow cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    

    return res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name }
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const Logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
          httpOnly: true,
          secure: true, // ✅ required for HTTPS
          sameSite: 'None', // ✅ allow cross-origin cookies
       
        });
        return res.status(200).json({success:true,message:"Logged out successfully"});
    } catch (error) {
        console.log(err.message);
        res.status(500).json({success:false,message:err.message});
    }
}

export const isAuth = async (req, res) => {
  try {
    const {id}= req.user;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
    } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
    }
}