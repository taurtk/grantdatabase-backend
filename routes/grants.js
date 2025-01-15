const express = require('express');
const { createGrant, getAllGrants, matchGrants } = require('../controllers/grantController');
const accessControl = require('../middleware/accessControl');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createGrant);
router.get('/', getAllGrants);
router.post('/match', authMiddleware, matchGrants);

module.exports = router; 