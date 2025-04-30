const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', authController.login);
router.get('/register', (req, res) => res.render('register', { error: null }));
router.post('/register', authController.register);
router.get('/profile', authMiddleware.isAuthenticated, authController.profile);

module.exports = router;
