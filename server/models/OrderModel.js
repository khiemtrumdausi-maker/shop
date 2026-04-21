const db = require('../config/db');

class OrderModel {
    // 1. TẠO ĐƠN HÀNG (GIỮ NGUYÊN LOGIC CŨ)
    static async createOrder(userId, totalPrice, paymentMethod) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const [orderResult] = await connection.execute(
                `INSERT INTO orders (UserID, TotalPrice, Status) VALUES (?, ?, "Pending")`,
                [userId, totalPrice]
            );
            const orderId = orderResult.insertId;

            const [cartItems] = await connection.execute(
                `SELECT ci.ProductID, ci.SizeID, ci.Quantity, p.Price 
                 FROM cartitems ci 
                 JOIN carts c ON ci.CartID = c.CartID 
                 JOIN products p ON ci.ProductID = p.ProductID 
                 WHERE c.UserID = ?`,
                [userId]
            );

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

            await connection.execute(
                'INSERT INTO payments (OrderID, PaymentMethod, Status) VALUES (?, ?, "Pending")',
                [orderId, paymentMethod]
            );

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

    // 2. LẤY DANH SÁCH CHO ADMIN (Sửa Alias để chắc chắn bốc được dữ liệu)
    static async getAllOrders() {
        const sql = `
            SELECT 
                o.*, 
                u.Name as CustomerName, 
                u.Phone as CustomerPhone, 
                u.Address as CustomerAddress,
                u.Email as UserEmail
            FROM orders o 
            LEFT JOIN users u ON o.UserID = u.UserID 
            ORDER BY o.OrderDate DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 3. LẤY CHI TIẾT SẢN PHẨM (GIỮ NGUYÊN IMAGE PATH CỦA KHIÊM)
    static async getOrderDetails(orderId) {
        const sql = `
            SELECT 
                od.*, 
                p.ProductName, 
                p.Image as ImagePath, 
                s.SizeName
            FROM orderdetails od
            JOIN products p ON od.ProductID = p.ProductID
            LEFT JOIN sizes s ON od.SizeID = s.SizeID
            WHERE od.OrderID = ?
        `;
        const [rows] = await db.execute(sql, [orderId]);
        return rows;
    }

    // 4. HỦY ĐƠN HÀNG (GIỮ NGUYÊN)
    static async cancelAndRestock(orderId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const [items] = await connection.execute(
                'SELECT ProductID, SizeID, Quantity FROM orderdetails WHERE OrderID = ?',
                [orderId]
            );

            await connection.execute('UPDATE orders SET Status = "Cancelled" WHERE OrderID = ?', [orderId]);

            for (let item of items) {
                await connection.execute(
                    'UPDATE productsize SET Stock = Stock + ? WHERE ProductID = ? AND SizeID = ?',
                    [item.Quantity, item.ProductID, item.SizeID]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 5. CẬP NHẬT TRẠNG THÁI (GIỮ NGUYÊN)
    static async updateOrderStatus(orderId, status) {
        return await db.execute('UPDATE orders SET Status = ? WHERE OrderID = ?', [status, orderId]);
    }

    // 6. LỊCH SỬ CHO KHÁCH (Sửa u.name -> u.Name cho khớp DB)
    static async getByUserId(userId) {
        const sql = `
            SELECT 
                o.*, 
                u.Name as CustomerName, 
                u.Phone as CustomerPhone, 
                u.Address as CustomerAddress
            FROM orders o 
            LEFT JOIN users u ON o.UserID = u.UserID 
            WHERE o.UserID = ? 
            ORDER BY o.OrderDate DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }
}

module.exports = OrderModel;