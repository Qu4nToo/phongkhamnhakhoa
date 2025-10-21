// ======== TẢI BIẾN MÔI TRƯỜNG (.env) ========
require('dotenv').config();

// ======== CÁC THƯ VIỆN CẦN THIẾT ========
const express = require('express');
const cors = require('cors');
const db = require('./config/server'); // import file db.js bạn đã viết

// ======== KHỞI TẠO APP EXPRESS ========
const app = express();

// ======== MIDDLEWARE ========
app.use(cors()); // cho phép gọi API từ frontend
app.use(express.json()); // cho phép đọc JSON trong body request

// ======== ROUTE TEST KẾT NỐI DATABASE ========
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS currentTime');
    res.json({
      message: '✅ Backend connected to MySQL successfully!',
      server_time: rows[0].currentTime,
    });
  } catch (err) {
    console.error('❌ Query failed:', err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// ======== KHỞI ĐỘNG SERVER ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});