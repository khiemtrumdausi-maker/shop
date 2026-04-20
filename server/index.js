const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. Thêm thư viện path này
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 2. MỞ CỬA CHO TRÌNH DUYỆT TRUY CẬP ẢNH (QUAN TRỌNG)
// Dòng này giúp Khiêm xem được ảnh qua link http://localhost:3000/uploads/ten-anh.jpg
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const db = require('./config/db');

// --- CÁC ROUTE ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend TTCS đã sẵn sàng cho cả Admin và Customer!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});