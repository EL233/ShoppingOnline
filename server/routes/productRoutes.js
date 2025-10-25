const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 获取所有商品
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, category, search, featured } = req.query;
    
    // 构建查询条件
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // 分页查询
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // 获取总数
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: products,
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

// 获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 创建商品（管理员功能）
router.post('/', async (req, res) => {
  try {
    const { title, price, stock, description, image, category, isFeatured } = req.body;
    
    const product = await Product.create({
      title,
      price,
      stock,
      description,
      image,
      category,
      isFeatured: isFeatured || false
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 更新商品（管理员功能）
router.put('/:id', async (req, res) => {
  try {
    const { title, price, stock, description, image, category, isActive, isFeatured } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        stock,
        description,
        image,
        category,
        isActive,
        isFeatured
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 删除商品（管理员功能）
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      message: '商品删除成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 获取商品分类统计
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: stats
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