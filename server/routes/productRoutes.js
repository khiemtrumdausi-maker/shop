const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 1. Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// 2. Thêm sản phẩm mới
router.post('/', productController.addProduct);

// 3. Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

// 4. Lấy size và tồn kho của 1 sản phẩm cụ thể (Dùng cho khách xem hàng)
router.get('/:id/sizes', productController.getProductSizes);

// =================== ROUTE MỚI CHO ADMIN ===================

// 5. Lấy danh sách toàn bộ Size chuẩn (S, M, L, XL) để Admin chọn
router.get('/sizes/all', productController.getAllSizes);

// 6. Cập nhật số lượng tồn kho (Nhập hàng)
router.post('/stock/update', productController.updateStock);

module.exports = router;