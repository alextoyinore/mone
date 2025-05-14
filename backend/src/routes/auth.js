const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Firebase token verification middleware
const verifyToken = authController.verifyFirebaseToken;

// User sync
router.post('/sync', verifyToken, authController.syncUser);

// Firebase-based authentication
router.post('/register', verifyToken, authController.register);
router.post('/google', verifyToken, authController.googleLogin);

// Logout route
router.post('/logout', verifyToken, authController.logout);

// Get current user (requires authentication)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;

