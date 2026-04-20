const db = require('../config/db');

// ================= HÀM ĐĂNG NHẬP (LOGIN) =================
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE Email = ? AND Password = ? AND Status = "Active"', 
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
    }

    const user = rows[0];
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
  const { name, email, password, phone, address } = req.body;
  try {
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE Email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    await db.execute(
      'INSERT INTO users (Name, Email, Password, Phone, Address, Role, Status) VALUES (?, ?, ?, ?, ?, "Customer", "Active")',
      [name, email, password, phone, address]
    );

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
    const [result] = await db.execute(
      'UPDATE users SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?',
      [name, phone, address, userId]
    );

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