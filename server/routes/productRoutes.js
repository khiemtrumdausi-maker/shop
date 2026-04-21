const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- CẤU HÌNH MULTER ĐỂ UPLOAD ẢNH ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

// --- ROUTES ---

// 1. Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// 2. Thêm sản phẩm mới
router.post('/', upload.single('Image'), productController.addProduct);

// 3. Cập nhật sản phẩm (Toàn bộ thông tin)
router.put('/:id', upload.single('Image'), productController.updateProduct);

// 4. [MỚI] Đổi trạng thái nhanh (Chỉ cập nhật Status)
router.patch('/:id/status', productController.toggleStatus);

// 5. Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

// 6. Lấy size và tồn kho của 1 SP cụ thể
router.get('/:id/sizes', productController.getProductSizes);

// 7. Lấy toàn bộ Size chuẩn (S, M, L, XL)
router.get('/sizes/all', productController.getAllSizes);

// 8. Cập nhật số lượng tồn kho (Dùng cho Modal Box cập nhật nhiều size)
router.post('/stock/update', productController.updateStock);

module.exports = router;