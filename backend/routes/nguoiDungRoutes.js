const express = require('express');
const router = express.Router();
const nguoiDungController = require('../controllers/nguoiDungController');
const { authenticateToken, authenticateRole } = require('../middleware/auth');
const multer = require('multer');

// Cấu hình multer cho upload avatar
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ được upload file ảnh (JPEG, PNG, GIF, WEBP, JPG)'), false);
        }
    }
});

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

// Route đổi mật khẩu
router.put('/change-password/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân'),
  nguoiDungController.changePassword
);

// Route cập nhật avatar
router.put('/update-avatar/:id', 
  authenticateToken,
  authenticateRole('Quản lý', 'Lễ tân'),
  upload.single('avatar'),
  nguoiDungController.updateAvatar
);

router.delete('/delete/:id', 
  authenticateToken,
  authenticateRole('Quản lý'),
  nguoiDungController.deleteNguoiDung
);

module.exports = router;