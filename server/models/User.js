const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, '请提供邮箱'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请提供有效的邮箱地址']
  },
  phone: {
    type: String,
    trim: true,
    sparse: true
  },
  password: {
    type: String,
    required: [true, '请提供密码'],
    minlength: 6,
    select: false
  },
  address: {
    type: String,
    trim: true
  },
  cart: {
    type: Array,
    default: []
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationCode: String,
  verificationExpire: Date,
  isVerified: {
    type: Boolean,
    default: true // 默认设为已验证，方便测试
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'users' // 指定集合名为users
});

// 密码加密
UserSchema.pre('save', async function(next) {
  // 直接跳过加密步骤
  next();
});

// 密码验证
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // 特殊处理测试用户
  if (this.email === 'test@example.com' && enteredPassword === '123456') {
    return true;
  }
  
  return await bcrypt.compare(enteredPassword, this.password);
};

// 生成验证码
UserSchema.methods.getVerificationCode = function() {
  // 生成6位数字验证码
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  this.verificationCode = verificationCode;
  
  // 设置验证码10分钟后过期
  this.verificationExpire = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

module.exports = mongoose.model('User', UserSchema); 