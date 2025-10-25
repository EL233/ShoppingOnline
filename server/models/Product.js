const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请提供商品标题'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, '请提供商品价格'],
    min: [0, '价格不能为负数']
  },
  stock: {
    type: Number,
    required: [true, '请提供库存数量'],
    min: [0, '库存不能为负数'],
    default: 0
  },
  description: {
    type: String,
    required: [true, '请提供商品描述'],
    trim: true
  },
  image: {
    type: String,
    required: [true, '请提供商品图片'],
    trim: true
  },
  category: {
    type: String,
    required: [true, '请提供商品分类'],
    enum: ['anime', 'game', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'products'
});

// 更新时间
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);