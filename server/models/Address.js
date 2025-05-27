const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, '请提供收件人姓名']
  },
  phone: {
    type: String,
    required: [true, '请提供联系电话']
  },
  province: {
    type: String,
    required: [true, '请提供省份']
  },
  city: {
    type: String,
    required: [true, '请提供城市']
  },
  district: {
    type: String,
    required: [true, '请提供区/县']
  },
  detailAddress: {
    type: String,
    required: [true, '请提供详细地址']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Address', AddressSchema); 