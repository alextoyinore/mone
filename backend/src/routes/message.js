const express = require('express');
const router = express.Router();
const { sendNotification } = require('../utils/notify');

// POST /api/message
router.post('/', async (req, res) => {
  try {
    const { to, from, message } = req.body;
    if (!to || !from || !message) return res.status(400).json({ error: 'Missing fields' });
    const threadId = [to, from].sort().join('-');
    await Message.create({ from, to, message, threadId });
    // Send notification to recipient
    await sendNotification({
      user: to,
      type: 'system',
      message: `New message from ${from}: ${message}`,
      link: ''
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const Message = require('../models/Message');

// Helper: threadId is sorted emails joined by '-'
function getThreadId(a, b) {
  return [a, b].sort().join('-');
}

// GET /api/message/inbox?user=email
router.get('/inbox', async (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: 'Missing user' });
  // Find all threads where user is from or to
  const msgs = await Message.find({ $or: [{ from: user }, { to: user }] }).sort({ createdAt: -1 });
  // Group by threadId, get last message
  const threads = {};
  msgs.forEach(m => {
    if (!threads[m.threadId] || m.createdAt > threads[m.threadId].updatedAt) {
      threads[m.threadId] = {
        threadId: m.threadId,
        otherUser: m.from === user ? m.to : m.from,
        lastMessage: m.message,
        updatedAt: m.createdAt
      };
    }
  });
  res.json(Object.values(threads));
});

// GET /api/message/thread/:threadId
router.get('/thread/:threadId', async (req, res) => {
  const threadId = req.params.threadId;
  const msgs = await Message.find({ threadId }).sort({ createdAt: 1 });
  res.json(msgs);
});

// POST /api/message/reply
router.post('/reply', async (req, res) => {
  try {
    const { threadId, from, message } = req.body;
    if (!threadId || !from || !message) return res.status(400).json({ error: 'Missing fields' });
    // Figure out recipient
    const [a, b] = threadId.split('-');
    const to = from === a ? b : a;
    await Message.create({ from, to, message, threadId });
    await sendNotification({ user: to, type: 'system', message: `New message from ${from}: ${message}`, link: '' });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
