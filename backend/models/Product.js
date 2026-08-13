import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Size", "Color"
    value: { type: String, required: true }, // e.g. "L", "Red"
    priceDelta: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String, required: true }],
    videoUrl: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 }, // strike-through price
    stock: { type: Number, required: true, default: 0, min: 0 },
    variants: [variantSchema],
    attributes: { type: Map, of: String }, // e.g. { material: 'cotton' }
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

productSchema.methods.recalculateRating = function () {
  if (this.reviews.length === 0) {
    this.ratingAverage = 0;
    this.ratingCount = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.ratingAverage = Number((total / this.reviews.length).toFixed(1));
  this.ratingCount = this.reviews.length;
};

export default mongoose.model('Product', productSchema);
