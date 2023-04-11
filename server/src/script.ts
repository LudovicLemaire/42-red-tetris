import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { Player } from './player';
import { Game } from './game';
import { GameMode } from './utils';

export interface ServerToClientEvents {
  basicEmit: (a: number, b: string, c: Buffer) => void
  message: (message: string) => void
  info: (user: string, name: string, type: string, message: string) => void
  info_room: (npxuser: string, name: string, type: string, message: string) => void
  get_boards: (boards: { [key: string]: { name: string, board: number[][], hasLost: boolean, score: number, lineBlocked: number } }) => void
  get_player_board: (boards: { board: number[][], sack: number[], currentPiece: number, chaosPieceRemaining: number, chaosPieceAvailable: number, hasLost: boolean, score: number, lineBlocked: number }) => void
  game_ended: () => void
  toast: (type: string, message: string, emoji?: string) => void
  self_get_room: (room: string) => void
  self_is_admin: (isAdmin: boolean) => void
  get_games: (rooms: { [key: string]: number }) => void
  get_room_members: (
    members: Array<{ id: string, name: string, isAdmin: boolean }>
  ) => void
  kicked: (kicked: boolean) => void
  get_ready: (v: boolean) => void
  reset: () => void
}

export interface ClientToServerEvents {
  message: (message: string) => void
  message_room: (message: string) => void
  rename: (name: string) => void
  join_room: (room: string) => void
  leave_rooms: () => void
  create_room: (room: string) => void
  set_game_availability: (v: boolean) => void
  get_games: () => void
  kick_from_room: (id: string) => void
  set_admin: (id: string) => void
  get_room_members: () => void
  get_ready: (mode: GameMode) => void
  move_piece: (direction: string) => void
  add_chaos_piece: () => void
  connect_error: (err: { message: string }) => void
  test_self_get_room: () => void
}

export interface InterServerEvents {
  ping: () => void
}

const httpServer = createServer();
const PORT = 3030;
const allGames: Game[] = [];
const allInterval: Map<String, NodeJS.Timer> = new Map();

const io = new Server<
ClientToServerEvents,
ServerToClientEvents,
InterServerEvents
>(httpServer, {
  cors: {
    origin: '*', // http://localhost:4200/
    credentials: true
  }
});

io.close();

// TODO
// create Piece class

