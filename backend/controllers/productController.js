import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get products with search, filter, sort, pagination
// @route   GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;

  const filter = { isActive: true };

  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.brand) {
    filter.brand = req.query.brand;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.minRating) {
    filter.ratingAverage = { $gte: Number(req.query.minRating) };
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'price_asc') sort = { price: 1 };
  if (req.query.sort === 'price_desc') sort = { price: -1 };
  if (req.query.sort === 'rating') sort = { ratingAverage: -1 };
  if (req.query.sort === 'newest') sort = { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product by slug or id
// @route   GET /api/products/:idOrSlug
export const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

  const product = await Product.findOne(
    isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
  )
    .populate('category', 'name slug')
    .populate('seller', 'name');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc    Create a product (seller/admin)
// @route   POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { title, slug, description, category, images, price, mrp, stock, brand } = req.body;

  if (!title || !slug || !description || !category || !images?.length || !price || !mrp) {
    res.status(400);
    throw new Error('Missing required product fields');
  }

  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update a product (owning seller/admin)
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this product');
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc    Delete (deactivate) a product
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  product.isActive = false;
  await product.save();
  res.json({ success: true, message: 'Product removed' });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.recalculateRating();
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});
