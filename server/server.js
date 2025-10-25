const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// 导入路由
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const productRoutes = require('./routes/productRoutes');
const couponRoutes = require('./routes/couponRoutes');

const app = express();

// 增强CORS配置
app.use(cors({
  origin: true, // 允许所有来源
  credentials: true, // 允许携带凭证
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 中间件
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../')));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 处理404错误
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `找不到路径: ${req.originalUrl}`
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

// 连接MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopDB';
console.log('正在连接到MongoDB:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('MongoDB连接成功');
    
    // 启动服务器
    const PORT = process.env.PORT || 5000;
    
    // 创建服务器实例
    const server = app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
    
    // 处理端口被占用错误
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`端口 ${PORT} 已被占用，尝试使用端口 ${PORT + 1}`);
        // 尝试使用下一个端口
        app.listen(PORT + 1, () => {
          console.log(`服务器运行在端口 ${PORT + 1}`);
        });
      } else {
        console.error('服务器启动错误:', err);
      }
    });
  })
  .catch(err => {
    console.error('MongoDB连接失败:', err);
    process.exit(1); // 如果数据库连接失败，退出应用
  });