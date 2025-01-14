const Notification = require('../models/Notification');

// Create Notification
exports.createNotification = async (req, res) => {
    const { userId, message } = req.body;
    const notification = new Notification({ userId, message });

    try {
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Notifications for a User
exports.getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 