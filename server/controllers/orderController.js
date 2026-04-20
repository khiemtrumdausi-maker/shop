const db = require('../config/db');

const checkout = async (req, res) => {
    const { UserID, TotalPrice, PaymentMethod } = req.body;

    try {
        // 1. Tạo đơn hàng mới trong bảng orders
        const [orderResult] = await db.execute(
            'INSERT INTO orders (UserID, TotalPrice, Status) VALUES (?, ?, "Pending")',
            [UserID, TotalPrice]
        );
        const orderId = orderResult.insertId;

        // 2. Lấy toàn bộ item trong giỏ của User để chuyển sang orderdetails
        const [cartItems] = await db.execute(
            'SELECT ci.ProductID, ci.SizeID, ci.Quantity, p.Price FROM cartitems ci JOIN carts c ON ci.CartID = c.CartID JOIN products p ON ci.ProductID = p.ProductID WHERE c.UserID = ?',
            [UserID]
        );

        for (let item of cartItems) {
            await db.execute(
                'INSERT INTO orderdetails (OrderID, ProductID, SizeID, Quantity, Price) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.ProductID, item.SizeID, item.Quantity, item.Price]
            );
        }

        // 3. Tạo bản ghi thanh toán trong bảng payments
        await db.execute(
            'INSERT INTO payments (OrderID, PaymentMethod, Status) VALUES (?, ?, "Pending")',
            [orderId, PaymentMethod]
        );

        // 4. Xóa toàn bộ giỏ hàng sau khi đã thanh toán thành công
        const [cart] = await db.execute('SELECT CartID FROM carts WHERE UserID = ?', [UserID]);
        await db.execute('DELETE FROM cartitems WHERE CartID = ?', [cart[0].CartID]);

        res.status(201).json({ message: 'Đặt hàng thành công!', orderId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thực hiện thanh toán', error });
    }
};

module.exports = { checkout };
