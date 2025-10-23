const express = require('express');
const router = express.Router();
const bacSiController = require('../controllers/bacSiController');

router.get('/get', bacSiController.getAllBacSi);

router.get('/get/:id', bacSiController.getBacSiById);

router.post('/create', bacSiController.createBacSi);

router.put('/update/:id', bacSiController.updateBacSi);

router.delete('/delete/:id', bacSiController.deleteBacSi);

module.exports = router;