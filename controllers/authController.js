const { poolPromise } = require('../db/sql');

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
      req.session.user = { id: user.id, name: user.name };
      res.redirect('/slot');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { name, password } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name', name)
      .input('password', password)
      .input('balance', 50)
      .query('INSERT INTO Users (name, password, balance) VALUES (@name, @password, @balance)');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Registration failed' });
  }
};

exports.profile = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.session.user.id)
      .query('SELECT * FROM Users WHERE id = @id');

    const user = result.recordset[0];
    res.render('profile', { user });
  } catch (err) {
    console.error(err);
    res.send('Error loading profile');
  }
};
