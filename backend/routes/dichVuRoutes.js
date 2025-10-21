const express = require('express');
const dichVuController = require('../controllers/dichVuController');
const router = express.Router();

// GET all ratings
router.get('/get', dichVuController.getAllDichVu);

// GET single rating by ID
router.get('/get/:id', dichVuController.getDichVuById);

// POST new rating
router.post('/create', dichVuController.createDichVu);

// PUT update rating
router.put('/update/:id', dichVuController.updateDichVu);

// DELETE rating
router.delete('/delete/:id', dichVuController.deleteDichVu);

module.exports = router;