const express = require('express');
const router = express.Router();
const nguoiDungController = require('../controllers/nguoiDungController');
const { authenticateToken, authenticateRole } = require('../middleware/auth');

// Route công khai - không cần đăng nhập
router.post('/login', nguoiDungController.loginNguoiDung);

// Route cho Quản lý và Lễ tân - xem danh sách và chi tiết
router.get('/get', 
  authenticateToken, 
  authenticateRole('Quản lý', 'Lễ tân'),
  nguoiDungController.getAllNguoiDung
);

router.get('/get/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân'),
  nguoiDungController.getNguoiDungById
);

router.get('/getByEmail/:email', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân'),
  nguoiDungController.getNguoiDungByEmail
);

// Route chỉ cho Quản lý - tạo, sửa, xóa
router.post('/create', 
  authenticateToken,
  authenticateRole('Quản lý'),
  nguoiDungController.createNguoiDung
);

router.put('/update/:id', 
  authenticateToken,
  authenticateRole('Quản lý'),
  nguoiDungController.updateNguoiDung
);

router.delete('/delete/:id', 
  authenticateToken,
  authenticateRole('Quản lý'),
  nguoiDungController.deleteNguoiDung
);

module.exports = router;