import express from 'express';
import { validateCoupon, getCoupons } from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/validate', protect, validateCoupon);

export default router;
