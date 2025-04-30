const { poolPromise } = require('../db/sql');

exports.showSlotPage = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.session.user.id)
      .query('SELECT balance FROM Users WHERE id = @id');

    const balance = result.recordset[0]?.balance || 0;

    res.render('slot', {
      user: req.session.user,
      balance,
      spin: [],
      message: ''
    });
  } catch (err) {
    console.error('Error loading slot page:', err);
    res.send('Server error loading slot machine');
  }
};

exports.spinSlot = async (req, res) => {
  const userId = req.session.user?.id;
  const bet = parseInt(req.body.bet);

  if (!userId || isNaN(bet) || bet <= 0) {
    return res.redirect('/slot');
  }

  try {
    const pool = await poolPromise;

    const userResult = await pool.request()
      .input('id', userId)
      .query('SELECT name, balance FROM Users WHERE id = @id');

    const user = userResult.recordset[0];

    if (!user || user.balance < bet) {
      return res.render('slot', {
        user: req.session.user,
        balance: user?.balance || 0,
        spin: [],
        message: 'Insufficient balance.'
      });
    }

    const spin = [0, 1, 2].map(() => Math.floor(Math.random() * 10));
    let winnings = 0;
    let message = '';

    if (spin[0] === spin[1] && spin[0] === spin[2]) {
      winnings = bet * 10;
      message = 'Jackpot! You win $' + winnings;
    } else if ((spin[0] === spin[1]) || (spin[1] === spin[2])) {
      winnings = bet * 5;
      message = 'Two in a row! You win $' + winnings;
    } else {
      winnings = 0;
      message = 'You lost $' + bet;
    }

    const newBalance = user.balance - bet + winnings;

    await pool.request()
      .input('id', userId)
      .input('balance', newBalance)
      .query('UPDATE Users SET balance = @balance WHERE id = @id');

    res.render('slot', {
      user: req.session.user,
      balance: newBalance,
      spin,
      message
    });
  } catch (err) {
    console.error('Spin error:', err);
    res.send('Error processing slot spin');
  }
};
