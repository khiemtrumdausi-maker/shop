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
        // Tự động tạo thư mục nếu chưa có để tránh lỗi
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Đổi tên file: thời-gian-tên-gốc.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB cho ảnh
});

// --- ROUTES ---

// 1. Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// 2. Thêm sản phẩm mới (Nhận ảnh từ máy tính)
router.post('/', upload.single('Image'), productController.addProduct);

// 3. Cập nhật sản phẩm (Sửa sản phẩm - ĐÃ THÊM)
router.put('/:id', upload.single('Image'), productController.updateProduct);

// 4. Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

// 5. Lấy size và tồn kho của 1 SP cụ thể
router.get('/:id/sizes', productController.getProductSizes);

// 6. Lấy toàn bộ Size chuẩn (S, M, L, XL) để Admin chọn
router.get('/sizes/all', productController.getAllSizes);

// 7. Cập nhật số lượng tồn kho
router.post('/stock/update', productController.updateStock);

module.exports = router;