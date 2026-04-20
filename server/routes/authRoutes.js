const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/update/:id', authController.updateUser); // Thêm dòng này

module.exports = router;