const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

// 获取用户所有地址
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 添加新地址
router.post('/', protect, async (req, res) => {
  try {
    const { name, phone, province, city, district, detailAddress, isDefault } = req.body;

    // 如果设置为默认地址，先将其他地址设为非默认
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user.id,
      name,
      phone,
      province,
      city,
      district,
      detailAddress,
      isDefault
    });

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 更新地址
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, phone, province, city, district, detailAddress, isDefault } = req.body;

    // 检查地址是否存在
    let address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: '地址不存在'
      });
    }

    // 确保用户只能更新自己的地址
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    // 如果设置为默认地址，先将其他地址设为非默认
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    // 更新地址
    address = await Address.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        province,
        city,
        district,
        detailAddress,
        isDefault
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 删除地址
router.delete('/:id', protect, async (req, res) => {
  try {
    // 检查地址是否存在
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: '地址不存在'
      });
    }

    // 确保用户只能删除自己的地址
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    await address.remove();

    res.status(200).json({
      success: true,
      message: '地址已删除'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后再试'
    });
  }
});

// 设置默认地址
router.put('/default/:id', protect, async (req, res) => {
  try {
    // 检查地址是否存在
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: '地址不存在'
      });
    }

    // 确保用户只能设置自己的地址
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: '未授权'
      });
    }

    // 将其他地址设为非默认
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: req.params.id } },
      { isDefault: false }
    );

    // 设置当前地址为默认
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      data: address
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