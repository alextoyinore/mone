const User = require('../models/User');

// Middleware: Require user to be premium
module.exports = async function requirePremium(req, res, next) {
  const userId = req.user && req.user._id;
  if (!userId) return res.status(401).json({ error: 'Authentication required' });
  const user = await User.findById(userId);
  if (!user || !user.isPremium) return res.status(403).json({ error: 'Premium membership required' });
  next();
};
