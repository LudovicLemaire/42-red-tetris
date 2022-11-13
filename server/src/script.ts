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
  get_ready: (mode: GameMode) => void
  start_game: () => void
  connect_error: (err: { message: string }) => void
}

export interface InterServerEvents {
  ping: () => void
}

const httpServer = createServer();
const PORT = 3030;
const allGames: Game[] = [];

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
  socket.on('disconnect', () => {
    void self.leaveRooms();
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
    await self.leaveRooms();
    io.emit('get_games', self.getAllAvailableRoomsReduced());
  });

  socket.on('get_ready', (mode: GameMode) => {
    if (self.isAdmin) {
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
    } else {
      socket.emit('toast', 'error', 'You are not the Captain');
    }
  });

  socket.on('start_game', () => {
    // TODO
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

  /* istanbul ignore next */
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  unitTestsAngular(socket);
});

export function unitTestsAngular (socket: Socket): void {
  socket.on('connect_error_test', () => {
    socket.emit('connect_error_test', 'worked');
  });
}

httpServer.listen(PORT);

console.log('Listen on port:', '\x1b[1m\x1b[32m', PORT.toString(), '\x1b[0m');

// npx ts-node script.ts
