import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
            
        }
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
        ref: 'Address'
    },
    status: {
        type: String,
        default: 'Order Placed',
    },
    paymentMethod: {    
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
     // 🔽 Optional Razorpay-specific fields
  paymentId: String,
  razorpayOrderId: String,
  paymentSignature: String,
  paymentDate: Date,
},{timestamps: true});
const Order = mongoose.model('Order', orderSchema);
export default Order;