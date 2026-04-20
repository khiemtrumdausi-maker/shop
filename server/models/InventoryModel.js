// File: server/models/InventoryModel.js
const db = require('../config/db');

class InventoryModel {
    // 1. Cập nhật số lượng tồn kho cho một size cụ thể của sản phẩm
    static async updateStock(productId, sizeId, stock) {
        const sql = `
            INSERT INTO productsize (ProductID, SizeID, Stock) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE Stock = VALUES(Stock)
        `;
        const [result] = await db.execute(sql, [productId, sizeId, stock]);
        return result;
    }

    // 2. Lấy tình trạng kho hàng của một sản phẩm
    static async getStockByProduct(productId) {
        const sql = `
            SELECT s.SizeName, ps.Stock 
            FROM productsize ps
            JOIN sizes s ON ps.SizeID = s.SizeID
            WHERE ps.ProductID = ?
        `;
        const [rows] = await db.execute(sql, [productId]);
        return rows;
    }
}

module.exports = InventoryModel;