// scoreboard.js
// Handles scoreboard tracking and localStorage persistence for Tic Tac Toe


export const SCORE_KEYS = {
  x: 'tic_score_x',
  o: 'tic_score_o',
  draw: 'tic_score_draw'
};

export function getScore(key) {
  return parseInt(localStorage.getItem(SCORE_KEYS[key]) || '0', 10);
}
export function setScore(key, value) {
  localStorage.setItem(SCORE_KEYS[key], value);
}
export function updateScoreboard() {
  document.getElementById('score-x').textContent = `X: ${getScore('x')}`;
  document.getElementById('score-o').textContent = `O: ${getScore('o')}`;
  document.getElementById('score-draw').textContent = `Draw: ${getScore('draw')}`;
}
export function addWin(player) {
  const key = player === 'X' ? 'x' : 'o';
  setScore(key, getScore(key) + 1);
  updateScoreboard();
}
export function addDraw() {
  setScore('draw', getScore('draw') + 1);
  updateScoreboard();
}
export function resetScores() {
  setScore('x', 0);
  setScore('o', 0);
  setScore('draw', 0);
  updateScoreboard();
}

// Call updateScoreboard() on page load
updateScoreboard();
