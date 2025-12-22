
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/server'); 


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả origin, có thể cấu hình cụ thể hơn
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const nguoiDungRoutes = require('./routes/nguoiDungRoutes');
const bacSiRoutes = require('./routes/bacSiRoutes');
const hoaDonRoutes = require('./routes/hoaDonRoutes');
const lichHenRoutes = require('./routes/lichHenRoutes');
const khachHangRoutes = require('./routes/khachHangRoutes');
const phieuKhamRoutes = require('./routes/phieuKhamRoutes');
const dichVuRoutes = require('./routes/dichVuRoutes');
const danhGiaRoutes = require('./routes/danhGiaRoutes');
const chiTietDichVuRoutes = require('./routes/chiTietDichVuRoutes');
const chiTietPhieuKhamRoutes = require('./routes/chiTietPhieuKhamRoutes');
const lichLamViecRoutes = require('./routes/lichLamViecRoutes');
const loaiDichVuRoutes = require('./routes/loaiDichVuRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const hinhAnhDichVuRoutes = require('./routes/hinhAnhDichVuRoutes');

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
app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/nguoi-dung', nguoiDungRoutes);
app.use('/api/bac-si', bacSiRoutes);
app.use('/api/hoa-don', hoaDonRoutes);
app.use('/api/lich-hen', lichHenRoutes);
app.use('/api/khach-hang', khachHangRoutes);
app.use('/api/lich-lam-viec', lichLamViecRoutes);
app.use('/api/loai-dich-vu', loaiDichVuRoutes);
app.use('/api/phieu-kham', phieuKhamRoutes);
app.use('/api/dich-vu', dichVuRoutes);
app.use('/api/danh-gia', danhGiaRoutes);
app.use('/api/chi-tiet-dich-vu', chiTietDichVuRoutes);
app.use('/api/chi-tiet-phieu-kham', chiTietPhieuKhamRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/hinh-anh-dich-vu', hinhAnhDichVuRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io để sử dụng trong controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});