import express from "express";
import { register,Login,Logout,isAuth } from "../controllers/userController.js";
import  authUser  from "../middleware/authUser.js";
const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',Login);
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/logout',authUser,Logout);


export default userRouter;