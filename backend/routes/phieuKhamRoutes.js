const express = require('express');
const router = express.Router();
const phieuKhamController = require('../controllers/phieuKhamController');

router.get('/get', phieuKhamController.getAllPhieuKham);

router.get('/get/:id', phieuKhamController.getPhieuKhamById);

router.post('/create', phieuKhamController.createPhieuKham);

router.get('/getByBacSiID/:id', phieuKhamController.getPhieuKhamByIdBacSi);

router.put('/update/:id', phieuKhamController.updatePhieuKham);

router.delete('/delete/:id', phieuKhamController.deletePhieuKham);

module.exports = router;