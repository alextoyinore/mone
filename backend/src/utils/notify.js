const Notification = require('../models/Notification');

/**
 * Send a notification to a user
 * @param {Object} param0
 * @param {String} param0.user - recipient email
 * @param {String} param0.type - 'comment' | 'like' | 'follow' | 'system'
 * @param {String} param0.message
 * @param {String} [param0.link]
 */
async function sendNotification({ user, type, message, link }) {
  try {
    await Notification.create({ user, type, message, link });
  } catch (err) {
    // Optionally log error
  }
}

module.exports = { sendNotification };
