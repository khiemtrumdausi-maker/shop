const OrderModel = require('../models/OrderModel');

// 1. Checkout
const checkout = async (req, res) => {
    const { UserID, TotalPrice, PaymentMethod } = req.body;
    try {
        const orderId = await OrderModel.createOrder(UserID, TotalPrice, PaymentMethod);
        res.status(201).json({ message: 'Order placed successfully!', orderId });
    } catch (error) {
        console.error('❌ Checkout Error:', error.message); // In lỗi ra terminal
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
};

// 2. Get Order Details (HÀM NÀY ĐANG BỊ LỖI 500 TRÊN MÀN HÌNH CỦA KHIÊM)
const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const details = await OrderModel.getOrderDetails(id);
        res.status(200).json(details);
    } catch (error) {
        // Dòng này cực kỳ quan trọng để Khiêm check Terminal xem sai ở đâu (sai tên bảng hay tên cột)
        console.error('❌ SQL Query Error in getOrderDetails:', error.message); 
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message // Trả về cả message lỗi để debug cho nhanh
        });
    }
};

// 3. Get User History
const getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await OrderModel.getByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error('❌ Get User Orders Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

// 4. Admin Get All
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('❌ Get All Orders Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// 5. Update Status
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (status === 'Cancelled') {
            await OrderModel.cancelAndRestock(id);
            res.status(200).json({ message: 'Order cancelled and restocked!' });
        } else {
            await OrderModel.updateOrderStatus(id, status);
            res.status(200).json({ message: `Status updated to ${status}` });
        }
    } catch (error) {
        console.error('❌ Update Status Error:', error.message);
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
};

module.exports = { 
    checkout, 
    getOrderDetails, 
    getUserOrders, 
    getAllOrders, 
    updateStatus 
};