const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = require('./config/db');

// --- CÁC ROUTE ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Mới
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Thêm dòng này

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); // Kích hoạt API Giỏ hàng
app.use('/api/categories', categoryRoutes); // Thêm dòng này

app.get('/', (req, res) => {
  res.send('🚀 Backend TTCS đã sẵn sàng cho cả Admin và Customer!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});

