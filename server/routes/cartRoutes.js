const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Đếm số lượng sản phẩm trong giỏ (dùng cho icon Navbar)
router.get('/count/:userId', cartController.getCartCount);

// Lấy toàn bộ giỏ hàng của user
router.get('/:userId', cartController.getCart);

// Thêm sản phẩm vào giỏ
router.post('/add', cartController.addToCart);

// Cập nhật số lượng (+ / -)
router.put('/update/:id', cartController.updateCartItemQty);

// Xóa 1 sản phẩm khỏi giỏ
router.delete('/remove/:id', cartController.removeCartItem);

module.exports = router;