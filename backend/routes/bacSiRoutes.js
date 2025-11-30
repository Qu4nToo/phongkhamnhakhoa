const express = require('express');
const router = express.Router();
const bacSiController = require('../controllers/bacSiController');

router.get('/get', bacSiController.getAllBacSi);

router.get('/get/:id', bacSiController.getBacSiById);

router.get('/getBacSiByDichVu/:dichVuId', bacSiController.getBacSiByDichVu);

router.post('/create', bacSiController.createBacSi);

router.post('/login', bacSiController.loginBacSi);

router.put('/update/:id', bacSiController.updateBacSi);

router.delete('/delete/:id', bacSiController.deleteBacSi);

// API thống kê cho bác sĩ
router.get('/stats/:doctorId', bacSiController.getDoctorStats);
router.get('/appointments/today/:doctorId', bacSiController.getTodayAppointments);
router.get('/appointments/upcoming/:doctorId', bacSiController.getUpcomingAppointments);
router.get('/appointments/status/:doctorId', bacSiController.getAppointmentsByStatus);
router.get('/appointments/chart/:doctorId', bacSiController.getAppointmentsChart);

module.exports = router;