import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaid,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);
router.put('/:id/pay', protect, markOrderPaid);

export default router;
