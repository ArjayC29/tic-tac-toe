import { addWin,addDraw, updateScoreboard } from "./scoreboard.js";  
import { playRestartSound, playXSound, playOSoundWins } from "./sound.js";  
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const messageDiv = document.getElementById('game-message');
let matrix = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let currentPlayer = 'X';
const computerPlayer = 'O';
let gameActive = true;

function getCellIndex(row, col) {
  return row * 3 + col;
}
function getRowCol(index) {
  return [Math.floor(index / 3), index % 3];
}
function renderBoard() {
  cells.forEach((cell, idx) => {
    const [row, col] = getRowCol(idx);
    cell.textContent = matrix[row][col];
    cell.className = 'cell';
    if (matrix[row][col] === 'X') cell.classList.add('x');
    if (matrix[row][col] === 'O') cell.classList.add('o');
  });
}
function checkWin(player) {
  // Rows, cols, diags
  for (let i = 0; i < 3; i++) {
    if (matrix[i][0] === player && matrix[i][1] === player && matrix[i][2] === player) return [[i,0],[i,1],[i,2]];
    if (matrix[0][i] === player && matrix[1][i] === player && matrix[2][i] === player) return [[0,i],[1,i],[2,i]];
  }
  if (matrix[0][0] === player && matrix[1][1] === player && matrix[2][2] === player) return [[0,0],[1,1],[2,2]];
  if (matrix[0][2] === player && matrix[1][1] === player && matrix[2][0] === player) return [[0,2],[1,1],[2,0]];
  return null;
}
function checkDraw() {
  return cells.length === Array.from(cells).filter((cell, idx) => {
    const [row, col] = getRowCol(idx);
    return matrix[row][col] !== '';
  }).length;
}
function highlightWin(winCells) {
  winCells.forEach(([row, col]) => {
    const idx = getCellIndex(row, col);
    cells[idx].classList.add('highlight');
  });
}
function setMessage(msg, type = '') {
  messageDiv.textContent = msg;
  messageDiv.className = 'game-message';
  if (type) messageDiv.classList.add(type);
}

function playerMove(e) {
  if (!gameActive) return;
  const idx = +e.target.dataset.cellIndex;
  const [row, col] = getRowCol(idx);
  if (matrix[row][col] !== '') return;
  matrix[row][col] = currentPlayer;
  renderBoard();
  playXSound(); // Play sound when X is placed
  let win = checkWin(currentPlayer);
  if (win) {
    gameActive = false;
    highlightWin(win);
    setMessage('You win!', 'win');
    addWin('X');
    return;
  }
  if (checkDraw()) {
    gameActive = false;
    setMessage('Draw!', 'draw');
    addDraw();
    return;
  }
  setMessage("Computer's turn...");
  setTimeout(computerMove, 400);
}
function computerMove() {
  if (!gameActive) return;
  // Use minimax to find best move
  let bestScore = -Infinity;
  let move;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (matrix[r][c] === '') {
        matrix[r][c] = computerPlayer;
        let score = minimax(matrix, 0, false);
        matrix[r][c] = '';
        if (score > bestScore) {
          bestScore = score;
          move = [r, c];
        }
      }
    }
  }
  if (move) {
    const [row, col] = move;
    matrix[row][col] = computerPlayer;
    renderBoard();
    let win = checkWin(computerPlayer);
    if (win) {
      gameActive = false;
      highlightWin(win);
      setMessage('Computer wins!', 'lose');
      addWin('O');
      playOSoundWins(); // Play sound when O wins
      return;
    }
    if (checkDraw()) {
      gameActive = false;
      setMessage('Draw!', 'draw');
      addDraw();
      return;
    }
  }
  setMessage('Your turn!');
}

function minimax(board, depth, isMaximizing) {
  let winnerX = checkWin('X');
  let winnerO = checkWin('O');
  if (winnerO) return 10 - depth;
  if (winnerX) return depth - 10;
  if (board.flat().every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === '') {
          board[r][c] = computerPlayer;
          let score = minimax(board, depth + 1, false);
          board[r][c] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === '') {
          board[r][c] = 'X';
          let score = minimax(board, depth + 1, true);
          board[r][c] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}
function restartGame() {
  matrix = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  gameActive = true;
  renderBoard();
  setMessage('Your turn!');
  playRestartSound(); // Play sound on restart
}
cells.forEach(cell => cell.addEventListener('click', playerMove));
restartBtn.addEventListener('click', restartGame);
renderBoard();
setMessage('Your turn!');

