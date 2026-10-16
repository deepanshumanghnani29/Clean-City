const Notification = require('../models/Notification');

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments({ userId: req.user._id, readAt: { $exists: false } }),
    ]);

    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
const markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/read-all
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, readAt: { $exists: false } },
      { readAt: new Date() }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead, markAllRead };
