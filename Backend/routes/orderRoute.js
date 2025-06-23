import express from 'express';
import  authUser  from '../middleware/authUser.js';
import  authSeller  from '../middleware/authSeller.js';
import { placeOrderCOD,getUserOrders,getAllOrders,placeOrderRazorpay,verifyRazorpayPayment} from '../controllers/orderController.js';
const orderRouter = express.Router();

orderRouter.post('/cod', authUser,placeOrderCOD); 
orderRouter.post('/online', authUser,placeOrderRazorpay); 
orderRouter.post('/verify', authUser,verifyRazorpayPayment); 
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);

export default orderRouter;