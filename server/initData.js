const mongoose = require('mongoose');
const Product = require('./models/Product');

// 示例商品数据
const sampleProducts = [
    {
        title: '可爱路飞',
        price: 2999.9,
        stock: 50,
        description: '路飞尼卡形态，可暴打凯多！',
        image: 'images/GXMD576a0AAU7as.jpeg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '老八抢饮料',
        price: 199.9,
        stock: 100,
        description: '可获得老八喝过的饮料一瓶！',
        image: 'images/GXO06eYb0AAarC3.jpeg',
        category: 'other',
        isActive: true,
        isFeatured: true
    },
    {
        title: '赛博朋克边缘行者',
        price: 899.9,
        stock: 30,
        description: '我们月球上见吧',
        image: 'images/GXPPMj6bgAM_GTU.jpeg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '老八的笑容',
        price: 89.9,
        stock: 200,
        description: '老八珍贵的笑容写真一张！',
        image: 'images/d20b189a4eeec78920d824826cc2ed42397706516.jpg@1256w_1570h_!web-article-pic.avif',
        category: 'other',
        isActive: true,
        isFeatured: false
    },
    {
        title: '幼驯染三人组',
        price: 799.9,
        stock: 25,
        description: '最好的三人组！',
        image: 'images/AceSaboandLuffy.jpeg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '孤独摇滚',
        price: 99.9,
        stock: 150,
        description: '最好的乐队照一张！',
        image: 'images/bba0492b82e2b25e94ed955693d3ac4791611f31.png',
        category: 'anime',
        isActive: true,
        isFeatured: false
    },
    {
        title: '明日香',
        price: 9999.9,
        stock: 10,
        description: '明日香送的情人节巧克力一盒！',
        image: 'images/Asuka.png',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '真嗣君',
        price: 999.9,
        stock: 40,
        description: '真嗣君写真一张',
        image: 'images/7fe1a3eeed71c17087e31619f73a5128e5350363.jpg',
        category: 'anime',
        isActive: true,
        isFeatured: false
    },
    {
        title: '雨',
        price: 9999.9,
        stock: 5,
        description: '明日香下雨壁纸一张',
        image: 'images/899088d54481526378bfcc0a71243d44f56a160c.jpg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '我们的乐队',
        price: 39.9,
        stock: 300,
        description: '最好的波奇酱舞台照一张',
        image: 'images/bc3350af00b183a196571b2df898fc1fb2a84cb6.jpg',
        category: 'anime',
        isActive: true,
        isFeatured: false
    },
    {
        title: '初音未来',
        price: 1299.9,
        stock: 80,
        description: '世界第一的虚拟歌姬！',
        image: 'images/miku.jpg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '雷姆手办',
        price: 899.9,
        stock: 60,
        description: '从零开始的异世界生活 - 雷姆精美手办',
        image: 'images/rem.jpg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '原神甘雨',
        price: 1599.9,
        stock: 40,
        description: '原神甘雨限定手办，璃月七星之一',
        image: 'images/ganyu.jpg',
        category: 'game',
        isActive: true,
        isFeatured: true
    },
    {
        title: '塞尔达传说',
        price: 299.9,
        stock: 200,
        description: '塞尔达传说：王国之泪限定版',
        image: 'images/zelda.jpg',
        category: 'game',
        isActive: true,
        isFeatured: true
    },
    {
        title: '明日香精选版',
        price: 12999.9,
        stock: 5,
        description: '明日香精选版，限量发售！',
        image: 'images/Asuka.png',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '路飞尼卡形态',
        price: 3999.9,
        stock: 30,
        description: '路飞尼卡形态手办，可暴打凯多！',
        image: 'images/GXMD576a0AAU7as.jpeg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    },
    {
        title: '老八限定饮料',
        price: 299.9,
        stock: 80,
        description: '老八限定版饮料，限量发售！',
        image: 'images/GXO06eYb0AAarC3.jpeg',
        category: 'other',
        isActive: true,
        isFeatured: true
    },
    {
        title: '赛博朋克限定版',
        price: 1299.9,
        stock: 20,
        description: '赛博朋克边缘行者限定版，我们月球上见！',
        image: 'images/GXPPMj6bgAM_GTU.jpeg',
        category: 'anime',
        isActive: true,
        isFeatured: true
    }
];

async function initProducts() {
    try {
        // 连接数据库
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopDB');
        console.log('数据库连接成功');

        // 清空现有商品
        await Product.deleteMany({});
        console.log('清空现有商品数据');

        // 插入示例商品
        await Product.insertMany(sampleProducts);
        console.log('示例商品数据插入成功');

        console.log('数据初始化完成！');
        process.exit(0);
    } catch (error) {
        console.error('数据初始化失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    initProducts();
}

module.exports = initProducts;
