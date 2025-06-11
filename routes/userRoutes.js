const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);
router.get('/logout', userController.logout);
router.post('/add-funds', userController.addFunds);
router.post('/deduct-funds', userController.deductFunds);
router.get('/profile', userController.getProfile);
router.get('/balance', userController.getBalance);

module.exports = router;