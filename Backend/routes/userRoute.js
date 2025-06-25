import express from "express";
import { Login,Logout,isAuth,sendOtpRegister,verifyOtpRegister } from "../controllers/userController.js";
import  authUser  from "../middleware/authUser.js";
const userRouter = express.Router();

userRouter.post("/register/send-otp", sendOtpRegister);
userRouter.post("/register/verify-otp", verifyOtpRegister);
userRouter.post('/login',Login);
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/logout',authUser,Logout);


export default userRouter;