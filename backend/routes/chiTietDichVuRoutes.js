
const express = require('express');
const chiTietDichVuController = require('../controllers/chiTietDichVuController');

const router = express.Router();

// GET all chi tiet dich vu
router.get('/get', chiTietDichVuController.getAllChiTietDichVu);

// GET chi tiet dich vu by ID
router.get('/get/:id', chiTietDichVuController.getChiTietDichVuById);

router.get('/getByBacSiID/:id', chiTietDichVuController.getChiTietDichVuByBacSiId);

// CREATE new chi tiet dich vu
router.post('/create', chiTietDichVuController.createChiTietDichVu);

// UPDATE chi tiet dich vu
router.put('/update/:id', chiTietDichVuController.updateChiTietDichVu);

// DELETE chi tiet dich vu
router.delete('/delete/:id', chiTietDichVuController.deleteChiTietDichVu);

module.exports = router;