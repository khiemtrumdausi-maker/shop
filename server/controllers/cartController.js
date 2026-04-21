const CartModel = require('../models/CartModel');
const db = require('../config/db'); 

// 1. Lấy toàn bộ sản phẩm trong giỏ của User
const getCart = async (req, res) => {
    try {
        const rows = await CartModel.getCartByUserId(req.params.userId);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Fetch cart error:', error);
        res.status(500).json({ message: 'Error fetching cart data', error });
    }
};

// 2. Thêm sản phẩm vào giỏ hàng (Check Stock chuẩn DB)
const addToCart = async (req, res) => {
    const { UserID, ProductID, SizeID, Quantity } = req.body;
    
    try {
        // 1. KIỂM TRA TỒN KHO TRƯỚC (Bảng productsize, cột Stock)
        const [stockRows] = await db.execute(
            'SELECT Stock FROM productsize WHERE ProductID = ? AND SizeID = ?',
            [ProductID, SizeID]
        );

        if (stockRows.length === 0) {
            return res.status(404).json({ message: 'Product variant not found' });
        }

        const availableStock = stockRows[0].Stock;

        if (Quantity > availableStock) {
            return res.status(400).json({ 
                message: `Insufficient stock. Only ${availableStock} items left.` 
            });
        }

        // 2. GỌI MODEL THÊM VÀO GIỎ (Model đã có logic cộng dồn và check stock tổng)
        const result = await CartModel.addItem(UserID, ProductID, SizeID, Quantity);
        res.status(result.status || 200).json({ message: result.message });
        
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};

// 3. Xóa một sản phẩm khỏi giỏ
const removeCartItem = async (req, res) => {
    try {
        await CartModel.removeItem(req.params.id);
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove cart item error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// 4. Cập nhật số lượng của một sản phẩm
const updateCartItemQty = async (req, res) => {
    const { id } = req.params;
    const quantity = req.body.quantity || req.body.Quantity;

    if (quantity === undefined) {
        return res.status(400).json({ message: 'Missing quantity parameter' });
    }

    try {
        await CartModel.updateItemQuantity(id, quantity);
        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 5. Đếm tổng số lượng sản phẩm trong giỏ
const getCartCount = async (req, res) => {
    try {
        const count = await CartModel.countItems(req.params.userId);
        res.status(200).json({ count });
    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({ message: 'Error fetching cart count', error });
    }
};

module.exports = { getCart, addToCart, removeCartItem, updateCartItemQty, getCartCount };