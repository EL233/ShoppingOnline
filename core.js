// core.js - 核心功能模块
import { getProducts, getDefaultProducts } from './products.js';

// 全局状态
let cart = [];
let isLoggedIn = false;
let currentUser = '';

// 翻译对象
const translations = {
    'zh': {
        'personal-center': '个人中心',
        'shopping-cart': '购物车',
        'contact-us': '联系我们',
        'search': '搜索'
    },
    'en': {
        'personal-center': 'Personal Center',
        'shopping-cart': 'Shopping Cart',
        'contact-us': 'Contact Us',
        'search': 'Search'
    }
};

// 初始化购物车
function initCart() {
    // 从localStorage加载购物车数据
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// 获取URL参数
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 添加商品到购物车
async function addToCart(productId, quantity = 1) {
    try {
        const products = await getProducts();
        const product = products.find(p => p._id === productId || p.id === parseInt(productId));
        if (!product) {
            alert('商品不存在');
            return;
        }
        
        const existingItem = cart.find(item => (item._id || item.id) === (product._id || product.id));
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        // 保存到localStorage
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        
        alert('商品已添加到购物车！');
        updateCartDisplay(); // 确保更新购物车显示
    } catch (error) {
        console.error('添加商品到购物车失败:', error);
        alert('添加商品失败，请稍后再试');
    }
}

// 从购物车移除商品
function removeFromCart(index) {
    cart.splice(index, 1);
    // 保存到localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartDisplay();
}

// 更新购物车显示
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return; // 如果不在购物车页面，直接返回
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>购物车是空的</p>
                <p>快去挑选您喜欢的商品吧！</p>
            </div>
        `;
        return;
    }

    let totalPrice = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>单价: ¥${item.price}</p>
                <p>数量: ${item.quantity}</p>
                <p>小计: ¥${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">删除</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // 添加总计
    const totalDiv = document.createElement('div');
    totalDiv.style.cssText = 'text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold;';
    totalDiv.innerHTML = `总计: ¥${totalPrice.toFixed(2)}`;
    cartItemsContainer.appendChild(totalDiv);
}

// 设置语言切换
function setupLanguageSwitcher() {
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) return;
    
    const elementsToTranslate = document.querySelectorAll('[data-translate]');

    function setLanguage(lang) {
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    langSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });

    setLanguage('zh');
}

// 登录功能
function startShopping() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        isLoggedIn = true;
        currentUser = email;
        
        const usernameEl = document.getElementById('username');
        const loginForm = document.getElementById('login-form');
        const userProfile = document.getElementById('user-profile');
        
        if (usernameEl) usernameEl.textContent = email;
        if (loginForm) loginForm.style.display = 'none';
        if (userProfile) userProfile.style.display = 'block';
        
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
        
        alert('登录成功！');
    } else {
        alert('请输入邮箱和密码');
    }
}

// 退出登录
function logout() {
    isLoggedIn = false;
    currentUser = '';
    
    const loginForm = document.getElementById('login-form');
    const userProfile = document.getElementById('user-profile');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    
    if (loginForm) loginForm.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';
    
    // 清除登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
}

// 显示弹出框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// 关闭弹出框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 发送联系信息
function sendContact() {
    const email = document.getElementById('contact-email');
    if (email && email.value) {
        alert('感谢您的联络，我们会尽快回复！');
        closeModal('contact-us');
    } else {
        alert('请输入您的邮箱');
    }
}

// 页面跳转处理函数
function handlePageNavigation(e) {
    const target = e.target.getAttribute('href');
    if (target === '#' || target.startsWith('#')) {
        e.preventDefault();
        const modalId = target.substring(1);
        if (modalId === 'contact-us') {
            showModal('contact-us');
        }
    }
    // 其他情况允许正常跳转
}

// 点击模态框外部关闭
function setupModalClose() {
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// 导出所有功能
export {
    getProducts,
    getDefaultProducts,
    cart,
    isLoggedIn,
    currentUser,
    initCart,
    getUrlParam,
    addToCart,
    removeFromCart,
    updateCartDisplay,
    setupLanguageSwitcher,
    startShopping,
    logout,
    showModal,
    closeModal,
    sendContact,
    handlePageNavigation,
    setupModalClose
};