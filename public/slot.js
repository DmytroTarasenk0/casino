const symbols = ['s', 'o', 'S', 'a', 'l', '?'];
const reels = [
  document.getElementById('reel1'), 
  document.getElementById('reel2'), 
  document.getElementById('reel3')
];
const spinBtn = document.querySelector('.btn-spin');
const errorMsg = document.getElementById('error-message');
const spinMsg = document.getElementById('spin-message');
const tryMsg = document.getElementById('try-message');
const amountInput = document.querySelector('.controls form input[name="amount"]');

function spinReel(reel, duration, finalSymbol) {
  const symbolsContainer = document.createElement('div');
  symbolsContainer.className = 'symbols';

  const symbolCount = 500;

  const finalDiv = document.createElement('div');
  finalDiv.textContent = finalSymbol;
  finalDiv.className = 'reel-item';
  symbolsContainer.appendChild(finalDiv);

  for (let i = 0; i < symbolCount; i++) {
    const symbol = document.createElement('div');
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    symbol.className = 'reel-item';
    symbolsContainer.insertBefore(symbol, symbolsContainer.firstChild);
  }

  reel.innerHTML = '';
  reel.appendChild(symbolsContainer);

  symbolsContainer.style.transform = `translateY(-${60 * symbolCount}px)`;

  setTimeout(() => {
    symbolsContainer.style.transition = `transform ${duration}ms cubic-bezier(0.9, 0, 0.3, 0.1)`;
    symbolsContainer.style.transform = `translateY(0px)`;
  }, 50);

  setTimeout(() => {
    reel.innerHTML = '';
    const resultDiv = document.createElement('div');
    resultDiv.textContent = finalSymbol;
    resultDiv.className = 'reel-item';
    reel.appendChild(resultDiv);
  }, duration + 50);
}

function getReelResults() {
  return reels.map(reel => {
    const symbolDiv = reel.querySelector('.reel-item');
    return symbolDiv ? symbolDiv.textContent : null;
  });
}

function checkWin() {
  const results = getReelResults();
  const isWin = results.every(symbol => symbol === results[0]);
  const isStable = results[0]===results[1] || results[1]===results[2];

  if (isWin) {
    const winAmount = 5 * amountInput.value;

    fetch('/add-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `amount=${encodeURIComponent(winAmount)}`
    })
      .then(res => res.json())
      .then(data => {
        if (data.balance) {
          updateBalance();
        }
        if (data.error) {
          errorMsg.textContent = data.error;
          errorMsg.style.display = 'block';
        }
      });

    spinMsg.textContent = 'Jackpot!';
    spinMsg.style.display = 'block';
  } else if (isStable) {
    const winAmount = amountInput.value;

    fetch('/add-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `amount=${encodeURIComponent(winAmount)}`
    })
      .then(res => res.json())
      .then(data => {
        if (data.balance) {
          updateBalance();
        }
        if (data.error) {
          errorMsg.textContent = data.error;
          errorMsg.style.display = 'block';
        }
      });

    spinMsg.textContent = 'You win!';
    spinMsg.style.display = 'block';
   } else {
    tryMsg.textContent = 'Try again';
    tryMsg.style.display = 'block';
  }
}

function updateBalance() {
  fetch('/balance')
    .then(res => res.json())
    .then(data => {
      if (data.balance !== undefined) {
        document.getElementById('balance').textContent = data.balance;
      }
    });
}

spinBtn.addEventListener('click', () => {
  if (spinBtn.disabled) return;
  spinBtn.disabled = true;
  errorMsg.style.display = 'none';
  spinMsg.style.display = 'none';
  tryMsg.style.display = 'none';

  const amount = amountInput.value;

  fetch('/deduct-funds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `amount=${encodeURIComponent(amount)}`
  })
    .then(res => res.json())
    .then(data => {
      if (data.balance) {
        updateBalance();
        const finalSymbols = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        reels.forEach((reel, i) => {
          spinReel(reel, 1200 + i * 300, finalSymbols[i]);
        });

        setTimeout(() => {
          spinBtn.disabled = false;
          checkWin();
        }, 1200 + (reels.length - 1) * 300 + 100);
      }

      if (data.error) {
        errorMsg.textContent = data.error;
        errorMsg.style.display = 'block';
        spinBtn.disabled = false;
      }
    });
});