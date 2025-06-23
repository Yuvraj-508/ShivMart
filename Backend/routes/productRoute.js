import express from 'express';
import {upload} from '../configs/multer.js';
import { addProduct ,ProductList,ProductById,changeStock} from '../controllers/productController.js';
import authSeller  from '../middleware/authSeller.js';

const productRouter = express.Router();

productRouter.post('/add',upload.array(["images"]),authSeller, addProduct);
productRouter.get('/list',ProductList);
productRouter.get(':id',ProductById);
productRouter.post('/change',authSeller, changeStock);

export default productRouter;