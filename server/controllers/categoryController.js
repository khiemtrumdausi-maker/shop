// File: server/controllers/categoryController.js
const CategoryModel = require('../models/CategoryModel'); // Import Model thay vì gọi trực tiếp DB

const getCategories = async (req, res) => {
    try {
        // Controller chỉ ra lệnh cho Model đi lấy dữ liệu
        const categories = await CategoryModel.getAll();
        
        // Sau đó trả kết quả về cho Frontend
        res.status(200).json(categories);
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
    }
};

module.exports = { getCategories };