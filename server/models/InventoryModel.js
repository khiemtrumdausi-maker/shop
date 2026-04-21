const db = require('../config/db');

class InventoryModel {
    // 1. Cập nhật số lượng tồn kho (Thêm mới hoặc cập nhật nếu đã tồn tại)
    static async updateStock(productId, sizeId, stock) {
        const sql = `
            INSERT INTO productsize (ProductID, SizeID, Stock) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE Stock = VALUES(Stock)
        `;
        const [result] = await db.execute(sql, [productId, sizeId, stock]);
        return result;
    }

    // 2. Lấy tình trạng kho hàng của một sản phẩm (Đã thêm SizeID để sếp dễ dùng ở FE)
    static async getStockByProduct(productId) {
        const sql = `
            SELECT ps.SizeID, s.SizeName, ps.Stock 
            FROM productsize ps
            JOIN sizes s ON ps.SizeID = s.SizeID
            WHERE ps.ProductID = ?
        `;
        const [rows] = await db.execute(sql, [productId]);
        return rows;
    }
}

module.exports = InventoryModel;