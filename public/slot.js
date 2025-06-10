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
    symbolsContainer.style.transform = `translateY(20px)`;
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