const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请提供优惠券名称'],
    trim: true
  },
  code: {
    type: String,
    required: [true, '请提供优惠券代码'],
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: [true, '请提供优惠券类型'],
    enum: ['discount', 'amount', 'shipping'],
    default: 'amount'
  },
  value: {
    type: Number,
    required: [true, '请提供优惠券面值'],
    min: [0, '面值不能为负数']
  },
  minAmount: {
    type: Number,
    default: 0,
    min: [0, '最低消费金额不能为负数']
  },
  startDate: {
    type: Date,
    required: [true, '请提供开始时间']
  },
  endDate: {
    type: Date,
    required: [true, '请提供结束时间']
  },
  totalQuantity: {
    type: Number,
    required: [true, '请提供总发放数量'],
    min: [1, '总发放数量至少为1']
  },
  usedQuantity: {
    type: Number,
    default: 0,
    min: [0, '已使用数量不能为负数']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired'],
    default: 'pending'
  },
  stackable: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
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
  collection: 'coupons'
});

// 更新时间
CouponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // 自动更新状态
  const now = new Date();
  if (this.startDate > now) {
    this.status = 'pending';
  } else if (this.endDate < now) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
  
  next();
});

// 生成唯一优惠券代码
CouponSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = mongoose.model('Coupon', CouponSchema);
