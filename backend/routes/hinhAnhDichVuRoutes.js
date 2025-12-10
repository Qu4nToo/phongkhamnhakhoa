const express = require('express');
const multer = require('multer');
const hinhAnhDichVuController = require('../controllers/hinhAnhDichVuController');

const router = express.Router();

// Cấu hình multer để upload nhiều file
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10 // Tối đa 10 ảnh
    }
});

// Upload nhiều ảnh cho dịch vụ
router.post('/upload/:maDichVu', upload.array('images', 10), hinhAnhDichVuController.uploadImages);

// Lấy tất cả ảnh của dịch vụ
router.get('/get/:maDichVu', hinhAnhDichVuController.getImagesByDichVuId);

// Đặt ảnh chính
router.put('/set-main/:maHinhAnh', hinhAnhDichVuController.setMainImage);

// Xóa một ảnh
router.delete('/delete/:maHinhAnh', hinhAnhDichVuController.deleteImage);

// Cập nhật thứ tự
router.put('/update-order/:maHinhAnh', hinhAnhDichVuController.updateOrder);

module.exports = router;
