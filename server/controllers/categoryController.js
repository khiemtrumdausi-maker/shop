const db = require('../config/db'); // Đường dẫn gọi DB của bạn

// Hàm lấy tất cả danh mục từ bảng `categories`
const getCategories = async (req, res) => {
    try {
        // Gọi chính xác 2 cột trong file SQL bạn gửi
        const [rows] = await db.execute('SELECT CategoryID, CategoryName FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
    }
};

// CỰC KỲ QUAN TRỌNG: Bắt buộc phải export hàm này ra
module.exports = { getCategories };