const express = require('express');
const hoaDonController = require('../controllers/hoaDonController');
const router = express.Router();


router.get('/get', hoaDonController.getAllHoaDon);


router.get('/get/:id', hoaDonController.getHoaDonById);


router.post('/create', hoaDonController.createHoaDon);


router.put('/update/:id', hoaDonController.updateHoaDon);


router.delete('/delete/:id', hoaDonController.deleteHoaDon);

module.exports = router;