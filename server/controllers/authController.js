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

    // TRẢ LẠI KEY CHỮ THƯỜNG ĐỂ KHÔNG LÀM HỎNG GIỎ HÀNG VÀ HEADER
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.UserID,     // Trả lại 'id' để Shop.jsx thêm được vào giỏ
        name: user.Name,     // Trả lại 'name' để Header.jsx hiện được tên
        email: user.Email,
        role: user.Role      // Trả lại 'role'
      }
    });
  } catch (error) {
    console.error('Login API Error:', error);
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

    // TRẢ LẠI KEY CHỮ THƯỜNG CHO ĐỒNG BỘ
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

module.exports = { login, register, updateUser };