const admin = require('firebase-admin');

module.exports = async function verifyFirebaseToken(req, res, next) {
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
    
    // Extract relevant user details
    const user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
      picture: decodedToken.picture || ''
    };
    
    req.user = user;
    
    // Pass user details to the next middleware or route handler
    next();
    
    // Return user details for potential use
    return user;
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
