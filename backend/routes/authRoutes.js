import express from 'express';
import { 
  registerUser, 
  loginUser, 
  googleLogin, 
  getUserProfile, 
  updateUserProfile, 
  addAddress, 
  deleteAddress, 
  toggleWishlist 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .post(protect, addAddress);

router.delete('/addresses/:id', protect, deleteAddress);

router.post('/wishlist', protect, toggleWishlist);

export default router;
