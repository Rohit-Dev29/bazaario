import express from 'express';
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  })
);

export default router;
