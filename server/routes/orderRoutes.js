const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/checkout', orderController.checkout);     // Khách đặt hàng
router.get('/all', orderController.getAllOrders);       // Admin xem đơn
router.put('/:id/status', orderController.updateStatus); // Admin duyệt đơn

module.exports = router;