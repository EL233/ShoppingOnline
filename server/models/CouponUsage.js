const mongoose = require('mongoose');

const CouponUsageSchema = new mongoose.Schema({
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  usedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'coupon_usages'
});

module.exports = mongoose.model('CouponUsage', CouponUsageSchema);
