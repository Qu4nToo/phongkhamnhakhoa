const express = require('express');
const loaiDichVuController = require('../controllers/loaiDichVuController');

const router = express.Router();

// Lấy tất cả loại dịch vụ
router.get('/get', loaiDichVuController.getAllLoaiDichVu);

// Lấy loại dịch vụ theo ID
router.get('/get/:id', loaiDichVuController.getLoaiDichVuById);

// Tạo mới loại dịch vụ
router.post('/create', loaiDichVuController.createLoaiDichVu);

// Cập nhật loại dịch vụ
router.put('/update/:id', loaiDichVuController.updateLoaiDichVu);

// Xóa loại dịch vụ
router.delete('/delete/:id', loaiDichVuController.deleteLoaiDichVu);

module.exports = router;
