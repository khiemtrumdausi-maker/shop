const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Mở API GET /api/categories
router.get('/', categoryController.getCategories);

// CỰC KỲ QUAN TRỌNG: Lỗi "app.use()" lúc nãy là do thiếu dòng này đó!
module.exports = router;