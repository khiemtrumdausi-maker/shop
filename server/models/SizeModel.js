// File: server/models/SizeModel.js
const db = require('../config/db');

class SizeModel {
    // Lấy tất cả các Size có trong hệ thống
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM sizes ORDER BY SizeID ASC');
        return rows;
    }
}

module.exports = SizeModel;