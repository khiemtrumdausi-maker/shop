// File: server/models/ProductModel.js
const db = require('../config/db');

class ProductModel {
    // 1. Lấy tất cả sản phẩm (Giữ nguyên JOIN để lấy CategoryName)
    static async getAll() {
        const sql = `
            SELECT p.*, c.CategoryName 
            FROM products p 
            LEFT JOIN categories c ON p.CategoryID = c.CategoryID
            ORDER BY p.ProductID DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 2. Thêm sản phẩm mới (ĐÃ CẬP NHẬT STATUS)
    static async add(productData) {
        const { ProductName, Price, Description, Image, Gender, CategoryID, Status } = productData;
        
        // Thêm Status vào câu lệnh INSERT (Tổng cộng 7 dấu ?)
        const sql = `
            INSERT INTO products (ProductName, Price, Description, Image, Gender, CategoryID, Status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.execute(sql, [
            ProductName, 
            Price, 
            Description, 
            Image, 
            Gender, 
            CategoryID, 
            Status || 'Active' // Mặc định là Active nếu không gửi từ Frontend
        ]);
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