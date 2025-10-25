const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const { protect } = require('../middleware/auth');

// 获取所有优惠券
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, status } = req.query;
    
    // 构建查询条件
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // 分页查询
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // 获取总数
    const total = await Coupon.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 获取单个优惠券
router.get('/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: '优惠券不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 创建优惠券
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, value, minAmount, startDate, endDate, totalQuantity, stackable, description } = req.body;
    
    // 生成唯一优惠券代码
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = Coupon.generateCode();
      const existingCoupon = await Coupon.findOne({ code });
      if (!existingCoupon) {
        isUnique = true;
      }
    }
    
    const coupon = await Coupon.create({
      name,
      code,
      type,
      value,
      minAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalQuantity,
      stackable,
      description
    });
    
    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 更新优惠券
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, type, value, minAmount, startDate, endDate, totalQuantity, stackable, description } = req.body;
    
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        value,
        minAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalQuantity,
        stackable,
        description
      },
      { new: true, runValidators: true }
    );
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: '优惠券不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 删除优惠券
router.delete('/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: '优惠券不存在'
      });
    }
    
    // 删除相关的使用记录
    await CouponUsage.deleteMany({ coupon: req.params.id });
    
    res.status(200).json({
      success: true,
      message: '优惠券删除成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 获取优惠券使用记录
router.get('/:id/usage', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const usages = await CouponUsage.find({ coupon: req.params.id })
      .populate('user', 'email')
      .sort({ usedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await CouponUsage.countDocuments({ coupon: req.params.id });
    
    res.status(200).json({
      success: true,
      data: usages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

module.exports = router;
