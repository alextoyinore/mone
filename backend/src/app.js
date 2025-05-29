require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Firebase Admin
require('./config/firebase');

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artist', require('./routes/artist'));
app.use('/api/songs', require('./routes/song'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/playlists', require('./routes/playlist'));
app.use('/api/comments', require('./routes/comment'));
app.use('/api/users', require('./routes/user'));
app.use('/api/favorite', require('./routes/favorite'));
app.use('/api/albums', require('./routes/album'));
app.use('/api/follow', require('./routes/follow'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/analytics-admin', require('./routes/analyticsAdmin'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/trending', require('./routes/trending'));
app.use('/api/users', require('./routes/user'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/message', require('./routes/message'));
app.use('/api/explore', require('./routes/explore'));
app.use('/api/recently-played', require('./routes/recently-played'));
app.use('/api/comments', require('./routes/comment'));


// Example route (to be replaced with real routes)
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