io.on('connection', async (socket) => {
  const self = new Player(socket.id, socket.id.slice(0, 4), socket, io, allGames);
  socket.emit('reset');
  socket.emit('get_games', self.getAllAvailableRoomsReduced());

  io.emit('info', `${socket.id}`, `${self.name}`, 'connected', '');
  socket.on('disconnect', async () => {
    if (self.room === '') { return; }
    self.board.hasLost = true;
    const boardSpectra: { [id: string]: { name: string, board: number[][], hasLost: boolean, score: number, lineBlocked: number } } = {};
    const spectraBoard = self.board.getSpectra();
    boardSpectra[self.id] = { name: self.name, board: spectraBoard, hasLost: self.board.hasLost, score: self.board.score, lineBlocked: self.board.selfLB };
    io.in(self.room).emit(
      'get_boards',
      boardSpectra
    );
    await self.leaveRooms();
    io.emit('info', `${socket.id}`, `${self.name}`, 'disconnected', '');
    io.emit('get_games', self.getAllAvailableRoomsReduced());
  });

  socket.on('message', (message: string) => {
    io.emit('info', `${socket.id}`, `${self.name}`, 'message', `${message}`);
  });

  socket.on('message_room', (message: string) => {
    if (self.room !== '' && self.room !== undefined) {
      io.in(self.room).emit(
        'info_room',
        `${socket.id}`,
        `${self.getAdminName()}`,
        'message_room',
        `${message}`
      );
    }
  });

  socket.on('rename', (name: string) => {
    io.emit(
      'info',
      `${socket.id}`,
      `${self.name}`,
      'rename',
      `${self.name} renamed himself as ${name.slice(0, 15)}`
    );
    const oldName = self.name;
    self.name = name.slice(0, 15);
    if (self.room !== '' && self.room !== undefined) {
      io.in(self.room).emit('get_room_members', self.getRoomMembers(self.room));
      io.in(self.room).emit(
        'info_room',
        `${socket.id}`,
        `${self.name}`,
        'rename_room',
        `${oldName} renamed himself as ${self.name}`
      );
    }
  });

  socket.on('join_room', async (room: string) => {
    if (room === self.room) return;
    const roomIndex = allGames.findIndex((element) => element.id === room);
    if (roomIndex !== -1) {
      if (allGames[roomIndex].isAvailable) {
        await self.joinRoom(room);
        socket.emit('toast', 'info', 'You joined ' + room);
      } else {
        socket.emit('toast', 'error', 'That room name is already taken');
      }
    } else {
      // create room
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      io.emit(
        'info',
        `${socket.id}`,
        `${self.name}`,
        'create_room',
        `${self.name} created ${room} room`
      );
      self.isAdmin = true;
      socket.emit('self_is_admin', self.isAdmin);
      socket.emit('toast', 'show', 'You are the captain of ' + room + ' !');
    }
  });

  socket.on('leave_rooms', async () => {
    if (self.room === '') { return; }
    self.board.hasLost = true;
    const boardSpectra: { [id: string]: { name: string, board: number[][], hasLost: boolean, score: number, lineBlocked: number } } = {};
    const spectraBoard = self.board.getSpectra();
    boardSpectra[self.id] = { name: self.name, board: spectraBoard, hasLost: self.board.hasLost, score: self.board.score, lineBlocked: self.board.selfLB };
    io.in(self.room).emit(
      'get_boards',
      boardSpectra
    );
    await self.leaveRooms();
    io.emit('get_games', self.getAllAvailableRoomsReduced());
  });

  socket.on('get_ready', (mode: GameMode) => {
    if (self.isAdmin) {
      if (!['classic', 'battle', 'blind', 'free', 'semi-chaos', 'pvp-chaos'].includes(mode)) { return; }
      io.in(self.room).emit('get_ready', true);
      const roomIndex = allGames.findIndex(
        (element) => element.id === self.room
      );
      allGames[roomIndex].gameMode = mode;
      io.in(self.room).emit(
        'info_room',
        `${self.id}`,
        `${self.name}`,
        'new_admin_room',
        `🚀  Prepare for launch ! ${mode} mode has been chosen.`
      );
      test();
    } else {
      socket.emit('toast', 'error', 'You are not the Captain');
    }
  });

  socket.on('set_game_availability', (v: boolean) => {
    if (self.isAdmin) {
      const roomIndex = allGames.findIndex(
        (element) => element.id === self.room
      );
      allGames[roomIndex].isAvailable = v;
      io.emit('get_games', self.getAllAvailableRoomsReduced());
    } else {
      socket.emit('toast', 'error', 'You are not the Captain');
    }
  });

  socket.on('get_games', () => {
    socket.emit('get_games', self.getAllAvailableRoomsReduced());
  });

  socket.on('kick_from_room', (id: string) => {
    if (!self.isAdmin) return;
    if (self.id === id) {
      socket.emit('toast', 'error', "You can't jettison yourself");
      return;
    }
    kickPlayer(id);
  });

  socket.on('set_admin', (id: string) => {
    if (!self.isAdmin || self.id === id) return;
    const roomIndex = allGames.findIndex((element) => element.id === self.room);
    if (roomIndex !== -1) {
      for (const member of allGames[roomIndex].members) {
        if (member.id === id) {
          member.isAdmin = true;
          self.isAdmin = false;
          io.to(member.id).emit(
            'toast',
            'show',
            'Congratulations !</br>You have been promoted to Captain.'
          );
          io.to(member.id).emit('self_is_admin', true);
          socket.emit('self_is_admin', false);
          socket.emit(
            'toast',
            'info',
            "You convey your Captain's hat to " + member.name
          );
          io.in(self.room).emit(
            'info_room',
            `${self.id}`,
            `${member.name}`,
            'new_admin_room',
            `🚀 ${member.name} has been promoted to Captain !`
          );
          io.in(self.room).emit('get_room_members', self.getRoomMembers(self.room));
        }
      }
    }
  });

  socket.on('get_room_members', () => {
    if (self.room === '') { return; }
    io.in(self.room).emit('get_room_members', self.getRoomMembers(self.room));
  });

  socket.on('move_piece', (direction) => {
    if (self.board.hasLost) { return; }
    if ((direction === 'ArrowRight' || direction === 'ArrowLeft' || direction === 'ArrowDown' || direction === 'ArrowUp' || direction === ' ') && self.room !== '' && !self.board.hasLost) {
      if (direction === ' ') {
        self.board.dropPiece();
        if (!self.board.addPiece()) {
          console.log(self.name, 'GAME FAILED');
          self.board.hasLost = true;
        }
      }
      if (direction === 'ArrowDown') {
        if (!self.board.fall()) {
          if (!self.board.addPiece()) {
            console.log(self.name, 'GAME FAILED');
            self.board.hasLost = true;
          }
        }
      }
      if (direction === 'ArrowUp') {
        self.board.rotatePiece();
      }
      if (direction === 'ArrowRight') {
        self.board.moveRightPiece();
      }
      if (direction === 'ArrowLeft') {
        self.board.moveLeftPiece();
      }

      if (!self.board.hasLost) {
        self.board.placeGhost();
      }
      const boardPlayer = { board: self.board.board, sack: self.board.currentSack, currentPiece: self.board.currentPiece - 1, chaosPieceRemaining: self.board.chaosPieceRemaining === 0 && self.board.currentChaosPiece.length > 0 ? 1 : self.board.chaosPieceRemaining, chaosPieceAvailable: self.board.getChaosPieceAvailable(), hasLost: self.board.hasLost, score: self.board.score, lineBlocked: self.board.selfLB };
      const boardSpectra: { [id: string]: { name: string, board: number[][], hasLost: boolean, score: number, lineBlocked: number } } = {};
      const spectraBoard = self.board.getSpectra();
      boardSpectra[self.id] = { name: self.name, board: spectraBoard, hasLost: self.board.hasLost, score: self.board.score, lineBlocked: self.board.selfLB };
      io.to(self.id).emit(
        'get_player_board',
        boardPlayer
      );
      if (self.board.piecePlaced) {
        io.in(self.room).emit(
          'get_boards',
          boardSpectra
        );
        self.board.piecePlaced = false;
      }
    }
  });

  socket.on('add_chaos_piece', () => {
    const roomIndex = allGames.findIndex((element) => element.id === self.room);
    if (!(roomIndex in allGames)) { return; }
    if (self.board.getChaosPieceAvailable() <= 0 || allGames[roomIndex].gameMode !== 'pvp-chaos') { return; }
    for (const member of allGames[roomIndex].members) {
      if (!member.board.hasLost && member.id !== self.id) {
        member.board.chaosPieceRemaining++;
      }
    }
    self.board.incrementChaosPieceSent();

    const boardPlayer = { board: self.board.board, sack: self.board.currentSack, currentPiece: self.board.currentPiece - 1, chaosPieceRemaining: self.board.chaosPieceRemaining === 0 && self.board.currentChaosPiece.length > 0 ? 1 : self.board.chaosPieceRemaining, chaosPieceAvailable: self.board.getChaosPieceAvailable(), hasLost: self.board.hasLost, score: self.board.score, lineBlocked: self.board.selfLB };
    io.to(self.id).emit(
      'get_player_board',
      boardPlayer
    );
  });

  /* istanbul ignore next */
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  unitTestsAngular(socket);

  function test (): void {
    // TODO clear l'interval quand la room meurt
    const room = self.room;
    const boards: { [id: string]: { name: string, board: number[][], hasLost: boolean, score: number, lineBlocked: number } } = {};
    const roomIndex = allGames.findIndex((element) => element.id === self.room);
    const seed = Math.floor(Math.random() * 42000);
    for (const member of allGames[roomIndex].members) {
      member.board.init(seed, allGames[roomIndex].gameMode);
      const spectraBoard = member.board.getSpectra();
      boards[member.id] = { name: member.name, board: spectraBoard, hasLost: member.board.hasLost, score: member.board.score, lineBlocked: member.board.selfLB };
    }
    setTimeout(() => {
      checkClearInterval(room);
      if (!(roomIndex in allGames)) { return; }
      for (const member of allGames[roomIndex].members) {
        const playerBoard = { board: member.board.board, sack: member.board.currentSack, currentPiece: member.board.currentPiece - 1, chaosPieceRemaining: member.board.chaosPieceRemaining === 0 && member.board.currentChaosPiece.length > 0 ? 1 : member.board.chaosPieceRemaining, chaosPieceAvailable: member.board.getChaosPieceAvailable(), hasLost: member.board.hasLost, score: member.board.score, lineBlocked: member.board.selfLB };
        io.to(member.id).emit(
          'get_player_board',
          playerBoard
        );
      }
      io.in(room).emit(
        'get_boards',
        boards
      );
      allInterval.set(room, setInterval(function () {
        if (allGames[roomIndex] === null || allGames[roomIndex] === undefined) {
          console.log('no more player');
          checkClearInterval(room);
          return;
        }
        // TODO check if all lost
        const allLB: number[] = [];
        let allPlayerLost: boolean = true;
        for (const member of allGames[roomIndex].members) {
          allLB.push(member.board.lineCompleted);
          if (!member.board.hasLost) { allPlayerLost = false; }
        }
        if (allPlayerLost) {
          // clear game to restart
          checkClearInterval(room);
          allGames[roomIndex].isAvailable = true;
          io.in(room).emit(
            'game_ended'
          );
          return;
        }
        allLB.sort((a, b) => b - a);
        const totalLB = allLB.reduce((a, b) => a + b, 0);
        const boardsToSend: { [id: string]: { name: string, board: number[][], hasLost: boolean, score: number, lineBlocked: number } } = {};
        for (const member of allGames[roomIndex].members) {
          if (!member.board.hasLost) {
            if (member.board.mode === 'classic') {
              member.board.selfLB = totalLB - member.board.lineCompleted <= 0 ? 0 : totalLB - member.board.lineCompleted;
            } else if (member.board.mode === 'battle' || member.board.mode === 'blind') {
              if (allGames[roomIndex].members.length > 0) {
                if (allLB[0] === member.board.lineCompleted) {
                  member.board.selfLB = allLB[1];
                } else {
                  member.board.selfLB = allLB[0];
                }
              }
            }
            if (!member.board.fall()) {
              if (!member.board.addPiece()) {
                console.log(member.name, 'game failed');
                member.board.hasLost = true;
              }
            }
            if (!member.board.hasLost) { member.board.placeGhost(); }

            // send to player
            const playerBoard = { board: member.board.board, sack: member.board.currentSack, currentPiece: member.board.currentPiece - 1, chaosPieceRemaining: member.board.chaosPieceRemaining === 0 && member.board.currentChaosPiece.length > 0 ? 1 : member.board.chaosPieceRemaining, chaosPieceAvailable: member.board.getChaosPieceAvailable(), hasLost: member.board.hasLost, score: member.board.score, lineBlocked: member.board.selfLB };
            io.to(member.id).emit(
              'get_player_board',
              playerBoard
            );
            if (member.board.piecePlaced) {
              const spectraBoard = member.board.getSpectra();
              boardsToSend[member.id] = { name: member.name, board: spectraBoard, hasLost: member.board.hasLost, score: member.board.score, lineBlocked: member.board.selfLB };
              member.board.piecePlaced = false;
            }
          }
        }
        io.in(room).emit(
          'get_boards',
          boardsToSend
        );
      }, 1000)); // 1500
    }, 3500);
  }

  function kickPlayer (id: string): void {
    const roomIndex = allGames.findIndex((element) => element.id === self.room);
    if (roomIndex !== -1) {
      for (const member of allGames[roomIndex].members) {
        if (member.id === id) {
          // delete user from game members
          const memberIndexToRemove = allGames[roomIndex].members.findIndex(
            (element) => element.id === id
          );
          if (memberIndexToRemove > -1) { allGames[roomIndex].members.splice(memberIndexToRemove, 1); }
          member.room = '';
          io.to(member.id).emit('kicked', true);
          io.to(member.id).emit(
            'toast',
            'warning',
            'You have been jettisoned in space'
          );
          io.to(member.id).emit('self_get_room', member.room);
          socket.emit('toast', 'info', 'You jettisoned ' + member.name);
          io.in(self.room).emit(
            'info_room',
            `${self.id}`,
            `${self.name}`,
            'leave_room',
            `${member.name} have been jettisoned in space`
          );
          io.in(self.room).emit('get_room_members', self.getRoomMembers(self.room));
          io.emit('get_games', self.getAllAvailableRoomsReduced());
        }
      }
    }
  }

  function checkClearInterval (room: String): void {
    if (allInterval.get(room) !== null && allInterval.get(room) !== undefined) {
      clearInterval(allInterval.get(room));
      allInterval.delete(room);
    }
  }
});

