import { Game } from './game';
import { Player } from './player';
const fakeVar: unknown = 'fake';

test('init', () => {
  const gameId = 'Room-5';
  const game = new Game(gameId);
  expect(game.id).toBe(gameId);
  expect(game.gameMode).toBe('classic');
  expect(game.isAvailable).toBe(true);
  expect(game.members).toHaveLength(0);
});

test('editGame', () => {
  const gameId = 'Room-5';
  const game = new Game(gameId);
  // @ts-expect-error
  const player = new Player('randomIdSocket', 'Diplodocus', fakeVar, fakeVar, fakeVar);
  game.members.push(player);
  game.gameMode = 'battle';
  expect(game.members).toHaveLength(1);
  expect(game.members[0].name).toBe('Diplodocus');
  expect(game.gameMode).toBe('battle');
});
