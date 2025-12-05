const express = require('express');
const router = express.Router();
const bacSiController = require('../controllers/bacSiController');
const { authenticateToken, authenticateRole } = require('../middleware/auth');

// Route công khai - không cần đăng nhập
router.post('/login', bacSiController.loginBacSi);

// Route cho Quản lý và Lễ tân - xem danh sách
router.get('/get',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân'),
    bacSiController.getAllBacSi
);

router.get('/get/:id',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân', 'Bác sĩ'),
    bacSiController.getBacSiById
);

router.get('/getBacSiByDichVu/:dichVuId',
    authenticateToken,
    authenticateRole('Quản lý', 'Lễ tân'),
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
    authenticateRole('Quản lý'),
    bacSiController.updateBacSi
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