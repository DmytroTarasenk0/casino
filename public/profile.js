function updateBalance() {
  fetch('/balance')
    .then(res => res.json())
    .then(data => {
      if (data.balance !== undefined) {
        document.getElementById('balance').textContent = data.balance;
      }
    });
}

document.querySelector('.add-funds-form form').addEventListener('submit', function(e) {
  e.preventDefault();
  const amount = this.amount.value;

  fetch('/add-funds', {
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