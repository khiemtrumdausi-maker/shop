const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. MỞ CỬA CHO TRÌNH DUYỆT TRUY CẬP ẢNH
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const db = require('./config/db');

// 2. IMPORT CÁC ROUTE
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const aiController = require('./controllers/aiController'); // <-- THÊM DÒNG NÀY

// 3. KHAI BÁO SỬ DỤNG ROUTE (Gom lại cho dễ quản lý)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.post('/api/ai/chat', aiController.chatWithAI);

// Route mặc định kiểm tra server
app.get('/', (req, res) => {
  res.send('🚀 Backend TTCS đã sẵn sàng cho cả Admin và Customer!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});