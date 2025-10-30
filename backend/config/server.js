require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dateStrings: true,
});



// Kiểm tra kết nối khi khởi động ứng dụng
db.getConnection()
  .then((connection) => {
    console.log('Database connected successfully!');
    connection.release();
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = db;