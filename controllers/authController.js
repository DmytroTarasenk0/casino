const { poolPromise } = require('../db/sql');

exports.register = async (req, res) => {
  const { name, password } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name', name)
      .input('password', password)
      .query('INSERT INTO Users (name, password, balance) VALUES (@name, @password, 50)');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('Registration error');
  }
};

exports.login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', name)
      .input('password', password)
      .query('SELECT * FROM Users WHERE name = @name AND password = @password');

    const user = result.recordset[0];
    if (user) {
      req.session.user = user;
      res.redirect('/profile');
    } else {
      res.send('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.send('Login error');
  }
};

exports.profile = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('profile', { user: req.session.user });
};
