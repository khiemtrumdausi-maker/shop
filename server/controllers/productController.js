// File: server/controllers/productController.js
const ProductModel = require('../models/ProductModel');
const SizeModel = require('../models/SizeModel'); // Import Model mới
const InventoryModel = require('../models/InventoryModel'); // Import Model mới

// 1. Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// 2. Thêm sản phẩm mới (Đã hỗ trợ Upload ảnh, Status, Gender)
const addProduct = async (req, res) => {
    try {
        // 1. Bóc tách thêm Status từ req.body
        const { ProductName, Price, Description, CategoryID, Gender, Status } = req.body;

        // 2. Xử lý đường dẫn ảnh (Ưu tiên file từ máy tính)
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.Image;

        // 3. Đóng gói dữ liệu để gửi sang Model
        const productData = {
            ProductName,
            Price: parseFloat(Price),
            Description,
            Image: imagePath,
            CategoryID: parseInt(CategoryID),
            Gender: Gender || 'Unisex',
            Status: Status || 'Active' // Thêm dòng này để khớp Model mới
        };

        await ProductModel.add(productData);
        res.status(201).json({ message: 'Thêm sản phẩm thành công!' });
    } catch (error) {
        console.error("Lỗi khi thêm SP:", error);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
};

// 3. Xóa sản phẩm
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await ProductModel.delete(id);
        res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};

// 4. Lấy TẤT CẢ size và số lượng tồn kho của 1 sản phẩm (Dùng cho trang Chi tiết SP)
const getProductSizes = async (req, res) => {
    try {
        const productId = req.params.id;
        const sizes = await ProductModel.getSizes(productId);
        res.status(200).json(sizes);
    } catch (error) {
        console.error('Lỗi lấy size:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy size' });
    }
};

// 5. [MỚI] Lấy danh sách toàn bộ Size có trong hệ thống (Dùng cho Admin tạo SP)
const getAllSizes = async (req, res) => {
    try {
        const sizes = await SizeModel.getAll();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách size', error });
    }
};

// 6. [MỚI] Cập nhật số lượng kho hàng (Dùng cho trang Quản lý kho)
const updateStock = async (req, res) => {
    const { productId, sizeId, stock } = req.body;
    try {
        await InventoryModel.updateStock(productId, sizeId, stock);
        res.status(200).json({ message: 'Cập nhật kho hàng thành công!' });
    } catch (error) {
        console.error('Lỗi cập nhật kho:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật kho' });
    }
};

module.exports = { 
    getAllProducts, 
    addProduct, 
    deleteProduct, 
    getProductSizes,
    getAllSizes, // Export hàm mới
    updateStock   // Export hàm mới
};