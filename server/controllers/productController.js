// File: server/controllers/productController.js
const ProductModel = require('../models/ProductModel');
const SizeModel = require('../models/SizeModel'); 
const InventoryModel = require('../models/InventoryModel'); 

// 1. Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// 2. Thêm sản phẩm mới
const addProduct = async (req, res) => {
    try {
        const { ProductName, Price, Description, CategoryID, Gender, Status } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.Image;

        const productData = {
            ProductName,
            Price: parseFloat(Price),
            Description,
            Image: imagePath,
            CategoryID: parseInt(CategoryID),
            Gender: Gender || 'Unisex',
            Status: Status || 'Active'
        };

        await ProductModel.add(productData);
        res.status(201).json({ message: 'Thêm sản phẩm thành công!' });
    } catch (error) {
        console.error("Lỗi khi thêm SP:", error);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
};

// 3. Cập nhật sản phẩm (Toàn bộ thông tin)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { ProductName, Price, Description, CategoryID, Gender, Status, Image } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : Image;

        const updateData = {
            ProductID: id,
            ProductName,
            Price: parseFloat(Price),
            Description,
            Image: imagePath,
            CategoryID: parseInt(CategoryID),
            Gender,
            Status
        };

        await ProductModel.update(updateData);
        res.status(200).json({ message: 'Update success' });
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
};

// 8. Đổi trạng thái nhanh (Toggle Status)
const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentStatus } = req.body;
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        await ProductModel.updateStatus(id, newStatus);
        res.status(200).json({ message: 'Status updated!', newStatus });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// 4. Xóa sản phẩm
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await ProductModel.delete(id);
        res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};

// 5. Lấy TẤT CẢ size và tồn kho (Dùng để hiện lên Modal Box)
const getProductSizes = async (req, res) => {
    try {
        const productId = req.params.id;
        const sizes = await ProductModel.getSizes(productId);
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy size' });
    }
};

// 6. Lấy danh sách toàn bộ Size
const getAllSizes = async (req, res) => {
    try {
        const sizes = await SizeModel.getAll();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách size', error });
    }
};

// 7. CẬP NHẬT KHO HÀNG (Hàm này đã được nâng cấp cho tính năng Box)
const updateStock = async (req, res) => {
    try {
        const { productId, stocks } = req.body; // stocks: { "1": 50, "2": 30 }
        
        // Lặp qua object stocks để cập nhật từng size một vào bảng productsize
        const promises = Object.entries(stocks).map(([sizeId, stock]) => {
            return ProductModel.updateStock(productId, sizeId, stock);
        });

        await Promise.all(promises);
        
        res.status(200).json({ message: 'Cập nhật kho hàng thành công!' });
    } catch (error) {
        console.error('Lỗi cập nhật kho:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật kho' });
    }
};

module.exports = { 
    getAllProducts, 
    addProduct, 
    updateProduct, 
    toggleStatus, 
    deleteProduct, 
    getProductSizes,
    getAllSizes, 
    updateStock 
};