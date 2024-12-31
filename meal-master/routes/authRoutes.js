const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken')
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/check-login', verifyToken, (req, res) => {
    res.status(200).json({ message: 'User is logged in', user: req.user });
});

module.exports = router;
