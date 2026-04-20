// File: server/models/UserModel.js
const db = require('../config/db');

class UserModel {
  // 1. Kiểm tra đăng nhập
  static async findByCredentials(email, password) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE Email = ? AND Password = ? AND Status = "Active"', 
      [email, password]
    );
    return rows[0]; // Trả về user nếu đúng, trả về undefined nếu sai
  }

  // 2. Kiểm tra email đã tồn tại chưa
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE Email = ?', [email]);
    return rows;
  }

  // 3. Đăng ký tài khoản mới
  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (Name, Email, Password, Phone, Address, Role, Status) VALUES (?, ?, ?, ?, ?, "Customer", "Active")',
      [name, email, password, phone, address]
    );
    return result;
  }

  // 4. Cập nhật thông tin người dùng
  static async update(userId, userData) {
    const { name, phone, address } = userData;
    const [result] = await db.execute(
      'UPDATE users SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?',
      [name, phone, address, userId]
    );
    return result;
  }

  // 5. Lấy tất cả người dùng (Cho trang Admin)
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM users ORDER BY UserID DESC');
    return rows;
  }

  // 6. Xóa người dùng
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE UserID = ?', [id]);
    return result;
  }
}

module.exports = UserModel;