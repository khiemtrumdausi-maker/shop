// File: server/controllers/authController.js
const UserModel = require('../models/UserModel');

// ================= LOGIN FUNCTION =================
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    // --- KIỂM TRA TRẠNG THÁI TÀI KHOẢN (MỚI) ---
    if (user.Status === 'Banned') {
      return res.status(403).json({ 
        message: 'Your account has been locked! Please contact support for more information.' 
      });
    }

    // TRẢ LẠI KEY CHỮ THƯỜNG ĐỂ KHÔNG LÀM HỎNG GIỎ HÀNG VÀ HEADER
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.UserID,     // Trả lại 'id' để Shop.jsx thêm được vào giỏ
        name: user.FullName, // Chỉnh lại theo cột FullName trong DB của Khiêm
        email: user.Email,
        role: user.Role,      // Trả lại 'role'
        status: user.Status
      }
    });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ================= TOGGLE STATUS (Dành cho Admin) =================
const toggleUserStatus = async (req, res) => {
  const userId = req.params.id;
  const { currentStatus } = req.body;
  try {
    const newStatus = currentStatus === 'Active' ? 'Banned' : 'Active';
    
    // Gọi hàm cập nhật trong model (Nhớ thêm hàm này vào UserModel.js nhé Khiêm)
    await UserModel.updateStatus(userId, newStatus);

    res.status(200).json({ 
      message: `User status changed to ${newStatus}`, 
      newStatus 
    });
  } catch (error) {
    console.error('ToggleStatus Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ================= REGISTER FUNCTION =================
const register = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUsers = await UserModel.findByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'This email is already registered!' });
    }

    // Khi tạo mới, mặc định Status sẽ là 'Active' trong DB
    await UserModel.create(req.body);
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Register API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ================= UPDATE USER FUNCTION =================
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, phone, address } = req.body;

  try {
    const result = await UserModel.update(userId, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: { 
        id: userId, 
        name: name, 
        phone: phone, 
        address: address 
      }
    });
  } catch (error) {
    console.error('UpdateUser API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll(); 
    res.status(200).json(users);
  } catch (error) {
    console.error('GetAllUsers API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await UserModel.delete(userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('DeleteUser API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// NHỚ EXPORT THÊM HÀM MỚI
module.exports = { login, register, updateUser, getAllUsers, deleteUser, toggleUserStatus };