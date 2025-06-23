import Order from '../models/Orders.js';
import Product from '../models/Product.js';
import razorpay from 'razorpay';
import crypto from 'crypto';
const currency = 'INR'; // Define the currency symbol

// gate intalizze
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
// plareOrderCOD function to handle placing an order with Cash on Delivery (COD)
export const placeOrderCOD = async (req, res) => {
    try {
        const {userId,address,items}=req.body;
        if ( !address || items.length ===0) {
            return res.status(400).json({ message: 'Invalid data',success:false });
        }

        let amount = await items.reduce(async  (acc, item) => {
            const product= await Product.findById(item.product);
            return ( await acc) + product.offerPrice * item.quantity;
        }
        , 0);
        amount +=Math.floor(amount * 0.02); // Adding 2% tax charge

        await Order.create({
            userId,
            address,
            items,
            amount,
            paymentMethod: 'COD',
        });
        return res.status(201).json({ message: 'Order placed successfully', success: true });
    }
    catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const placeOrderRazorpay = async (req, res) => {
    try {
      const { userId, address, items } = req.body;
  
      if (!address || items.length === 0) {
        return res.status(400).json({ message: 'Invalid data', success: false });
      }
  
      let amount = 0;
      for (const item of items) {
        const product = await Product.findById(item.product);
        amount += product.offerPrice * item.quantity;
      }
  
      amount += Math.floor(amount * 0.02); // 2% tax
      const orderData = await Order.create({
        userId,
        address,
        items,
        amount,
        paymentMethod: 'Online',
        isPaid: false,
        date: Date.now(),
      });
  
      const options = {
        amount: amount * 100, // Razorpay uses paise
        currency: 'INR',
        receipt: orderData._id.toString(),
      };
  
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          console.error('Razorpay order creation failed:', error);
          return res.status(500).json({ message: 'Failed to create Razorpay order', success: false });
        }
     console.log('Razorpay order created:', order);
        res.status(201).json({
          success: true,
          message: 'Order created',
          order,
          razorpayKey: process.env.RAZORPAY_KEY_ID,
        });
      });
    } catch (error) {
      console.error('Error placing Razorpay order:', error);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  };

  // verify the Razorpay payment signature
  export const verifyRazorpayPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body;
  
      // Signature verification
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
  
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Signature mismatch' });
      }
  
      // Update your DB to mark the order as paid
      await Order.findByIdAndUpdate(localOrderId, {
        isPaid: true,
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentSignature: razorpay_signature,
        paymentDate: new Date(),
      });
  
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
      console.error('Error verifying payment:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
// get user orders
export const getUserOrders = async (req, res) => {
    try{
        const { id:userId } = req.user;
        console.log('User ID:', userId);
        const orders = await Order.find({
            userId,
            $or:[{
                paymentMethod: 'COD',
            },{isPaid: true
            }]
        }).populate('items.product address').sort({ createdAt: -1 });

        console.log('Orders:', orders);
        return res.status(200).json({ orders, success: true });
    }
    catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ message: error.message, success: false });
    }
}
// place getAllOrders function here
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product address');
        return res.status(200).json({ orders, success: true });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return res.status(500).json({ message: error.message, success: false });
    }
}