// File: server/models/OrderModel.js
const db = require('../config/db');

class OrderModel {
    // A. DÀNH CHO KHÁCH HÀNG: Tạo đơn hàng mới (Kèm trừ kho & Xóa giỏ)
    static async createOrder(userId, totalPrice, paymentMethod) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Tạo đơn hàng
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (UserID, TotalPrice, Status) VALUES (?, ?, "Pending")',
                [userId, totalPrice]
            );
            const orderId = orderResult.insertId;

            // 2. Lấy item trong giỏ
            const [cartItems] = await connection.execute(
                `SELECT ci.ProductID, ci.SizeID, ci.Quantity, p.Price 
                 FROM cartitems ci 
                 JOIN carts c ON ci.CartID = c.CartID 
                 JOIN products p ON ci.ProductID = p.ProductID 
                 WHERE c.UserID = ?`,
                [userId]
            );

            // 3. Lưu chi tiết đơn hàng & Trừ kho
            for (let item of cartItems) {
                await connection.execute(
                    'INSERT INTO orderdetails (OrderID, ProductID, SizeID, Quantity, Price) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.ProductID, item.SizeID, item.Quantity, item.Price]
                );

                await connection.execute(
                    'UPDATE productsize SET Stock = Stock - ? WHERE ProductID = ? AND SizeID = ?',
                    [item.Quantity, item.ProductID, item.SizeID]
                );
            }

            // 4. Tạo bản ghi thanh toán
            await connection.execute(
                'INSERT INTO payments (OrderID, PaymentMethod, Status) VALUES (?, ?, "Pending")',
                [orderId, paymentMethod]
            );

            // 5. Xóa giỏ hàng
            const [cart] = await connection.execute('SELECT CartID FROM carts WHERE UserID = ?', [userId]);
            if (cart.length > 0) {
                await connection.execute('DELETE FROM cartitems WHERE CartID = ?', [cart[0].CartID]);
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // File: server/models/OrderModel.js
static async getAllOrders() {
    const sql = `
        SELECT o.*, u.Name as CustomerName, u.Email as CustomerEmail
        FROM orders o 
        LEFT JOIN users u ON o.UserID = u.UserID 
        ORDER BY o.OrderDate DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
}

    // C. DÀNH CHO ADMIN: Cập nhật trạng thái đơn hàng
    static async updateOrderStatus(orderId, status) {
        const sql = 'UPDATE orders SET Status = ? WHERE OrderID = ?';
        const [result] = await db.execute(sql, [status, orderId]);
        return result;
    }
}

module.exports = OrderModel;