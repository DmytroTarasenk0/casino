const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/slot', isAuthenticated, slotController.showSlotPage);
router.post('/slot', isAuthenticated, slotController.spinSlot);

module.exports = router;
