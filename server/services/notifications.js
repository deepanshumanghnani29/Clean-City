const Notification = require('../models/Notification');

async function createNotification({ userId, title, message, type = 'system', reportId }) {
  try {
    await Notification.create({ userId, title, message, type, reportId });
  } catch (err) {
    // Notification failures should not break the main flow
    console.warn('Notification creation failed:', err.message);
  }
}

module.exports = { createNotification };
