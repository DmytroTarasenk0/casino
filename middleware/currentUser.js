const { User } = require('../db/sequelize');

module.exports = async (req, res, next) => {
  if (req.session.user) {
    req.currentUser = await User.findByPk(req.session.user.id);
  }
  next();
};