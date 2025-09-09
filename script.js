// DOM Elements
const statusDisplay = document.getElementById('status');
const gameBoard = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const cells = document.querySelectorAll('.cell');

// Game Variables
let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the board state

// Winning Conditions (indices of cells that form a win)
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Message Functions
const winningMessage = () => `<span class="player-${currentPlayer}">Player ${currentPlayer}</span> has won!`;
const drawMessage = () => `Game ended in a <span class="draw-text">draw!</span>`;
const currentPlayerTurn = () => `It's <span class="player-${currentPlayer}">${currentPlayer}</span>'s turn`;

// Initial display message
statusDisplay.innerHTML = currentPlayerTurn();

// --- Functions ---

// Handles a cell being clicked
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // If the cell is already filled or game is inactive, do nothing
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update game state and UI
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Updates the UI and game state when a cell is played
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer); // Add class for styling (e.g., color)
}

// Checks for a win or draw
function handleResultValidation() {
    let roundWon = false;
    let winningCombo = null; // Store the winning combination

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue; // Not all three cells are filled yet
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition; // Store the winning combination
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        highlightWinningCells(winningCombo); // Highlight winning cells
        // triggerConfetti(); // Optional: Trigger confetti on win
        return;
    }

    // Check for a draw (if no winner and no empty cells left)
    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // If no win or draw, switch players
    handlePlayerChange();
}

// Switches the current player
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
}

// Resets the game
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('X', 'O', 'winning-cell'); // Remove winning-cell class
    });
    // Remove existing confetti if any
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach(c => c.remove());
}

// Highlights the cells that formed the winning combination
function highlightWinningCells(winningCombo) {
    winningCombo.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

// --- Optional Confetti Effect ---
// This requires a div with class "confetti-container" in your HTML body
// You can add it just before the closing </body> tag:
// <div class="confetti-container"></div>
function triggerConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return; // Exit if container not found

    for (let i = 0; i < 50; i++) { // Generate 50 pieces of confetti
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random positions and animations
        const xStart = Math.random() * window.innerWidth - 200 + 'px'; // Start from anywhere on screen
        const yStart = -Math.random() * window.innerHeight / 2 + 'px'; // Start above screen
        const xEnd = Math.random() * window.innerWidth - 200 + 'px';
        const yEnd = window.innerHeight + 'px';
        const rotationStart = Math.random() * 360 + 'deg';
        const rotationEnd = Math.random() * 720 + 'deg';

        confetti.style.setProperty('--x-start', xStart);
        confetti.style.setProperty('--y-start', yStart);
        confetti.style.setProperty('--x-end', xEnd);
        confetti.style.setProperty('--y-end', yEnd);
        confetti.style.setProperty('--rotation-start', rotationStart);
        confetti.style.setProperty('--rotation-end', rotationEnd);
        confetti.style.left = Math.random() * 100 + '%'; // Initial horizontal spread

        confettiContainer.appendChild(confetti);

        // Remove confetti after animation to prevent DOM clutter
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}


// --- Event Listeners ---
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
