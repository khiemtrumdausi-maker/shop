const OrderModel = require('../models/OrderModel');
const CartModel = require('../models/CartModel'); 

// 1. Checkout (Thanh toán đơn hàng)
const checkout = async (req, res) => {
    const { UserID, TotalPrice } = req.body;
    try {
        // Hàm này sẽ thực hiện: Tạo đơn, Trừ kho trong bảng productsize, và Xóa giỏ hàng
        const orderId = await OrderModel.createOrder(UserID, TotalPrice);
        
        res.status(201).json({ 
            message: 'Order placed successfully! Stock has been updated.', 
            orderId 
        });
    } catch (error) {
        console.error('❌ Checkout Error:', error.message);
        
        // Kiểm tra nếu lỗi trả về có liên quan đến "stock" (hết hàng) thì trả về code 400
        const isStockError = error.message.toLowerCase().includes('stock') || 
                             error.message.toLowerCase().includes('insufficient');
                             
        const status = isStockError ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};

// 2. Get Order Details (Chi tiết đơn hàng)
const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const details = await OrderModel.getOrderDetails(id);
        res.status(200).json(details);
    } catch (error) {
        console.error('❌ SQL Query Error in getOrderDetails:', error.message); 
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message 
        });
    }
};

// 3. Get User History (Lịch sử mua hàng)
const getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await OrderModel.getByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error('❌ Get User Orders Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch order history' });
    }
};

// 4. Admin Get All (Quản lý đơn hàng)
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('❌ Get All Orders Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
};

// 5. Update Status (Cập nhật trạng thái - Đã bao gồm hoàn kho khi hủy)
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (status === 'Cancelled') {
            // Hàm này sẽ tự động cộng lại Stock vào bảng productsize
            await OrderModel.cancelAndRestock(id);
            res.status(200).json({ message: 'Order cancelled and stock restocked!' });
        } else {
            await OrderModel.updateOrderStatus(id, status);
            res.status(200).json({ message: `Status updated to ${status}` });
        }
    } catch (error) {
        console.error('❌ Update Status Error:', error.message);
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
};

// 6. Get Top Selling Products (Sản phẩm bán chạy)
const getTopSelling = async (req, res) => {
    try {
        const topProducts = await OrderModel.getTopSelling();
        res.status(200).json(topProducts);
    } catch (error) {
        console.error('❌ Fetch Top Selling Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { 
    checkout, 
    getOrderDetails, 
    getUserOrders, 
    getAllOrders, 
    updateStatus,
    getTopSelling
};