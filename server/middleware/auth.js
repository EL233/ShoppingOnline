const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由中间件
exports.protect = async (req, res, next) => {
  let token;

  try {
    console.log('认证中间件 - 请求头:', req.headers);
    
    // 检查请求头中是否有token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('从Authorization头部获取到token:', token.substring(0, 10) + '...');
    } 
    // 检查cookie中是否有token
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('从Cookie获取到token:', token.substring(0, 10) + '...');
    }

    // 如果没有token
    if (!token) {
      console.log('请求中未找到token');
      return res.status(401).json({
        success: false,
        message: '未授权访问，请登录'
      });
    }

    // 验证token
    const jwtSecret = process.env.JWT_SECRET || 'el_shop_secret_key_2023';
    console.log('使用密钥验证token:', jwtSecret.substring(0, 5) + '...');
    
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token验证成功，用户ID:', decoded.id);

    // 查找用户
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('找不到对应的用户:', decoded.id);
      return res.status(401).json({
        success: false,
        message: '用户不存在，请重新登录'
      });
    }

    console.log('用户验证成功:', user.email);
    
    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (err) {
    console.error('认证错误:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的token，请重新登录'
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '登录已过期，请重新登录'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: '认证失败，请重新登录'
    });
  }
}; 