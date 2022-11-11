import { Player } from './player';
const fakeVar: unknown = 'fake';

test('init', () => {
  const player = createPlayer();
  expect(player.id).toBe('randomIdSocket');
  expect(player.name).toBe('Diplodocus');
  expect(player.room).toBe('');
  expect(player.isAdmin).toBe(false);
});

test('editPlayer', () => {
  const player = createPlayer();
  player.name = 'Stegosaurus';
  player.room = 'Room-5';
  player.isAdmin = true;
  expect(player.id).toBe('randomIdSocket');
  expect(player.name).toBe('Stegosaurus');
  expect(player.room).toBe('Room-5');
  expect(player.isAdmin).toBe(true);
});

test('getAdminName', () => {
  const player1 = createPlayer();
  // @ts-expect-error
  const player2 = new Player('id', 'Stegosaurus', fakeVar, fakeVar, fakeVar);
  player2.isAdmin = true;
  expect(player1.getAdminName()).toBe('Diplodocus');
  expect(player2.getAdminName()).toBe('🚀 Stegosaurus');
});

function createPlayer (): Player {
  const playerName = 'Diplodocus';
  const playerId = 'randomIdSocket';
  // @ts-expect-error
  const player = new Player(playerId, playerName, fakeVar, fakeVar, fakeVar);
  return player;
}
