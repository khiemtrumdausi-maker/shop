// File: server/models/CategoryModel.js
const db = require('../config/db'); // Model là nơi duy nhất gọi đến db

class CategoryModel {
    // Hàm tĩnh để lấy tất cả danh mục
    static async getAll() {
        const [rows] = await db.execute('SELECT CategoryID, CategoryName FROM categories');
        return rows;
    }
}

module.exports = CategoryModel;