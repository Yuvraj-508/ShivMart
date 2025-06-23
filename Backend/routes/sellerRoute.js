import express from 'express';
import { sellerLogin, sellerLogout, isSellerAuth } from '../controllers/sellerController.js';
import  authSeller  from '../middleware/authSeller.js';
const sellerRouter = express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/logout',sellerLogout);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);


export default sellerRouter;