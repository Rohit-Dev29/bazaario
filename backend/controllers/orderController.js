import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order (checkout)
// @route   POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Re-validate prices and stock against the database — never trust client-sent prices
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.title}`);
    }

    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      quantity: item.quantity,
      variant: item.variant,
      seller: product.seller,
    });
    itemsPrice += product.price * item.quantity;

    product.stock -= item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 49;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // example GST rate
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get order by id
// @route   GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, order });
});

// @desc    Update order status (seller/admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'delivered') order.deliveredAt = new Date();
  await order.save();

  res.json({ success: true, order });
});

// @desc    Mark order as paid (after payment gateway confirmation)
// @route   PUT /api/orders/:id/pay
export const markOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: req.body.paymentId,
    status: req.body.status,
    updateTime: new Date().toISOString(),
  };
  await order.save();

  res.json({ success: true, order });
});
