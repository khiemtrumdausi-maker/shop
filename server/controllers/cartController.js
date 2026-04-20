const db = require('../config/db');

// 1. Lấy giỏ hàng (Đã thêm LEFT JOIN để lấy Stock)
const getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const sql = `
            SELECT ci.CartItemID, p.ProductID, p.ProductName, p.Price, p.Image, 
                   s.SizeName, ci.Quantity, ps.Stock
            FROM carts c
            JOIN cartitems ci ON c.CartID = ci.CartID
            JOIN products p ON ci.ProductID = p.ProductID
            JOIN sizes s ON ci.SizeID = s.SizeID
            LEFT JOIN productsize ps ON p.ProductID = ps.ProductID AND s.SizeID = ps.SizeID
            WHERE c.UserID = ?
        `;
        const [rows] = await db.execute(sql, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
    }
};

// 2. Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const { UserID, ProductID, SizeID, Quantity } = req.body;
    try {
        let [cart] = await db.execute('SELECT CartID FROM carts WHERE UserID = ?', [UserID]);
        let cartId;

        if (cart.length === 0) {
            const [newCart] = await db.execute('INSERT INTO carts (UserID) VALUES (?)', [UserID]);
            cartId = newCart.insertId; 
        } else {
            cartId = cart[0].CartID; 
        }
        
        const [existingItem] = await db.execute(
            'SELECT CartItemID, Quantity FROM cartitems WHERE CartID = ? AND ProductID = ? AND SizeID = ?',
            [cartId, ProductID, SizeID]
        );

        if (existingItem.length > 0) {
            const newQuantity = existingItem[0].Quantity + (Quantity || 1);
            await db.execute('UPDATE cartitems SET Quantity = ? WHERE CartItemID = ?', [newQuantity, existingItem[0].CartItemID]);
            res.status(200).json({ message: 'Đã cập nhật số lượng!' });
        } else {
            await db.execute(
                'INSERT INTO cartitems (CartID, ProductID, SizeID, Quantity) VALUES (?, ?, ?, ?)',
                [cartId, ProductID, SizeID, Quantity || 1]
            );
            res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ', error });
    }
};

// 3. Xóa món hàng
const removeCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM cartitems WHERE CartItemID = ?', [id]);
        res.status(200).json({ message: 'Đã xóa sản phẩm' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa', error });
    }
};

// 4. CẬP NHẬT SỐ LƯỢNG (ĐÃ FIX LỖI VIẾT HOA/THƯỜNG)
const updateCartItemQty = async (req, res) => {
    const { id } = req.params;
    // Chấp nhận cả Quantity (hoa) và quantity (thường) để tránh lỗi Frontend
    const quantity = req.body.quantity || req.body.Quantity;

    try {
        if (quantity === undefined) {
            return res.status(400).json({ message: 'Thiếu số lượng Quantity' });
        }

        await db.execute('UPDATE cartitems SET Quantity = ? WHERE CartItemID = ?', [quantity, id]);
        res.status(200).json({ message: 'Đã cập nhật số lượng' });
    } catch (error) {
        console.error('Lỗi cập nhật giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật' });
    }
};

// 5. Lấy tổng số lượng sản phẩm
const getCartCount = async (req, res) => {
    const { userId } = req.params;
    try {
        const sql = `
            SELECT SUM(ci.Quantity) as total 
            FROM carts c 
            JOIN cartitems ci ON c.CartID = ci.CartID 
            WHERE c.UserID = ?
        `;
        const [rows] = await db.execute(sql, [userId]);
        res.status(200).json({ count: rows[0].total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy số lượng giỏ hàng', error });
    }
};

module.exports = { getCart, addToCart, removeCartItem, updateCartItemQty, getCartCount };