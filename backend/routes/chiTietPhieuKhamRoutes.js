const express = require('express');
const chiTietPhieuKhamController = require('../controllers/chiTietPhieuKhamController');

const router = express.Router();

// GET all chi tiet phieu kham
router.get('/get', chiTietPhieuKhamController.getAllChiTietPhieuKham);

// GET chi tiet phieu kham by ID
router.get('/get:id', chiTietPhieuKhamController.getChiTietPhieuKhamById);

// CREATE new chi tiet phieu kham
router.post('/create', chiTietPhieuKhamController.createChiTietPhieuKham);

// UPDATE chi tiet phieu kham
router.put('/update/:id', chiTietPhieuKhamController.updateChiTietPhieuKham);

// DELETE chi tiet phieu kham
router.delete('/delete/:id', chiTietPhieuKhamController.deleteChiTietPhieuKham);

module.exports = router;