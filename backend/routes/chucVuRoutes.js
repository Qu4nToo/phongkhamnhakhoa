const express = require('express');
const router = express.Router();
const chucVuController = require('../controllers/chucVuController');

// Get all chuc vu
router.get('/get', chucVuController.getAllChucVu);

// Get single chuc vu by ID
router.get('/get/:id', chucVuController.getChucVuById);

// Create new chuc vu
router.post('/create', chucVuController.createChucVu);

// Update chuc vu
router.put('/update/:id', chucVuController.updateChucVu);

// Delete chuc vu
router.delete('/delete/:id', chucVuController.deleteChucVu);

module.exports = router;