export function unitTestsAngular (socket: Socket): void {
  socket.on('get_ready_test', () => {
    socket.emit('get_ready', true);
  });

  socket.on('self_get_room_test', () => {
    socket.emit('self_get_room', 'Room-42');
  });

  socket.on('self_is_admin_test', () => {
    socket.emit('self_is_admin', true);
  });

  socket.on('info_test', () => {
    socket.emit('info', 'abcde', 'Globy', 'message', 'Hello there');
  });

  socket.on('info_room_test', () => {
    socket.emit('info_room', 'abcde', 'Globy', 'message', 'Hello there');
  });

  socket.on('get_games_test', () => {
    const games: { [key: string]: number } = {};
    games['Room-42'] = 1;
    socket.emit('get_games', games);
  });

  socket.on('toast_test', () => {
    socket.emit('toast', 'info', 'Congrats ! You now have the captain\'s hat');
  });

  socket.on('reset_test', () => {
    socket.emit('reset', true);
  });

  socket.on('kicked_test', () => {
    socket.emit('kicked', true);
  });

  socket.on('get_room_members_test', () => {
    const members: Array<{ id: string, name: string, isAdmin: boolean }> = [];
    members.push({ id: 'abcde', name: 'Globy', isAdmin: true });
    socket.emit('get_room_members', members);
  });
}

httpServer.listen(PORT);

console.log('Listen on port:', '\x1b[1m\x1b[32m', PORT.toString(), '\x1b[0m');

// npx ts-node script.ts
