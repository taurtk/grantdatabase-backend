const express = require('express');
const { createTemplate, getAllTemplates } = require('../controllers/templateController');
const router = express.Router();

router.post('/', createTemplate);
router.get('/', getAllTemplates);

module.exports = router; 