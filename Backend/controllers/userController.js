import Jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";


export const register =async(req,res)=>{
   try{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"Please fill all the fields"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exist"});
    }

    const hashPassword = await bcrypt.hash(password,10);

    const user = await User.create({name,email,password:hashPassword});


    const token =Jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
  
    console.log(token);

    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:process.env.NODE_ENV === "production"?"none":"strict",
        maxAge:7*24*60*60*1000
    })

      return res.status(201).json({success:true,user:{
        email:user.email,name:user.name
      }});  

   }catch(err){
    console.log(err.message);
    res.status(500).json({success:false,message:err.message});

   }
}

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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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