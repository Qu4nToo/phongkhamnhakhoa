const express = require('express');
const BacSiNgayNghiController = require('../controllers/bacSiNgayNghiController');
const router = express.Router();

// GET all days off by doctor
router.get('/getByBacSi/:maBacSi', BacSiNgayNghiController.getByBacSi);

// GET day off by id
router.get('/getById/:id', BacSiNgayNghiController.getById);

// POST create new day off
router.post('/create', BacSiNgayNghiController.create);

// DELETE day off by id
router.delete('/delete/:id', BacSiNgayNghiController.delete);

module.exports = router;
