const User = require('../models/user');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as admin' });
    }
  } catch (error) {
    console.log(error)
    res.status(502).json({ message: 'Server error' });
  }
};

module.exports = adminMiddleware;