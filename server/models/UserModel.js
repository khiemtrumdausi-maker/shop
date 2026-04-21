// File: server/models/UserModel.js
const db = require('../config/db');

class UserModel {
  // 1. Kiểm tra đăng nhập (Bỏ Status = "Active" ở đây để Controller xử lý thông báo riêng)
  static async findByCredentials(email, password) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE Email = ? AND Password = ?', 
      [email, password]
    );
    return rows[0]; 
  }

  // 2. Kiểm tra email tồn tại
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE Email = ?', [email]);
    return rows;
  }

  // 3. Đăng ký tài khoản mới
  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (FullName, Email, Password, PhoneNumber, Address, Role, Status) VALUES (?, ?, ?, ?, ?, "Customer", "Active")',
      [name, email, password, phone, address]
    );
    return result;
  }

  // 4. Cập nhật thông tin người dùng
  static async update(userId, userData) {
    const { name, phone, address } = userData;
    const [result] = await db.execute(
      'UPDATE users SET FullName = ?, PhoneNumber = ?, Address = ? WHERE UserID = ?',
      [name, phone, address, userId]
    );
    return result;
  }

  // 7. [MỚI] Cập nhật riêng trạng thái (Dùng cho Admin Toggle Status)
  static async updateStatus(userId, status) {
    const [result] = await db.execute(
      'UPDATE users SET Status = ? WHERE UserID = ?',
      [status, userId]
    );
    return result;
  }

  // 5. Lấy tất cả người dùng
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