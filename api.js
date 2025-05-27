// API服务
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5001/api' 
  : '/api';

console.log('API服务地址:', API_URL);

// 获取存储的token
const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('获取到的token:', token ? `${token.substring(0, 10)}...` : 'null');
  return token;
};

// 通用请求函数
const request = async (url, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // 如果有token，添加到请求头
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    mode: 'cors',
    credentials: 'include'
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  console.log(`发起${method}请求:`, `${API_URL}${url}`, config);

  try {
    // 尝试主端口
    let response = await fetch(`${API_URL}${url}`, config);
    console.log(`请求响应状态:`, response.status, response.statusText);
    
    // 如果主端口失败，尝试备用端口
    if (!response.ok && response.status === 0) {
      console.log('主端口请求失败，尝试备用端口');
      const backupUrl = API_URL.replace(':5000', ':5001');
      response = await fetch(`${backupUrl}${url}`, config);
      console.log(`备用端口响应状态:`, response.status, response.statusText);
    }
    
    // 处理非JSON响应
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
      return { success: true };
    }
    
    const result = await response.json();
    console.log('响应数据:', result);

    if (!response.ok) {
      throw new Error(result.message || `请求失败: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// 用户相关API
const userApi = {
  // 用户注册 - 发送验证码
  sendRegisterCode: (email) => {
    return request('/users/register/sendcode', 'POST', { email });
  },

  // 用户注册 - 验证并完成注册
  verifyRegister: (email, code, password) => {
    return request('/users/register/verify', 'POST', { email, code, password });
  },

  // 用户登录
  login: (email, password) => {
    return request('/users/login', 'POST', { email, password });
  },

  // 重置密码 - 发送验证码
  sendResetCode: (email) => {
    return request('/users/reset-password/sendcode', 'POST', { email });
  },

  // 重置密码 - 验证并重置
  verifyReset: (email, code) => {
    return request('/users/reset-password/verify', 'POST', { email, code });
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return request('/users/me');
  },

  // 修改密码
  changePassword: (currentPassword, newPassword) => {
    return request('/users/change-password', 'PUT', { currentPassword, newPassword });
  }
};

// 购物车相关API
const cartApi = {
  // 获取购物车
  getCart: () => {
    return request('/cart');
  },

  // 添加商品到购物车
  addToCart: (productId, title, price, image, quantity) => {
    return request('/cart/add', 'POST', { productId, title, price, image, quantity });
  },

  // 更新购物车商品数量
  updateCartItem: (itemId, quantity) => {
    return request(`/cart/update/${itemId}`, 'PUT', { quantity });
  },

  // 从购物车删除商品
  removeFromCart: (itemId) => {
    return request(`/cart/remove/${itemId}`, 'DELETE');
  },

  // 清空购物车
  clearCart: () => {
    return request('/cart/clear', 'DELETE');
  }
};

// 地址相关API
const addressApi = {
  // 获取所有地址
  getAddresses: () => {
    return request('/address');
  },

  // 添加新地址
  addAddress: (addressData) => {
    return request('/address', 'POST', addressData);
  },

  // 更新地址
  updateAddress: (id, addressData) => {
    return request(`/address/${id}`, 'PUT', addressData);
  },

  // 删除地址
  deleteAddress: (id) => {
    return request(`/address/${id}`, 'DELETE');
  },

  // 设置默认地址
  setDefaultAddress: (id) => {
    return request(`/address/default/${id}`, 'PUT');
  }
};

// 导出API服务
export {
  userApi,
  cartApi,
  addressApi,
  getToken
}; 