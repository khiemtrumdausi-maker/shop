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

// 7. [MỚI THÊM] Cập nhật sản phẩm (Hàm này giải quyết lỗi của Khiêm đây)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { ProductName, Price, Description, CategoryID, Gender, Status, Image } = req.body;

        // Nếu Multer nhận được file (req.file) -> lấy path mới
        // Nếu không có file -> lấy lại giá trị Image cũ gửi từ body (chính là link cũ)
        const imagePath = req.file ? `/uploads/${req.file.filename}` : Image;

        const updateData = {
            ProductID: id,
            ProductName,
            Price: parseFloat(Price),
            Description,
            Image: imagePath, // Link cũ sẽ được giữ lại ở đây
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

// 4. Lấy TẤT CẢ size và tồn kho
const getProductSizes = async (req, res) => {
    try {
        const productId = req.params.id;
        const sizes = await ProductModel.getSizes(productId);
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy size' });
    }
};

// 5. Lấy danh sách toàn bộ Size
const getAllSizes = async (req, res) => {
    try {
        const sizes = await SizeModel.getAll();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách size', error });
    }
};

// 6. Cập nhật số lượng kho hàng
const updateStock = async (req, res) => {
    const { productId, sizeId, stock } = req.body;
    try {
        await InventoryModel.updateStock(productId, sizeId, stock);
        res.status(200).json({ message: 'Cập nhật kho hàng thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật kho' });
    }
};

// QUAN TRỌNG: Phải export updateProduct ra thì file Router mới gọi được
module.exports = { 
    getAllProducts, 
    addProduct, 
    updateProduct, // <--- PHẢI CÓ DÒNG NÀY
    deleteProduct, 
    getProductSizes,
    getAllSizes, 
    updateStock 
};