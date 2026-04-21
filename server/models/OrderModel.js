const db = require('../config/db');

class OrderModel {
    // 1. TẠO ĐƠN HÀNG (Transaction: Tạo đơn + Trừ kho + Xóa giỏ)
    // Nâng cấp nhẹ: Thêm tham số items để hỗ trợ Buy Now mà không hỏng logic Cart
    static async createOrder(userId, totalPrice, directItems = null) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            // Tạo đơn hàng chính
            const [orderResult] = await connection.execute(
                `INSERT INTO orders (UserID, TotalPrice, Status) VALUES (?, ?, "Pending")`,
                [userId, totalPrice]
            );
            const orderId = orderResult.insertId;

            let itemsToProcess = [];

            // Nếu có directItems (Buy Now) thì dùng luôn, không thì mới bốc từ giỏ hàng
            if (directItems && directItems.length > 0) {
                itemsToProcess = directItems;
            } else {
                // Lấy các sản phẩm từ giỏ hàng để đưa vào đơn hàng
                const [cartItems] = await connection.execute(
                    `SELECT ci.ProductID, ci.SizeID, ci.Quantity, p.Price 
                     FROM cartitems ci 
                     JOIN carts c ON ci.CartID = c.CartID 
                     JOIN products p ON ci.ProductID = p.ProductID 
                     WHERE c.UserID = ?`,
                    [userId]
                );
                itemsToProcess = cartItems;
            }

            if (itemsToProcess.length === 0) throw new Error("Cart is empty");

            for (let item of itemsToProcess) {
                // KIỂM TRA TỒN KHO THỰC TẾ (Khớp chuẩn bảng productsize, cột Stock)
                const [stockCheck] = await connection.execute(
                    'SELECT Stock FROM productsize WHERE ProductID = ? AND SizeID = ?',
                    [item.ProductID, item.SizeID]
                );

                if (stockCheck.length === 0 || stockCheck[0].Stock < item.Quantity) {
                    throw new Error(`Insufficient stock for Product ID: ${item.ProductID}`);
                }

                // Lưu chi tiết từng sản phẩm vào đơn hàng
                await connection.execute(
                    'INSERT INTO orderdetails (OrderID, ProductID, SizeID, Quantity, Price) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.ProductID, item.SizeID, item.Quantity, item.Price]
                );

                // TRỪ KHO (Khớp chuẩn bảng productsize, cột Stock)
                await connection.execute(
                    'UPDATE productsize SET Stock = Stock - ? WHERE ProductID = ? AND SizeID = ?',
                    [item.Quantity, item.ProductID, item.SizeID]
                );
            }

            // Ghi nhận thanh toán mặc định là COD
            await connection.execute(
                'INSERT INTO payments (OrderID, PaymentMethod, Status) VALUES (?, "Cash on Delivery", "Pending")',
                [orderId]
            );

            // CHỈ XÓA GIỎ HÀNG NẾU LÀ THANH TOÁN TỪ GIỎ (Không phải Buy Now)
            if (!directItems) {
                await connection.execute(
                    'DELETE ci FROM cartitems ci JOIN carts c ON ci.CartID = c.CartID WHERE c.UserID = ?',
                    [userId]
                );
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

    // 2. LẤY DANH SÁCH CHO ADMIN
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

    // 3. LẤY CHI TIẾT SẢN PHẨM TRONG ĐƠN
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

    // 4. HỦY ĐƠN HÀNG VÀ HOÀN LẠI KHO
    static async cancelAndRestock(orderId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const [items] = await connection.execute(
                'SELECT ProductID, SizeID, Quantity FROM orderdetails WHERE OrderID = ?',
                [orderId]
            );

            await connection.execute('UPDATE orders SET Status = "Cancelled" WHERE OrderID = ?', [orderId]);
            await connection.execute('UPDATE payments SET Status = "Failed" WHERE OrderID = ?', [orderId]);

            for (let item of items) {
                // Hoàn lại số lượng vào kho (Khớp chuẩn bảng productsize, cột Stock)
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

    // 5. CẬP NHẬT TRẠNG THÁI
    static async updateOrderStatus(orderId, status) {
        await db.execute('UPDATE orders SET Status = ? WHERE OrderID = ?', [status, orderId]);

        if (status === 'Delivered') {
            await db.execute(
                `UPDATE payments 
                 SET Status = "Completed", PaymentDate = NOW() 
                 WHERE OrderID = ?`,
                [orderId]
            );
        }
        return true;
    }

    // 6. LỊCH SỬ ĐƠN HÀNG CỦA KHÁCH
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

    // 7. LẤY TOP SẢN PHẨM BÁN CHẠY NHẤT
    static async getTopSelling() {
        const sql = `
            SELECT 
                p.ProductID, 
                p.ProductName, 
                p.Image, 
                SUM(od.Quantity) as TotalSold, 
                SUM(od.Quantity * od.Price) as TotalRevenue
            FROM orderdetails od
            JOIN orders o ON od.OrderID = o.OrderID
            JOIN products p ON od.ProductID = p.ProductID
            WHERE o.Status = 'Delivered' OR o.Status = 'Completed'
            GROUP BY p.ProductID, p.ProductName, p.Image
            ORDER BY TotalSold DESC
            LIMIT 4
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = OrderModel;