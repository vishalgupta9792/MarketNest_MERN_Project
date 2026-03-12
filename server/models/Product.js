const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['men', 'women', 'kids', 'accessories', 'footwear', 'bags', 'jewelry', 'other'],
  },
  images: [{ type: String }],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for search performance
productSchema.index({ title: 'text' });
productSchema.index({ category: 1, status: 1, isDeleted: 1 });

module.exports = mongoose.model('Product', productSchema);
