const express = require('express');
const router = express.Router();
const khachHangController = require('../controllers/khachHangControllers');
const { authenticateToken, authenticateRole } = require('../middleware/auth');
const multer = require('multer');

// Cấu hình multer cho upload avatar
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ được upload file ảnh (JPEG, PNG, GIF, WEBP)'), false);
        }
    }
});

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

// Route đổi mật khẩu
router.put('/change-password/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Khách hàng'),
  khachHangController.changePassword
);

// Route cập nhật avatar
router.put('/update-avatar/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Khách hàng'),
  upload.single('avatar'),
  khachHangController.updateAvatar
);

// Route chỉ cho Quản lý - xóa khách hàng
router.delete('/delete/:id', 
  authenticateToken,
  authenticateRole('Quản lý'),
  khachHangController.deleteKhachHang
);

module.exports = router;