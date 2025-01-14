const express = require('express');
const { createNotification, getUserNotifications, markAsRead } = require('../controllers/notificationController');
const router = express.Router();

// Create a new notification
router.post('/', createNotification);

// Get all notifications for a user
router.get('/:userId', getUserNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', markAsRead);

module.exports = router; 