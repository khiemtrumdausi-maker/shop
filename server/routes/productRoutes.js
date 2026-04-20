const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route cũ của bạn
router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);
router.delete('/:id', productController.deleteProduct);

// ROUTE MỚI: Gọi api lấy size
router.get('/:id/sizes', productController.getProductSizes);

module.exports = router;