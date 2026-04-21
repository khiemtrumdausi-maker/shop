const UserModel = require('../models/UserModel');

// --- ĐĂNG NHẬP ---
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findByCredentials(email, password);
        if (!user) return res.status(401).json({ message: 'Invalid email or password!' });
        
        if (user.Status === 'Banned') {
            return res.status(403).json({ message: 'Your account has been locked!' });
        }

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                status: user.Status
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- ĐĂNG KÝ (Dành cho khách) ---
const register = async (req, res) => {
    const { email } = req.body;
    try {
        const existing = await UserModel.findByEmail(email);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists!' });
        }
        await UserModel.create(req.body);
        res.status(201).json({ message: 'Registered successfully!' });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- CẬP NHẬT TRANG PROFILE CÁ NHÂN ---
const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await UserModel.update(userId, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'Profile updated!' });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- ADMIN: LẤY DANH SÁCH ---
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- ADMIN: XÓA USER ---
const deleteUser = async (req, res) => {
    try {
        const result = await UserModel.delete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found!' });
        res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// --- ADMIN: KHÓA/MỞ TÀI KHOẢN ---
const toggleUserStatus = async (req, res) => {
    const { currentStatus } = req.body;
    const newStatus = currentStatus === 'Active' ? 'Banned' : 'Active';
    try {
        await UserModel.updateStatus(req.params.id, newStatus);
        res.status(200).json({ message: `Account status updated to ${newStatus}`, newStatus });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { 
    login, 
    register, 
    updateUser, 
    getAllUsers, 
    deleteUser, 
    toggleUserStatus 
};