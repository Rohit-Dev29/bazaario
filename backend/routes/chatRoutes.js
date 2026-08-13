import express from 'express';
import {
  sendBuyerMessage,
  getBuyerConversation,
  getSellerConversations,
  getConversationById,
  sendSellerReply,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getSellerConversations);
router.get('/conversations/:id', protect, getConversationById);
router.post('/conversations/:id/reply', protect, sendSellerReply);

router.get('/:productId', protect, getBuyerConversation);
router.post('/:productId', protect, sendBuyerMessage);

export default router;
