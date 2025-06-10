const express = require('express');
const router = express.Router();

router.get('/slot', (req, res) => {
  if (!req.currentUser) return res.redirect('/login');
  res.render('slot', {
    user: req.session.user,
    balance: req.currentUser.balance
  });
});

module.exports = router;