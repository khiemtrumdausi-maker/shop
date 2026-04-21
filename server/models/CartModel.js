const db = require('../config/db');

class CartModel {
    // 1. Lấy toàn bộ sản phẩm trong giỏ của User
    static async getCartByUserId(userId) {
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
        return rows;
    }

    // 2. Logic thêm sản phẩm vào giỏ hàng (ĐÃ THÊM KIỂM TRA TỒN KHO)
    static async addItem(userId, productId, sizeId, quantity) {
        // BƯỚC 1: KIỂM TRA TỒN KHO TRƯỚC (Bảng productsize, cột Stock)
        const [stockCheck] = await db.execute(
            'SELECT Stock FROM productsize WHERE ProductID = ? AND SizeID = ?',
            [productId, sizeId]
        );
        const availableStock = stockCheck.length > 0 ? stockCheck[0].Stock : 0;

        // BƯỚC 2: Tìm Cart của User
        let [cart] = await db.execute('SELECT CartID FROM carts WHERE UserID = ?', [userId]);
        let cartId;

        if (cart.length === 0) {
            const [newCart] = await db.execute('INSERT INTO carts (UserID) VALUES (?)', [userId]);
            cartId = newCart.insertId; 
        } else {
            cartId = cart[0].CartID; 
        }
        
        // BƯỚC 3: Kiểm tra sản phẩm đã có trong giỏ chưa
        const [existingItem] = await db.execute(
            'SELECT CartItemID, Quantity FROM cartitems WHERE CartID = ? AND ProductID = ? AND SizeID = ?',
            [cartId, productId, sizeId]
        );

        const currentQuantity = existingItem.length > 0 ? existingItem[0].Quantity : 0;
        const newQuantity = currentQuantity + (quantity || 1);

        // BƯỚC 4: CHẶN NẾU VƯỢT QUÁ TỒN KHO
        if (newQuantity > availableStock) {
            return { 
                status: 400, 
                message: `Sorry, only ${availableStock} items left in stock!` 
            };
        }

        // BƯỚC 5: Cập nhật hoặc Thêm mới nếu đủ hàng
        if (existingItem.length > 0) {
            await db.execute('UPDATE cartitems SET Quantity = ? WHERE CartItemID = ?', [newQuantity, existingItem[0].CartItemID]);
            return { status: 200, message: 'Quantity updated successfully!' };
        } else {
            await db.execute(
                'INSERT INTO cartitems (CartID, ProductID, SizeID, Quantity) VALUES (?, ?, ?, ?)',
                [cartId, productId, sizeId, quantity || 1]
            );
            return { status: 201, message: 'Added to cart successfully!' };
        }
    }

    // 3. Xóa một sản phẩm khỏi giỏ
    static async removeItem(cartItemId) {
        const [result] = await db.execute('DELETE FROM cartitems WHERE CartItemID = ?', [cartItemId]);
        return result;
    }

    // 4. Cập nhật số lượng của một sản phẩm
    static async updateItemQuantity(cartItemId, quantity) {
        const [result] = await db.execute('UPDATE cartitems SET Quantity = ? WHERE CartItemID = ?', [quantity, cartItemId]);
        return result;
    }

    // 5. Đếm tổng số lượng sản phẩm trong giỏ
    static async countItems(userId) {
        const sql = `
            SELECT SUM(ci.Quantity) as total 
            FROM carts c 
            JOIN cartitems ci ON c.CartID = ci.CartID
            WHERE c.UserID = ?
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows[0].total || 0;
    }

    // 6. Xóa sạch giỏ hàng (Dùng sau khi thanh toán thành công)
    static async clearCartByUserId(userId) {
        const sql = `
            DELETE ci FROM cartitems ci 
            JOIN carts c ON ci.CartID = c.CartID 
            WHERE c.UserID = ?
        `;
        const [result] = await db.execute(sql, [userId]);
        return result;
    }
}

module.exports = CartModel;