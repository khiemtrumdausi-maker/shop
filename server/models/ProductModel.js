// File: server/models/ProductModel.js
const db = require('../config/db');

class ProductModel {
    // 1. Lấy tất cả sản phẩm
    static async getAll() {
        const sql = `
            SELECT p.*, c.CategoryName 
            FROM products p 
            LEFT JOIN categories c ON p.CategoryID = c.CategoryID
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 2. Thêm sản phẩm mới
    static async add(productData) {
        const { ProductName, Price, Description, Image, Gender, CategoryID } = productData;
        const sql = 'INSERT INTO products (ProductName, Price, Description, Image, Gender, CategoryID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [ProductName, Price, Description, Image, Gender, CategoryID]);
        return result;
    }

    // 3. Xóa sản phẩm
    static async delete(id) {
        const sql = 'DELETE FROM products WHERE ProductID = ?';
        const [result] = await db.execute(sql, [id]);
        return result;
    }

    // 4. Lấy size và tồn kho của sản phẩm
    static async getSizes(productId) {
        const query = `
            SELECT s.SizeID, s.SizeName, IFNULL(ps.Stock, 0) AS Stock 
            FROM sizes s 
            LEFT JOIN productsize ps ON s.SizeID = ps.SizeID AND ps.ProductID = ?
            ORDER BY s.SizeID ASC
        `;
        const [rows] = await db.execute(query, [productId]);
        return rows;
    }
}

module.exports = ProductModel;