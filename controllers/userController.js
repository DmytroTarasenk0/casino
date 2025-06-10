const UserService = require('../services/userService');
const bcrypt = require('bcrypt');

const userController = {
  getLogin(req, res) {
    res.render('login');
  },

  getRegister(req, res) {
    res.render('register');
  },

  async getProfile(req, res) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    try {
      const user = await UserService.getUserById(req.session.user.id);
      if (!user) {
        return res.redirect('/login');
      }
      res.render('profile', { 
        user: req.session.user,
        balance: user.balance.toFixed(2) 
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.redirect('/login');
    }
  },

  async postRegister(req, res) {
    const { username, password } = req.body;
    const existingUser = await UserService.findByUsername(username);
    if (existingUser) return res.render('register', { error: 'User exists' });

    await UserService.createUser(username, password);

    const user = await UserService.findByUsername(username);
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/profile');
  },

  async postLogin(req, res) {
    const { username, password } = req.body;
    const user = await UserService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/profile');
  },

  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  },

  async addFunds(req, res) {
    if (!req.session.user) {
      req.session.message = 'Login to add funds';
      return res.redirect('/login');
    }

    const userId = req.session.user.id;
    const amount = parseFloat(req.body.amount);
    try {
      await UserService.addFunds(userId, amount);
      req.session.message = 'Balance updated successfully';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }
    res.redirect('/profile');
  },

  async deductFunds(req, res) {
    if (!req.session.user) {
      req.session.message = 'Login to deduct funds';
      return res.redirect('/login');
    }

    const userId = req.session.user.id;
    const amount = parseFloat(req.body.amount);
    try {
      await UserService.deductFunds(userId, amount);
      req.session.message = 'Balance updated successfully';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }
  }
};

module.exports = userController;