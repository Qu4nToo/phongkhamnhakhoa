const express = require('express');
const router = express.Router();
const khachHangController = require('../controllers/khachHangControllers');

router.get('/get', khachHangController.getAllKhachHang);

router.get('/get/:id', khachHangController.getKhachHangById);

router.get('/getByEmail/:email', khachHangController.getKhachHangByEmail);

router.post('/create', khachHangController.createKhachHang);

router.put('/update/:id', khachHangController.updateKhachHang);

router.delete('/delete/:id', khachHangController.deleteKhachHang);

router.post('/login', khachHangController.loginKhachHang);

module.exports = router;