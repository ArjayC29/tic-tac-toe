// sound.js (ES module)
// Handles playing sound effects for Tic Tac Toe

export function playRestartSound() {
  const audio = new Audio('restart.mp3'); // Place restart.mp3 in the same folder
  audio.play();
}

export function playXSound() {
  const audio = new Audio('touch.mp3'); // Place touch.mp3 in the same folder
  audio.play();
}

export function playOSoundWins() {
  const audio = new Audio('computerWins.mp3'); // Place computerWins.mp3 in the same folder
  audio.play();
}
