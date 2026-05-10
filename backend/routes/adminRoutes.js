import express from 'express';
import { 
  getAnalytics, 
  getAllOrders, 
  updateOrderStatus, 
  addProduct, 
  editProduct, 
  deleteProduct, 
  getAllUsers 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/analytics', getAnalytics);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);

router.post('/products', addProduct);
router.route('/products/:id')
  .put(editProduct)
  .delete(deleteProduct);

export default router;
