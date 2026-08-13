import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['buyer', 'seller'], required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One conversation per buyer+product pair
conversationSchema.index({ product: 1, buyer: 1 }, { unique: true });

export default mongoose.model('Conversation', conversationSchema);
