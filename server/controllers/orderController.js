// File: server/controllers/orderController.js
const OrderModel = require('../models/OrderModel');

// 1. Khách hàng thực hiện đặt hàng
const checkout = async (req, res) => {
    const { UserID, TotalPrice, PaymentMethod } = req.body;
    try {
        const orderId = await OrderModel.createOrder(UserID, TotalPrice, PaymentMethod);
        res.status(201).json({ message: 'Đặt hàng thành công!', orderId });
    } catch (error) {
        console.error('Lỗi thanh toán:', error);
        res.status(500).json({ message: 'Lỗi khi thực hiện thanh toán', error: error.message });
    }
};

// 2. Admin lấy danh sách toàn bộ đơn hàng
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Lỗi lấy đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
    }
};

// 3. Admin cập nhật trạng thái (Duyệt đơn, Hủy đơn...)
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await OrderModel.updateOrderStatus(id, status);
        res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái' });
    }
};

module.exports = { checkout, getAllOrders, updateStatus };