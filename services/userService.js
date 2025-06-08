const bcrypt = require('bcrypt');
const { User } = require('../db/sequelize');

const UserService = {
  async getUserById(id) {
    return await User.findByPk(id);
  },

  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  },

  async createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, balance: 0 });
  },

  async addFunds(userId, amount) {
    return await User.sequelize.transaction(async (t) => {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) throw new Error('User not found');
      user.balance += parseFloat(amount);
      await user.save({ transaction: t });
      return true;
    });
  },
};

module.exports = UserService;