function randDigit() {
    return Math.floor(Math.random() * 10);
  }
  
  exports.showSlot = (req, res) => {
    if (typeof req.session.balance !== 'number') {
      req.session.balance = 50;
    }
  
    res.render('slot', {
      balance: req.session.balance,
      result: null,
      spin: [],
      session: req.session
    });
  };
  
  exports.spin = (req, res) => {
    const bet = parseInt(req.body.bet);
    const balance = req.session.balance;
  
    if (!bet || bet <= 0 || bet > balance) {
      return res.render('slot', {
        balance,
        result: 'Invalid bet amount.',
        spin: [],
        session: req.session
      });
    }
  
    const spin = [randDigit(), randDigit(), randDigit()];
    const [a, b, c] = spin;
    let result = '';
    let win = 0;
  
    if (a === b && b === c) {
      win = bet * 10;
      result = `JACKPOT! You won $${win}`;
    } else if (a === b || b === c) {
      win = bet * 5;
      result = `Two in a row! You won $${win}`;
    } else {
      win = -bet;
      result = `You lost $${bet}`;
    }
  
    req.session.balance += win;
  
    res.render('slot', {
      balance: req.session.balance,
      result,
      spin,
      session: req.session
    });
  };
  