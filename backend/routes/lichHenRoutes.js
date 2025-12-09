const express = require('express');
const router = express.Router();
const lichHenController = require('../controllers/lichHenController');

router.get('/get', lichHenController.getAllLichHen);

router.get('/get/:id', lichHenController.getLichHenById);

router.get('/getByBacSiID/:id', lichHenController.getLichHenByBacSiId);

router.get('/getByKhachHangID/:id', lichHenController.getLichHenByKhachHangId);

router.get('/available-slots', lichHenController.getAvailableTimeSlots);

router.post('/create', lichHenController.createLichHen);

router.put('/update/:id', lichHenController.updateLichHen);

router.put('/update-status/:id', lichHenController.updateStatus);

router.delete('/delete/:id', lichHenController.deleteLichHen);

module.exports = router;