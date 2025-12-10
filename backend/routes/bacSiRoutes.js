const express = require('express');
const router = express.Router();
const bacSiController = require('../controllers/bacSiController');
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

// Route công khai - không cần đăng nhập
router.post('/login', bacSiController.loginBacSi);

router.get('/get',
    bacSiController.getAllBacSi
);

router.get('/get/:id',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân', 'Bác sĩ'),
    bacSiController.getBacSiById
);

router.get('/getBacSiByDichVu/:dichVuId',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân', 'Khách hàng'),
    bacSiController.getBacSiByDichVu
);

// Route chỉ cho Quản lý - tạo, sửa, xóa
router.post('/create',
    authenticateToken,
    authenticateRole('Quản lý'),
    bacSiController.createBacSi
);

router.put('/update/:id',
    authenticateToken,
    authenticateRole('Quản lý', 'Bác sĩ'),
    bacSiController.updateBacSi
);

// Route đổi mật khẩu
router.put('/change-password/:id',
    authenticateToken,
    authenticateRole('Quản lý', 'Bác sĩ'),
    bacSiController.changePassword
);

// Route cập nhật avatar
router.put('/update-avatar/:id',
    authenticateToken,
    authenticateRole('Quản lý', 'Bác sĩ'),
    upload.single('avatar'),
    bacSiController.updateAvatar
);

router.delete('/delete/:id',
    authenticateToken,
    authenticateRole('Quản lý'),
    bacSiController.deleteBacSi
);

// API thống kê cho bác sĩ - Bác sĩ chỉ xem được của mình
router.get('/stats/:doctorId',
    authenticateToken,
    authenticateRole('Quản lý', 'Bác sĩ'),
    bacSiController.getDoctorStats
);

router.get('/appointments/today/:doctorId',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân', 'Bác sĩ'),
    bacSiController.getTodayAppointments
);

router.get('/appointments/upcoming/:doctorId',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân', 'Bác sĩ'),
    bacSiController.getUpcomingAppointments
);

router.get('/appointments/status/:doctorId',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân', 'Bác sĩ'),
    bacSiController.getAppointmentsByStatus
);

router.get('/appointments/chart/:doctorId',
    authenticateToken,
    authenticateRole('Quản lý', 'Bác sĩ'),
    bacSiController.getAppointmentsChart
);

module.exports = router;