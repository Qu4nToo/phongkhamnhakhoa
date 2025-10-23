const express = require('express');
const router = express.Router();
const lichHenController = require('../controllers/lichHenController');

router.get('/get', lichHenController.getAllLichHen);

router.get('/get/:id', lichHenController.getLichHenById);

router.get('/get/bacsi/:id', lichHenController.getLichHenByBacSiId);

router.get('/get/khachhang/:id', lichHenController.getLichHenByKhachHangId);

router.post('/create', lichHenController.createLichHen);

router.put('/update/:id', lichHenController.updateLichHen);

router.delete('/delete/:id', lichHenController.deleteLichHen);

module.exports = router;