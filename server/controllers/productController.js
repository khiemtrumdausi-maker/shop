const db = require('../config/db');

// 1. Lấy tất cả sản phẩm (Kèm tên Category nếu cần)
const getAllProducts = async (req, res) => {
    try {
        const sql = `
            SELECT p.*, c.CategoryName 
            FROM products p 
            LEFT JOIN categories c ON p.CategoryID = c.CategoryID
        `;
        const [rows] = await db.execute(sql);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// 2. Thêm sản phẩm mới
const addProduct = async (req, res) => {
    const { ProductName, Price, Description, Image, Gender, CategoryID } = req.body;
    try {
        const sql = 'INSERT INTO products (ProductName, Price, Description, Image, Gender, CategoryID) VALUES (?, ?, ?, ?, ?, ?)';
        await db.execute(sql, [ProductName, Price, Description, Image, Gender, CategoryID]);
        res.status(201).json({ message: 'Thêm sản phẩm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
};

// 3. Xóa sản phẩm
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM products WHERE ProductID = ?', [id]);
        res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};

// 4. Lấy TẤT CẢ size và số lượng tồn kho của 1 sản phẩm
const getProductSizes = async (req, res) => {
    try {
        const productId = req.params.id;
        // Dùng LEFT JOIN để lấy tất cả Size chuẩn (S, M, L, XL), nếu không có hàng thì Stock = 0
        const query = `
            SELECT s.SizeID, s.SizeName, IFNULL(ps.Stock, 0) AS Stock 
            FROM sizes s 
            LEFT JOIN productsize ps ON s.SizeID = ps.SizeID AND ps.ProductID = ?
            ORDER BY s.SizeID ASC
        `;
        const [rows] = await db.execute(query, [productId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy size:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy size' });
    }
};

// ĐỪNG QUÊN XUẤT THÊM HÀM getProductSizes NÀY RA NHÉ
module.exports = { getAllProducts, addProduct, deleteProduct, getProductSizes };