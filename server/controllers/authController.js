// File: server/controllers/authController.js
const UserModel = require('../models/UserModel');

// ================= HÀM ĐĂNG NHẬP (LOGIN) =================
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
    }

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Lỗi API Login:', error);
    res.status(500).json({ message: 'Lỗi server khi truy vấn Database' });
  }
};

// ================= HÀM ĐĂNG KÝ (REGISTER) =================
const register = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUsers = await UserModel.findByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    await UserModel.create(req.body);
    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    console.error('Lỗi API Register:', error);
    res.status(500).json({ message: 'Lỗi server khi lưu vào Database' });
  }
};

// ================= HÀM CẬP NHẬT (UPDATE USER) =================
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, phone, address } = req.body;

  try {
    const result = await UserModel.update(userId, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    res.status(200).json({
      message: 'Cập nhật thông tin thành công!',
      user: { id: userId, name, phone, address }
    });
  } catch (error) {
    console.error('Lỗi API UpdateUser:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật Database' });
  }
};

// EXPORT ĐẦY ĐỦ 3 HÀM
module.exports = { login, register, updateUser };