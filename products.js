// products.js - 商品数据模块
import { productApi } from './api.js';

// 商品数据缓存
let productsCache = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 从API获取商品数据
async function fetchProducts() {
    try {
        // 请求所有商品，不分页
        const response = await productApi.getProducts({ limit: 100 });
        if (response.success) {
            productsCache = response.data;
            cacheTimestamp = Date.now();
            return productsCache;
        }
    } catch (error) {
        console.error('获取商品数据失败:', error);
        // 如果API失败，返回默认数据
        return getDefaultProducts();
    }
}

// 获取商品数据（带缓存）
async function getProducts() {
    const now = Date.now();
    if (productsCache.length === 0 || (now - cacheTimestamp) > CACHE_DURATION) {
        return await fetchProducts();
    }
    return productsCache;
}

// 默认商品数据（API失败时的备用）
function getDefaultProducts() {
    return [
        { 
            _id: '1', 
            title: '可爱路飞', 
            image: 'images/101397084_p0_square1200.jpg', 
            price: 2999.9, 
            description: '路飞尼卡形态，可暴打凯多！' 
        },
        { 
            _id: '2', 
            title: '老八抢饮料', 
            image: 'images/f767c55c48c62b6af23f72256d7b627e397706516.jpg@1256w_1468h_!web-article-pic.avif', 
            price: 199.9, 
            description: '可获得老八喝过的饮料一瓶！' 
        },
        { 
            _id: '3', 
            title: '赛博朋克边缘行者', 
            image: 'images/57e8439ddee7e6e5dbb0a67697e944b4339022381.jpg', 
            price: 899.9, 
            description: '我们月球上见吧' 
        },
        { 
            _id: '4', 
            title: '老八的笑容', 
            image: 'images/d20b189a4eeec78920d824826cc2ed42397706516.jpg@1256w_1570h_!web-article-pic.avif', 
            price: 89.9, 
            description: '老八珍贵的笑容写真一张！' 
        },
        { 
            _id: '5', 
            title: '幼驯染三人组', 
            image: 'images/AceSaboandLuffy.jpeg', 
            price: 799.9, 
            description: '最好的三人组！' 
        },
        { 
            _id: '6', 
            title: '孤独摇滚', 
            image: 'images/bba0492b82e2b25e94ed955693d3ac4791611f31.png', 
            price: 99.9, 
            description: '最好的乐队照一张！' 
        },
        { 
            _id: '7', 
            title: '明日香', 
            image: 'images/9ab9fe29ea2d01154bb43014c27c94d73031d44b.jpg', 
            price: 9999.9, 
            description: '明日香送的情人节巧克力一盒！' 
        },
        { 
            _id: '8', 
            title: '真嗣君', 
            image: 'images/7fe1a3eeed71c17087e31619f73a5128e5350363.jpg', 
            price: 999.9, 
            description: '真嗣君写真一张' 
        },
        { 
            _id: '9', 
            title: '雨', 
            image: 'images/899088d54481526378bfcc0a71243d44f56a160c.jpg', 
            price: 9999.9, 
            description: '明日香下雨壁纸一张' 
        },
        { 
            _id: '10', 
            title: '我们的乐队', 
            image: 'images/bc3350af00b183a196571b2df898fc1fb2a84cb6.jpg', 
            price: 39.9, 
            description: '最好的波奇酱舞台照一张' 
        }
    ];
}

export { getProducts, getDefaultProducts };
export default getProducts;