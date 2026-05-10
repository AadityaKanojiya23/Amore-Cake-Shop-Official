import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  cancelOrder,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order routes
router.route('/')
  .post(protect, createOrder);

router.get('/my-orders', protect, getMyOrders);

// Razorpay checkout routes
router.post('/razorpay/create', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// Single order operations (keep parameterized route at the bottom to avoid routing conflicts)
router.get('/:id', protect, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);

export default router;
