// File: server/controllers/cartController.js
const CartModel = require('../models/CartModel');

const getCart = async (req, res) => {
    try {
        const rows = await CartModel.getCartByUserId(req.params.userId);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
    }
};

const addToCart = async (req, res) => {
    const { UserID, ProductID, SizeID, Quantity } = req.body;
    try {
        const result = await CartModel.addItem(UserID, ProductID, SizeID, Quantity);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Lỗi thêm giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ', error });
    }
};

const removeCartItem = async (req, res) => {
    try {
        await CartModel.removeItem(req.params.id);
        res.status(200).json({ message: 'Đã xóa sản phẩm' });
    } catch (error) {
        console.error('Lỗi xóa giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa', error });
    }
};

const updateCartItemQty = async (req, res) => {
    const { id } = req.params;
    const quantity = req.body.quantity || req.body.Quantity;

    if (quantity === undefined) {
        return res.status(400).json({ message: 'Thiếu số lượng Quantity' });
    }

    try {
        await CartModel.updateItemQuantity(id, quantity);
        res.status(200).json({ message: 'Đã cập nhật số lượng' });
    } catch (error) {
        console.error('Lỗi cập nhật giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật' });
    }
};

const getCartCount = async (req, res) => {
    try {
        const count = await CartModel.countItems(req.params.userId);
        res.status(200).json({ count });
    } catch (error) {
        console.error('Lỗi đếm giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi lấy số lượng giỏ hàng', error });
    }
};

module.exports = { getCart, addToCart, removeCartItem, updateCartItemQty, getCartCount };