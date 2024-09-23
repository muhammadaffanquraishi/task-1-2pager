const jwt = require ('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token:', token); // Log the token
      const decoded = jwt.decode(token, process.env.JWT_SECRET);
      console.log('Decoded:', decoded); // Log the decoded token
      req.user = {id: decoded.id};  // Set user ID from the decoded token
      next();
    } catch (error) {
      console.error('Error verifying token:', error); // Log the error
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;