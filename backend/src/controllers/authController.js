const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');


// Helper: create JWT
function createToken(user) {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
}


// Middleware to verify Firebase token
exports.verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};


// Get current user (for /me endpoint)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate('artist');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// User sync endpoint
exports.syncUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, lastLogin } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        googleId: uid,
        fullname: displayName,
        avatar: photoURL,
      });
    } else {
      // Update existing user if needed
      user.fullname = displayName;
      user.avatar = photoURL;
      user.lastLogin = lastLogin;
      await user.save();
    }

    const token = createToken(user);
    res.status(200).json({
      message: 'User synced successfully',
      user: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('User sync error:', err);
    res.status(500).json({ error: 'User sync failed', details: err.message });
  }
};


// Register with Firebase verification
exports.register = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    // console.log('Name Payload Sent: ', displayName);
    
    // Check if user already exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create new user
    if (!user) {
      user = await User.create({
        email,
        googleId: uid,
        fullname: displayName,
        avatar: photoURL,
      });
    } else {
      // Update existing user if needed
      user.fullname = displayName;
      user.avatar = photoURL;
      await user.save();
    }

    // Generate token for the user
    const token = createToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};


// Google login
exports.googleLogin = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, lastLogin } = req.body;
    
    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email or Google ID
    let user = await User.findOne({ 
      $or: [{ email }, { googleId: uid }] 
    });

    // Prepare user data
    const userData = {
      email,
      fullname: displayName || '',
      googleId: uid,
      avatar: photoURL || '',
      lastLogin: lastLogin || new Date()
    };

    // Create or update user
    if (!user) {
      // Create new user
      user = await User.create(userData);
      console.log('New user created:', user);
    } else {
      // Update existing user
      user.fullname = userData.fullname || user.fullname;
      user.avatar = userData.avatar || user.avatar;
      user.googleId = userData.googleId;
      user.lastLogin = userData.lastLogin;
      
      await user.save();
      console.log('Existing user updated:', user);
    }

    // Generate token for the user
    const token = createToken(user);

    // Prepare response
    const userResponse = {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      avatar: user.avatar,
      role: user.role
    };

    // Send successful response
    res.status(200).json({
      message: 'Google login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Google login error:', error);
    
    // Handle specific error types
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'User already exists', 
        details: 'An account with this email already exists' 
      });
    }

    // Generic server error
    res.status(500).json({ 
      error: 'Google login failed', 
      details: error.message 
    });
  }
};


// Logout user
exports.logout = async (req, res) => {
  try {
    // Optional: Perform any backend-side logout operations
    // For example, you might want to:
    // - Invalidate tokens
    // - Update last logout time
    // - Clear any server-side session data

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout'
    });
  }
};
