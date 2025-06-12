const playerBetSection = document.getElementById('player-bet-section');
const playerHandSection = document.getElementById('player-hand-section');
const dealerCards = document.getElementById('dealer-cards');
const playerCards = document.getElementById('player-cards');
const betForm = document.getElementById('bet-form');
const betInput = document.getElementById('bet-amount');
const betError = document.getElementById('bet-error');
const actions = document.getElementById('blackjackActions');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const doubleBtn = document.getElementById('double-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const balanceDisplay = document.getElementById('balance');
const msgBox = document.getElementById('message');

let deck = [];
let playerHand = [];
let dealerHand = [];
let bet = 0;
let playerCanDouble = true;
let roundOver = false;

function showMsg(msg, type = 'blackjack') {
  if (type === 'lose') {
    msgBox.className = 'blackjack-message lose-message';
  } else {
    msgBox.className = 'blackjack-message';
  }
  msgBox.textContent = msg;
  msgBox.style.display = 'block';
}
function showError(msg) {
  msgBox.className = 'error-message';
  msgBox.textContent = msg;
  msgBox.style.display = 'block';
}

function hideMsg() { msgBox.style.display = 'none'; }

function updateBalance() {
  fetch('/balance')
    .then(res => res.json())
    .then(data => {
      if (data.balance !== undefined) balanceDisplay.textContent = data.balance;
    });
}

function showActions(show) {
  actions.style.display = show ? 'flex' : 'none';
  hitBtn.disabled = !show;
  standBtn.disabled = !show;
  doubleBtn.disabled = !show || !playerCanDouble;
}

function resetUI() {
  playerBetSection.style.display = '';
  playerHandSection.style.display = 'none';
  betInput.disabled = false;
  betInput.value = '';
  betError.style.display = 'none';
  showActions(false);
  hideMsg();
  playAgainBtn.style.display = 'none';
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
}

function createDeck() {
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['♠', '♥', '♦', '♣'];
  const deck = [];
  for (const suit of suits) for (const value of values) deck.push({ value, suit });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCard() {
  if (deck.length === 0) deck = createDeck();
  return deck.pop();
}

function handValue(hand) {
  let value = 0, aces = 0;
  for (const card of hand) {
    if (card.value === 'A') { value += 11; aces++; }
    else if (['K', 'Q', 'J'].includes(card.value)) value += 10;
    else value += parseInt(card.value, 10);
  }
  while (value > 21 && aces > 0) { value -= 10; aces--; }
  return value;
}

function addCardToHand(parent, card, faceDown = false) {
  const div = document.createElement('div');
  div.className = 'card' + (faceDown ? ' face-down' : '');
  div.textContent = faceDown ? '' : card.value + card.suit;
  div.style.opacity = '0';
  parent.appendChild(div);
  setTimeout(() => {
    div.style.transition = 'opacity 0.8s';
    div.style.opacity = '1';
  }, 30);
}

function renderHands(revealDealer = false) {
  while (playerCards.children.length < playerHand.length) {
    addCardToHand(playerCards, playerHand[playerCards.children.length]);
  }

  while (dealerCards.children.length < dealerHand.length) {
    const idx = dealerCards.children.length;
    if (idx === 0 && !revealDealer) {
      addCardToHand(dealerCards, dealerHand[0], true);
    } else {
      addCardToHand(dealerCards, dealerHand[idx]);
    }
  }

  if (revealDealer && dealerCards.children.length > 0) {
    const first = dealerCards.children[0];
    first.classList.remove('face-down');
    first.textContent = dealerHand[0].value + dealerHand[0].suit;
  }
}

function startRound() {
  deck = createDeck();
  playerHand = [];
  dealerHand = [];
  roundOver = false;
  playerCanDouble = true;

  playerBetSection.style.display = 'none';
  playerHandSection.style.display = '';
  showActions(false);
  playAgainBtn.style.display = 'none';
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';

  setTimeout(() => {
    playerHand.push(drawCard());
    renderHands(false);
  }, 500);
  setTimeout(() => {
    dealerHand.push(drawCard());
    renderHands(false);
  }, 1000);
  setTimeout(() => {
    playerHand.push(drawCard());
    renderHands(false);
  }, 1500);
  setTimeout(() => {
    dealerHand.push(drawCard());
    renderHands(false);
    showActions(true);
    doubleBtn.disabled = false;
    playerCanDouble = true;

    const playerVal = handValue(playerHand);
    if (playerVal === 21) {
      showActions(false);
      setTimeout(() => {
        renderHands(true);
        if (handValue(dealerHand) === 21) {
          showMsg("Push! Casino wins.", 'lose');
        } else {
          showMsg("Blackjack! You win 3:2 payout.");
          fetch('/add-funds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `amount=${encodeURIComponent(Math.floor(bet * 2.5))}`
          }).then(updateBalance);
        }
        playAgainBtn.style.display = '';
        roundOver = true;
      }, 1200);
    }
  }, 2000);
}

function playerHit() {
  if (roundOver) return;
  playerHand.push(drawCard());
  renderHands(false);
  playerCanDouble = false;
  doubleBtn.disabled = true;
  const val = handValue(playerHand);
  if (val > 21) {
    showActions(false);
    setTimeout(() => {
      renderHands(true);
      showMsg("Bust! You lose.", 'lose');
      playAgainBtn.style.display = '';
      roundOver = true;
    }, 1000);
  }
}

function playerStand() {
  if (roundOver) return;
  showActions(false);
  dealerTurn();
}

function playerDouble() {
  if (roundOver || !playerCanDouble) return;
  fetch('/deduct-funds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `amount=${encodeURIComponent(bet)}`
  }).then(res => res.json()).then(data => {
    if (data.error) {
      showError(data.error);
      return;
    }
    updateBalance();
    playerHand.push(drawCard());
    renderHands(false);
    playerCanDouble = false;
    doubleBtn.disabled = true;
    showActions(false);
    bet *= 2;
    setTimeout(dealerTurn, 800);
  });
}

