import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { getDBStatus } from '../config/db.js';
import { getReviewsStore, addReviewStore } from '../config/mockStore.js';

// @desc    Add review to product
// @route   POST /api/reviews
// @access  Private
export const addProductReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Rating and comment are required' });
  }

  try {
    const dbStatus = getDBStatus();

    const reviewData = {
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      comment,
      isApproved: true,
      createdAt: new Date()
    };

    if (dbStatus.useMockData) {
      const review = addReviewStore(reviewData);

      // Recalculate average product rating in mock store
      const reviews = getReviewsStore().filter(r => r.product === productId && r.isApproved);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const newAvg = Number((totalRating / reviews.length).toFixed(1));

      // Update product rating and reviewsCount in mock store
      const products = getReviewsStore();
      const productIndex = products.findIndex(p => p._id === productId);
      if (productIndex !== -1) {
        products[productIndex].rating = newAvg;
        products[productIndex].reviewsCount = reviews.length;
      }

      return res.status(201).json({ success: true, message: 'Review added successfully', review });
    } else {
      // Check if user already reviewed
      const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
      }

      const review = await Review.create(reviewData);

      // Recalculate product rating
      const productReviews = await Review.find({ product: productId, isApproved: true });
      const avgRating = productReviews.reduce((acc, item) => item.rating + acc, 0) / productReviews.length;

      await Product.findByIdAndUpdate(productId, {
        rating: Number(avgRating.toFixed(1)),
        reviewsCount: productReviews.length
      });

      return res.status(201).json({ success: true, message: 'Review added successfully', review });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const dbStatus = getDBStatus();
    let productReviews = [];

    if (dbStatus.useMockData) {
      productReviews = getReviewsStore().filter(r => r.product === productId && r.isApproved);
    } else {
      productReviews = await Review.find({ product: productId, isApproved: true }).sort({ createdAt: -1 });
    }

    res.json({ success: true, reviews: productReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
