const express = require('express');
const lichLamViecController = require('../controllers/lichLamViecController');

const router = express.Router();

// Lấy tất cả lịch làm việc
router.get('/get', lichLamViecController.getAllLichLamViec);

// Lấy lịch làm việc theo ID
router.get('/get/:id', lichLamViecController.getLichLamViecById);

// Lấy lịch làm việc theo mã bác sĩ
router.get('/getByBacSi/:id', lichLamViecController.getLichLamViecByBacSi);

// Tạo mới lịch làm việc
router.post('/create', lichLamViecController.createLichLamViec);

// Cập nhật lịch làm việc
router.put('/update/:id', lichLamViecController.updateLichLamViec);

// Xóa lịch làm việc
router.delete('/delete/:id', lichLamViecController.deleteLichLamViec);

module.exports = router;
