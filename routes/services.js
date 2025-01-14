const express = require('express');
const { requestService, getAllServices } = require('../controllers/serviceController');
const router = express.Router();

router.post('/', requestService);
router.get('/', getAllServices);

module.exports = router; 