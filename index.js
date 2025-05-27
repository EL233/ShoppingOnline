// 全局变量
let currentSlide = 0;
let slideInterval;
let isLoggedIn = false;
let currentUser = '';
let cart = [];

// 商品数据
const products = [
    { id: 1, title: '可爱路飞', image: 'images/101397084_p0_square1200.jpg', price: 2999.9, description: '路飞尼卡形态，可暴打凯多！' },
    { id: 2, title: '老八抢饮料', image: 'images/f767c55c48c62b6af23f72256d7b627e397706516.jpg@1256w_1468h_!web-article-pic.avif', price: 199.9, description: '可获得老八喝过的饮料一瓶！' },
    { id: 3, title: '赛博朋克边缘行者', image: 'images/57e8439ddee7e6e5dbb0a67697e944b4339022381.jpg', price: 899.9, description: '我们月球上见吧' },
    { id: 4, title: '老八的笑容', image: 'images/d20b189a4eeec78920d824826cc2ed42397706516.jpg@1256w_1570h_!web-article-pic.avif', price: 89.9, description: '老八珍贵的笑容写真一张！' },
    { id: 5, title: '幼驯染三人组', image: 'images/AceSaboandLuffy.jpeg', price: 799.9, description: '最好的三人组！' },
    { id: 6, title: '孤独摇滚', image: 'images/bba0492b82e2b25e94ed955693d3ac4791611f31.png', price: 99.9, description: '最好的乐队照一张！' },
    { id: 7, title: '明日香', image: 'images/9ab9fe29ea2d01154bb43014c27c94d73031d44b.jpg', price: 9999.9, description: '明日香送的情人节巧克力一盒！' },
    { id: 8, title: '真嗣君', image: 'images/7fe1a3eeed71c17087e31619f73a5128e5350363.jpg', price: 999.9, description: '真嗣君写真一张' },
    { id: 9, title: '雨', image: 'images/899088d54481526378bfcc0a71243d44f56a160c.jpg', price: 9999.9, description: '明日香下雨壁纸一张' },
    { id: 10, title: '我们的乐队', image: 'images/bc3350af00b183a196571b2df898fc1fb2a84cb6.jpg', price: 39.9, description: '最好的波奇酱舞台照一张' }
];

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

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    loadProducts();
    setupLanguageSwitcher();
    loadCartItems();
    // 给导航链接添加点击事件
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', handlePageNavigation);
    });
});

// 设置语言切换
function setupLanguageSwitcher() {
    const langSelect = document.getElementById('lang-select');
    const elementsToTranslate = document.querySelectorAll('[data-translate]');

    function setLanguage(lang) {
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    langSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });

    setLanguage('zh');
}

// 初始化轮播图
function initSlider() {
    const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.dots span');
    const arrowLeft = document.querySelector('.arrow-l');
    const arrowRight = document.querySelector('.arrow-r');
    const banner = document.querySelector('.banner');

    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 25}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % 4;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + 4) % 4;
        updateSlider();
    }

    arrowRight.addEventListener('click', nextSlide);
    arrowLeft.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // 自动轮播
    slideInterval = setInterval(nextSlide, 3000);

    banner.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    banner.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 3000);
    });

    updateSlider();
}

// 加载商品
function loadProducts() {
    const productSection = document.getElementById('product-section');
    productSection.innerHTML = '';

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
        `;
        // 修改为跳转到商品详情页，并传递商品ID
        item.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        productSection.appendChild(item);
    });
}


// 显示弹出框
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// 关闭弹出框
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 登录功能
function startShopping() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        isLoggedIn = true;
        currentUser = email;
        document.getElementById('username').textContent = email;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        alert('登录成功！');
    } else {
        alert('请输入邮箱和密码');
    }
}

// 退出登录
function logout() {
    isLoggedIn = false;
    currentUser = '';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('user-profile').style.display = 'none';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// 注册下一步
function nextStep() {
    const email = document.getElementById('register-email').value;
    if (email) {
        alert('注册邮件已发送到 ' + email);
    } else {
        alert('请输入邮箱或手机号码');
    }
}

// 重置密码
function resetPasswordAction() {
    const email = document.getElementById('reset-email').value;
    if (email) {
        alert('重置密码邮件已发送到 ' + email);
        showPage('personal-center');
    } else {
        alert('请输入邮箱或手机号码');
    }
}

// 发送联系信息
function sendContact() {
    const email = document.getElementById('contact-email').value;
    if (email) {
        alert('感谢您的联络，我们会尽快回复！');
        closeModal('contact-us');
    } else {
        alert('请输入您的邮箱');
    }
}

// 搜索商品
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    
    if (searchTerm.length === 0) {
        resultsContainer.innerHTML = '';
        return;
    }

    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );

    resultsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #666; margin-top: 20px;">未找到相关商品</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div>
                <h4>${product.title}</h4>
                <p>¥${product.price}</p>
            </div>
        `;
        item.addEventListener('click', () => showProductDetail(product.id));
        resultsContainer.appendChild(item);
    });
}

// 显示商品详情
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-detail-image').src = product.image;
    document.getElementById('product-detail-name').textContent = product.title;
    document.getElementById('product-detail-price').textContent = `¥${product.price}`;
    document.getElementById('product-detail-description').textContent = product.description;

    // 存储当前商品ID
    window.currentProductId = productId;
    
    showPage('product-detail');
}

// 添加到购物车
function addToCart() {
    if (!window.currentProductId) return;
    
    const product = products.find(p => p.id === window.currentProductId);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    
    addToCart(product.id, quantity); // 调用 core.js 中的 addToCart 函数
}

// 立即购买
function buyNow() {
    addToCart();
    showPage('shopping-cart');
}

// 更新购物车显示
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    
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

// 从购物车移除商品
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// 加载购物车商品
function loadCartItems() {
    updateCartDisplay();
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 在 index.js 中添加页面跳转处理函数
function handlePageNavigation(e) {
    e.preventDefault(); // 阻止默认跳转
    const target = e.target.getAttribute('href').substring(1); // 获取目标页面ID
    if (target === 'contact-us') {
        showModal(target); // 显示联系我们弹窗
    } else {
        showPage(target); // 显示对应页面
    }
    
    // 隐藏搜索结果（如果有的话）
    if(target !== 'search') {
        document.getElementById('search-results').innerHTML = '';
    }
}
// 页面跳转处理函数
function handlePageNavigation(e) {
    e.preventDefault(); // 阻止默认跳转
    const target = e.target.getAttribute('href');
    if (target === '#contact-us') {
        showModal('contact-us'); // 显示联系我们弹窗
    } else {
        window.location.href = target; // 跳转到新页面
    }
}
// 在index.js中添加以下代码

// 初始化购物车数据
function initCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// 更新购物车数据到localStorage
function updateCartDisplay() {
    // 原有更新购物车显示逻辑
    // ...
    
    // 保存到localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// 初始化登录状态
function initLoginStatus() {
    const savedStatus = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedStatus === 'true' && savedUser) {
        isLoggedIn = true;
        currentUser = savedUser;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        document.getElementById('username').textContent = currentUser;
    }
}

// 更新登录状态
function startShopping() {
    // 原有登录逻辑
    // ...
    
    // 保存到localStorage
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('currentUser', currentUser);
}

function logout() {
    // 原有登出逻辑
    // ...
    
    // 从localStorage移除
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
}

// 在DOMContentLoaded事件中调用初始化函数
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    loadProducts();
    setupLanguageSwitcher();
    initCart();
    initLoginStatus();
    loadCartItems();
    
    // 初始化导航链接
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', handlePageNavigation);
    });
});