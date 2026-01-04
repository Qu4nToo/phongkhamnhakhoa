const express = require('express');
const NgayNghiBacSiController = require('../controllers/ngayNghiBacSiController');
const router = express.Router();

// GET all days off (all doctors)
router.get('/getAll', NgayNghiBacSiController.getAll);

// GET all days off by doctor
router.get('/getByBacSi/:maBacSi', NgayNghiBacSiController.getByBacSi);

// GET day off by id
router.get('/getById/:id', NgayNghiBacSiController.getById);

// POST create new day off
router.post('/create', NgayNghiBacSiController.create);

// DELETE day off by id
router.delete('/delete/:id', NgayNghiBacSiController.delete);

module.exports = router;
