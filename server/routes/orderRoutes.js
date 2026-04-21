const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// --- DÀNH CHO KHÁCH HÀNG ---
router.post('/checkout', orderController.checkout); 
router.get('/user/:userId', orderController.getUserOrders); 

// --- DÀNH CHO ADMIN ---
router.get('/', orderController.getAllOrders); 

// 5. LẤY CHI TIẾT SẢN PHẨM TRONG ĐƠN (Phải có dòng này nút View mới chạy)
router.get('/:id/details', orderController.getOrderDetails); 

// --- CHUNG ---
router.put('/:id/status', orderController.updateStatus);

module.exports = router;