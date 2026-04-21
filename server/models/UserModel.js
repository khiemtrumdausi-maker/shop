const db = require('../config/db');

class UserModel {
  // Tìm user theo Email và Password (để Login)
  static async findByCredentials(email, password) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE Email = ? AND Password = ?', 
      [email, password]
    );
    return rows[0]; 
  }

  // Kiểm tra Email đã tồn tại chưa
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE Email = ?', [email]);
    return rows;
  }

  // Khách hàng tự đăng ký (Mặc định Role: Customer, Status: Active)
  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (Name, Email, Password, Phone, Address, Role, Status) VALUES (?, ?, ?, ?, ?, "Customer", "Active")',
      [name, email, password, phone, address]
    );
    return result;
  }

  // Khách hàng tự sửa Profile (Chỉ sửa Name, Phone, Address)
  static async update(userId, userData) {
    const name = userData.name || userData.Name;
    const phone = userData.phone || userData.Phone;
    const address = userData.address || userData.Address;

    const [result] = await db.execute(
      'UPDATE users SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?',
      [name, phone, address, userId]
    );
    return result;
  }

  // Lấy toàn bộ danh sách User cho Admin xem
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM users ORDER BY UserID DESC');
    return rows;
  }

  // Admin thực hiện XÓA User
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE UserID = ?', [id]);
    return result;
  }

  // Admin thực hiện KHÓA/MỞ tài khoản
  static async updateStatus(userId, status) {
    const [result] = await db.execute(
      'UPDATE users SET Status = ? WHERE UserID = ?',
      [status, userId]
    );
    return result;
  }
}

module.exports = UserModel;