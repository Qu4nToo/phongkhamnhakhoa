const express = require('express');
const router = express.Router();
const nguoiDungController = require('../controllers/nguoiDungController');

router.get('/get', nguoiDungController.getAllNguoiDung);

router.get('/get/:id', nguoiDungController.getNguoiDungById);

router.get('/getByEmail/:email', nguoiDungController.getNguoiDungByEmail);

router.post('/create', nguoiDungController.createNguoiDung);

router.put('/update/:id', nguoiDungController.updateNguoiDung);

router.delete('/delete/:id', nguoiDungController.deleteNguoiDung);

module.exports = router;