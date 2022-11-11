import { GameMode } from './utils';

test('gameMode', () => {
  let hasError = false;
  try {
    const gameMode: GameMode = 'classic';
    if (gameMode === 'classic') {
      hasError = false;
    }
  } catch (error) {
    hasError = true;
  }
  expect(hasError).toBe(false);
});
