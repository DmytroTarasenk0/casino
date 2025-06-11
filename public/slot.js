const symbols = ['s', 'o', 'S', 'a', 'l', '?'];
const reels = [
    document.getElementById('reel1'), 
    document.getElementById('reel2'), 
    document.getElementById('reel3')
];

function spinReel(reel, duration) {
  const symbolsContainer = document.createElement('div');
  symbolsContainer.className = 'symbols';

  const symbolCount = 500;
  const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];

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

document.querySelector('.btn-spin').addEventListener('click', () => {
  reels.forEach((reel, i) => {
    spinReel(reel, 1200 + i * 300);
  });
});

function updateBalance() {
  fetch('/balance')
    .then(res => res.json())
    .then(data => {
      if (data.balance !== undefined) {
        document.getElementById('balance').textContent = data.balance;
      }
    });
}

document.querySelector('.controls form').addEventListener('submit', function(e) {
  e.preventDefault();
  const amount = this.amount.value;

  fetch('/deduct-funds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `amount=${encodeURIComponent(amount)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.balance) {
      updateBalance();
      document.getElementById('error-message').style.display = 'none';
    }
    if (data.error) {
      document.getElementById('error-message').textContent = data.error;
      document.getElementById('error-message').style.display = 'block';
    }
  });
});