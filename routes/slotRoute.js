const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.get('/slot', slotController.showSlot);
router.post('/spin', slotController.spin); 

module.exports = router;
