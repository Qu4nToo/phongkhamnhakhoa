const express = require('express');
const LichNghiPhongKhamController = require('../controllers/lichNghiPhongKhamController');
const router = express.Router();

// GET - Lấy tất cả lịch nghỉ
router.get('/getAll', LichNghiPhongKhamController.getAll);

// GET - Lấy lịch nghỉ theo năm
router.get('/getByYear/:year', LichNghiPhongKhamController.getByYear);

// GET - Lấy lịch nghỉ sắp tới
router.get('/getUpcoming', LichNghiPhongKhamController.getUpcoming);

// GET - Kiểm tra ngày có phải ngày nghỉ không
router.get('/checkNgayNghi/:ngay', LichNghiPhongKhamController.checkNgayNghi);

// GET - Lấy lịch nghỉ trong khoảng thời gian (cho calendar)
// Query params: ?startDate=2026-01-01&endDate=2026-12-31
router.get('/getByDateRange', LichNghiPhongKhamController.getByDateRange);

// GET - Lấy chi tiết lịch nghỉ theo ID
router.get('/getById/:id', LichNghiPhongKhamController.getById);

// POST - Thêm lịch nghỉ mới (Admin only - cần thêm middleware auth)
router.post('/create', LichNghiPhongKhamController.create);

// PUT - Cập nhật lịch nghỉ (Admin only - cần thêm middleware auth)
router.put('/update/:id', LichNghiPhongKhamController.update);

// DELETE - Xóa lịch nghỉ (Admin only - cần thêm middleware auth)
router.delete('/delete/:id', LichNghiPhongKhamController.delete);

module.exports = router;
