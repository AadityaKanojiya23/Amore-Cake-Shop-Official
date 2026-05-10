import express from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  getHomepageProducts, 
  getSimilarProducts, 
  getCategories 
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/homepage/promos', getHomepageProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/similar', getSimilarProducts);

export default router;
