const express = require('express');
const { registerUser, loginUser,getUser } = require('./../contollers/authController.js');
const User = require('./../models/user.js')
const authMiddleware = require('./../middleware/authMiddleware.js')

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me',authMiddleware,getUser);

module.exports = router;