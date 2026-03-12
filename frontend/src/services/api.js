import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Auto-attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);

// Products
export const getProducts    = (params) => API.get('/products', { params });
export const getProductById = (id)     => API.get(`/products/${id}`);
export const createProduct  = (data)   => API.post('/products', data);
export const updateProduct  = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct  = (id)     => API.delete(`/products/${id}`);

// Orders
export const placeOrder    = (data) => API.post('/orders', data);
export const getMyOrders   = ()     => API.get('/orders/me');
export const getAllOrders   = ()     => API.get('/orders');
export const updateStatus  = (id, status) => API.put(`/orders/${id}/status`, { status });

export default API;