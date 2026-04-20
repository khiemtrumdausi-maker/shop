// File: server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/checkout', orderController.checkout); 
router.get('/', orderController.getAllOrders); // SỬA CHỖ NÀY: Bỏ chữ 'all', chỉ để dấu '/'
router.put('/:id/status', orderController.updateStatus);

module.exports = router;