function dealerTurn() {
  renderHands(true);
  let i = dealerHand.length;
  function dealerDraw() {
    let dealerVal = handValue(dealerHand);
    if (dealerVal < 17) {
      setTimeout(() => {
        dealerHand.push(drawCard());
        renderHands(true);
        dealerDraw();
      }, 1500);
    } else {
      setTimeout(() => checkWinner(), 1000);
    }
  }
  dealerDraw();
}

function checkWinner() {
  const playerVal = handValue(playerHand);
  const dealerVal = handValue(dealerHand);

  if (playerVal > 21) {
    showMsg("Bust! You lose.", 'lose');
  } else if (playerVal === 21 && playerHand.length === 2 && !(dealerVal === 21 && dealerHand.length === 2)) {
    showMsg("Blackjack! You win 3:2 payout.");
    fetch('/add-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `amount=${encodeURIComponent(Math.floor(bet * 2.5))}`
    }).then(updateBalance);
  } else if (dealerVal > 21) {
    showMsg("Dealer busts! You win.");
    fetch('/add-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `amount=${encodeURIComponent(bet * 2)}`
    }).then(updateBalance);
  } else if (dealerVal === 21 && dealerHand.length === 2 && !(playerVal === 21 && playerHand.length === 2)) {
    showMsg("Dealer has Blackjack! You lose.", 'lose');
  } else if (playerVal > dealerVal) {
    showMsg("You win!");
    fetch('/add-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `amount=${encodeURIComponent(bet * 2)}`
    }).then(updateBalance);
  } else if (playerVal < dealerVal) {
    showMsg("You lose.", 'lose');
  } else {
    showMsg("Push! Casino wins."), 'lose';
  }
  playAgainBtn.style.display = '';
  roundOver = true;
}

betForm.addEventListener('submit', function(e) {
  e.preventDefault();
  bet = parseInt(betInput.value, 10);
  if (isNaN(bet) || bet <= 0) {
    betError.textContent = 'Enter a valid bet!';
    betError.style.display = 'block';
    return;
  }
  betError.style.display = 'none';
  betInput.disabled = true;

  fetch('/deduct-funds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `amount=${encodeURIComponent(bet)}`
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        betError.textContent = data.error;
        betError.style.display = 'block';
        betInput.disabled = false;
      } else {
        updateBalance();
        startRound();
      }
    });
});

hitBtn.addEventListener('click', playerHit);
standBtn.addEventListener('click', playerStand);
doubleBtn.addEventListener('click', playerDouble);

playAgainBtn.addEventListener('click', resetUI);

const rulesBox = document.getElementById('rulesBox');
const rulesHeader = document.getElementById('rulesHeader');
if (rulesHeader && rulesBox) {
  rulesHeader.addEventListener('click', function() {
    if (rulesBox.classList.contains('collapsed')) {
      rulesBox.style.transition = 'width 1.5s cubic-bezier(0, 0, 0.6, 0.9), opacity 2s';
      rulesBox.classList.remove('collapsed');
    } else {
      rulesBox.style.transition = 'width 1s cubic-bezier(0.3, 0.1, 0.9, 0), opacity 1s';
      rulesBox.classList.add('collapsed');
    }
  });
}