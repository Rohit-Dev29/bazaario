import asyncHandler from 'express-async-handler';
import Conversation from '../models/Conversation.js';
import Product from '../models/Product.js';

// @desc    Buyer: get or create the conversation for a product, then send a message
// @route   POST /api/chat/:productId
export const sendBuyerMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Message cannot be empty');
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let conversation = await Conversation.findOne({
    product: product._id,
    buyer: req.user._id,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      product: product._id,
      buyer: req.user._id,
      seller: product.seller,
      messages: [],
    });
  }

  conversation.messages.push({
    sender: 'buyer',
    senderName: req.user.name,
    text: text.trim(),
  });
  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json({ success: true, conversation });
});

// @desc    Buyer: get their conversation thread for a product
// @route   GET /api/chat/:productId
export const getBuyerConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    product: req.params.productId,
    buyer: req.user._id,
  });

  res.json({ success: true, conversation: conversation || null });
});

// @desc    Seller/admin: list all conversations for their products
// @route   GET /api/chat/conversations
export const getSellerConversations = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { seller: req.user._id };
  const conversations = await Conversation.find(filter)
    .populate('product', 'title images')
    .populate('buyer', 'name email')
    .sort({ lastMessageAt: -1 });

  res.json({ success: true, conversations });
});

// @desc    Seller/admin: get one conversation
// @route   GET /api/chat/conversations/:id
export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('product', 'title images')
    .populate('buyer', 'name email');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  const isSeller = conversation.seller.toString() === req.user._id.toString();
  if (!isSeller && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this conversation');
  }

  res.json({ success: true, conversation });
});

// @desc    Seller/admin: reply in a conversation
// @route   POST /api/chat/conversations/:id/reply
export const sendSellerReply = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Message cannot be empty');
  }

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  const isSeller = conversation.seller.toString() === req.user._id.toString();
  if (!isSeller && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to reply in this conversation');
  }

  conversation.messages.push({
    sender: 'seller',
    senderName: req.user.name,
    text: text.trim(),
  });
  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json({ success: true, conversation });
});
