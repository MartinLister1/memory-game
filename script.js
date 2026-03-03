var easyEmojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
var hardEmojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮'];

var currentDifficulty = 'easy';

var firstCard = null;
var secondCard = null;
var matchedPairs = 0;
var moves = 0;
var seconds = 0;
var timerInterval = null;
var gameStarted = false;

// keep separate best scores for easy and hard
var bestEasy = null;
var bestHard = null;

function setDifficulty(level, btn) {
  currentDifficulty = level;

  var buttons = document.querySelectorAll('.difficulty button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  btn.classList.add('active');

  updateBestDisplay();
  startGame();
}

// updates the best score on screen
function updateBestDisplay() {
  var best = null;
  if (currentDifficulty == 'easy') {
    best = bestEasy;
  } else {
    best = bestHard;
  }

  if (best == null) {
    document.getElementById('best').textContent = '-';
  } else {
    document.getElementById('best').textContent = best;
  }
}

function startGame() {

  clearInterval(timerInterval);
  seconds = 0;
  moves = 0;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  gameStarted = false;

  document.getElementById('moves').textContent = '0';
  document.getElementById('pairs').textContent = '0';
  document.getElementById('timer').textContent = '0s';

  updateBestDisplay();

  var emojis = easyEmojis;
  if (currentDifficulty == 'hard') {
    emojis = hardEmojis;
  }

  // found this shuffle method on stackoverflow
  var cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  var grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.className = 'grid ' + currentDifficulty;

  for (var i = 0; i < cards.length; i++) {
    var card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = cards[i];
    card.textContent = '?';
    card.addEventListener('click', handleClick);
    grid.appendChild(card);
  }
}

function startTimer() {
  timerInterval = setInterval(function() {
    seconds++;
    document.getElementById('timer').textContent = seconds + 's';
  }, 1000);
}

function handleClick() {

  if (this.classList.contains('flipped')) return;
  if (this.classList.contains('matched')) return;
  if (firstCard != null && secondCard != null) return;

  if (gameStarted == false) {
    gameStarted = true;
    startTimer();
  }

  this.textContent = this.dataset.emoji;
  this.classList.add('flipped');

  if (firstCard == null) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  document.getElementById('moves').textContent = moves;

  if (firstCard.dataset.emoji == secondCard.dataset.emoji) {

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    firstCard = null;
    secondCard = null;

    matchedPairs++;
    document.getElementById('pairs').textContent = matchedPairs;

    var totalPairs = easyEmojis.length;
    if (currentDifficulty == 'hard') {
      totalPairs = hardEmojis.length;
    }

    if (matchedPairs == totalPairs) {
      clearInterval(timerInterval);

      // check if this is a new best score
      if (currentDifficulty == 'easy') {
        if (bestEasy == null || moves < bestEasy) {
          bestEasy = moves;
          updateBestDisplay();
        }
      } else {
        if (bestHard == null || moves < bestHard) {
          bestHard = moves;
          updateBestDisplay();
        }
      }

      setTimeout(function() {
        alert('You win!! Finished in ' + seconds + ' seconds and ' + moves + ' moves');
      }, 400);
    }

  } else {

    var card1 = firstCard;
    var card2 = secondCard;

    firstCard = null;
    secondCard = null;

    card1.classList.add('wrong');
    card2.classList.add('wrong');

    setTimeout(function() {
      card1.textContent = '?';
      card2.textContent = '?';
      card1.classList.remove('flipped', 'wrong');
      card2.classList.remove('flipped', 'wrong');
    }, 800);

  }
}

startGame();