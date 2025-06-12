function createCard() {
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['♠', '♥', '♦', '♣'];
  const value = values[Math.floor(Math.random() * values.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const card = document.createElement('div');
  card.className = 'card';
  card.textContent = value + suit;
  return card;
}

document.getElementById('add-dealer-card').addEventListener('click', function() {
  document.getElementById('dealer-cards').appendChild(createCard());
});

document.getElementById('add-player-card').addEventListener('click', function() {
  document.getElementById('player-cards').appendChild(createCard());
});

const rulesBox = document.getElementById('rulesBox');
const rulesHeader = document.getElementById('rulesHeader');

rulesHeader.addEventListener('click', function() {
  if (rulesBox.classList.contains('collapsed')) {
    rulesBox.style.transition = 'width 1.5s cubic-bezier(0, 0, 0.6, 0.9), opacity 2s';
    rulesBox.classList.remove('collapsed');
  } else {
    rulesBox.style.transition = 'width 1s cubic-bezier(0.3, 0.1, 0.9, 0), opacity 1s';
    rulesBox.classList.add('collapsed');
  }
});