const COLORS = [
  '#080708',
  '#3772FF',
  '#DF2935',
  '#FDCA40',
  '#E6E8E6',
  '#690375',
];

const gameState = {};

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function resetGame() {
  let colorIds = shuffle([1,1,2,2,3,3,4,4,5,5,0,0]);
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove('flipped');
    cards[i].style.background = null;
    cards[i].setAttribute('data-color-id', colorIds[i]);
  }
  gameState.turn = 0;
  gameState.matches = 0;
  gameState.selected = [];
  gameState.totalTurns = 0;
}

function initBoard() {
  for (let i = 0; i < 12; i++) {
    const container = document.createElement('div');
    container.classList.add('card-container');
    const card = document.createElement('card');
    card.classList.add('card');
    container.append(card);
    game.append(container);
  }
}

// init
const game = document.querySelector('#game');
initBoard();
const cards = document.querySelectorAll('.card');
resetGame();

game.addEventListener('click', handleClick);

function handleClick(e) {
  const card = e.target;
  if (card.classList.contains('card')) {
    if (card.classList.contains('flipped')) return; // do nothing if flipped
    
    // update game state
    gameState.selected.push(card);
    gameState.turn++;

    game.removeEventListener('click', handleClick); // block inputs
    card.classList.toggle('flipped');
    window.setTimeout(() => { // add color to card halfway through animation
      let color = COLORS[card.getAttribute('data-color-id')];
      card.style.background = color;
    }, 250);

    if (gameState.turn === 2) {
      gameState.totalTurns++;
      let c1 = gameState.selected[0];
      let c2 = gameState.selected[1];
      if (c1.getAttribute('data-color-id') === c2.getAttribute('data-color-id')) {
        gameState.matches++;
        game.addEventListener('click', handleClick);
      }
      else {

        window.setTimeout(() => { // hold on unmatched cards for 1 second
          c1.classList.toggle('flipped');
          c2.classList.toggle('flipped');
          c1.style.background = null;
          c2.style.background = null;
          game.addEventListener('click', handleClick);
        }, 1500);
      }
      gameState.selected = [];
      gameState.turn = 0;

      // win condition
      if (gameState.matches === 6) {
        const modal = document.querySelector('.modal-window');
        let stats = `It took you ${gameState.totalTurns} turns to win.`
        modal.querySelector('.game-stats').innerText = stats;
        const closeModal = modal.querySelector('.modal-close');
        closeModal.addEventListener('click', function() {
          closeModal.removeEventListener('click', this);
          modal.classList.remove('opened');
          resetGame();
        });
        modal.classList.add('opened');
      }
    }
    else {
      window.setTimeout(() => game.addEventListener('click', handleClick), 500);
    }
  }
}