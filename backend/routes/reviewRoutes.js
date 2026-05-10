import express from 'express';
import { addProductReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addProductReview);
router.get('/:productId', getProductReviews);

export default router;
