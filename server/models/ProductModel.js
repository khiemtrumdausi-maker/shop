// File: server/models/ProductModel.js
const db = require('../config/db');

class ProductModel {
    // 1. Lấy tất cả sản phẩm
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

    // 2. Thêm sản phẩm mới
    static async add(productData) {
        const { ProductName, Price, Description, Image, Gender, CategoryID, Status } = productData;
        const sql = `
            INSERT INTO products (ProductName, Price, Description, Image, Gender, CategoryID, Status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            ProductName, Price, Description, Image, Gender, CategoryID, Status || 'Active'
        ]);
        return result;
    }

    // 3. Cập nhật toàn bộ thông tin sản phẩm
    static async update(p) {
        const sql = `
            UPDATE products 
            SET ProductName = ?, Price = ?, Description = ?, Image = ?, Gender = ?, CategoryID = ?, Status = ?
            WHERE ProductID = ?
        `;
        const [result] = await db.execute(sql, [
            p.ProductName, p.Price, p.Description, p.Image, p.Gender, p.CategoryID, p.Status, p.ProductID
        ]);
        return result;
    }

    // 4. [MỚI] Cập nhật hoặc Thêm mới số lượng tồn kho cho từng Size
    static async updateStock(productId, sizeId, stock) {
        const sql = `
            INSERT INTO productsize (ProductID, SizeID, Stock) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE Stock = VALUES(Stock)
        `;
        const [result] = await db.execute(sql, [productId, sizeId, stock]);
        return result;
    }

    // 5. Cập nhật riêng trạng thái
    static async updateStatus(id, status) {
        const sql = `UPDATE products SET Status = ? WHERE ProductID = ?`;
        const [result] = await db.execute(sql, [status, id]);
        return result;
    }

    // 6. Xóa sản phẩm
    static async delete(id) {
        const sql = 'DELETE FROM products WHERE ProductID = ?';
        const [result] = await db.execute(sql, [id]);
        return result;
    }

    // 7. Lấy size và tồn kho của sản phẩm
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