const express = require('express');
const router = express.Router();
const khachHangController = require('../controllers/khachHangControllers');
const { authenticateToken, authenticateRole } = require('../middleware/auth');

// Route công khai - đăng ký và đăng nhập
router.post('/create', khachHangController.createKhachHang);
router.post('/login', khachHangController.loginKhachHang);

// Route cho Quản lý và Lễ tân - xem danh sách khách hàng
router.get('/get', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân', 'Bác sĩ'),
  khachHangController.getAllKhachHang
);

router.get('/get/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân', 'Khách hàng'),
  khachHangController.getKhachHangById
);

router.get('/getByEmail/:email', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân'),
  khachHangController.getKhachHangByEmail
);

// Route cho khách hàng tự cập nhật thông tin, hoặc Quản lý
router.put('/update/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Khách hàng'),
  khachHangController.updateKhachHang
);

// Route chỉ cho Quản lý - xóa khách hàng
router.delete('/delete/:id', 
  authenticateToken,
  authenticateRole('Quản lý'),
  khachHangController.deleteKhachHang
);

module.exports = router;