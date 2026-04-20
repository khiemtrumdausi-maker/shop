const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- Routes cho Khách hàng ---
router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/update/:id', authController.updateUser);

// --- Routes cho Admin Quản lý User (THÊM 2 DÒNG NÀY) ---
router.get('/users', authController.getAllUsers);        // Lấy danh sách để hiện lên bảng
router.delete('/users/:id', authController.deleteUser);   // Xóa user khi bấm nút thùng rác

module.exports = router;