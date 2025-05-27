const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// 获取用户购物车
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    // 如果购物车不存在，创建一个空购物车
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 添加商品到购物车
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, title, price, image, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    // 如果购物车不存在，创建一个新购物车
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ productId, title, price, image, quantity }]
      });
    } else {
      // 检查商品是否已在购物车中
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === parseInt(productId)
      );

      if (existingItemIndex > -1) {
        // 更新数量
        cart.items[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // 添加新商品
        cart.items.push({ 
          productId: parseInt(productId), 
          title, 
          price: parseFloat(price), 
          image, 
          quantity: parseInt(quantity) 
        });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 更新购物车商品数量
router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在'
      });
    }

    // 找到要更新的商品
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    // 更新数量
    cart.items[itemIndex].quantity = parseInt(quantity);
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 从购物车删除商品
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在'
      });
    }

    // 找到要删除的商品索引
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    // 删除商品
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 清空购物车
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在'
      });
    }

    // 清空购物车
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
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