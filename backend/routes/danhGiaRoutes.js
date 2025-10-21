const express = require('express');
const danhGiaController = require('../controllers/danhGiaController');
const router = express.Router();

// GET all ratings
router.get('/get', danhGiaController.getAllDanhGia);

// GET single rating by ID
router.get('/get/:id', danhGiaController.getDanhGiaById);

// POST new rating
router.post('/create', danhGiaController.createDanhGia);

// DELETE rating
router.delete('/delete/:id', danhGiaController.deleteDanhGia);

module.exports = router;