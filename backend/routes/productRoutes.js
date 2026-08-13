import express from 'express';
import {
  getProducts,
  getAllProductsForAdmin,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/all', protect, authorize('seller', 'admin'), getAllProductsForAdmin);
router.get('/:idOrSlug', getProductByIdOrSlug);
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);
router.post('/:id/reviews', protect, addReview);

export default router;
