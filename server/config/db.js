const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const db = pool.promise();

db.getConnection()
  .then(connection => {
    console.log('✅ Kết nối Database clothesshopdb thành công!');
    connection.release();
  })
  .catch(err => console.log('❌ Lỗi kết nối Database:', err.message));

module.exports = db;