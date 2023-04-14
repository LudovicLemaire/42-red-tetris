/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/restrict-template-expressions */
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, unitTestsAngular } from './script';
import { Game } from './game';
import { Player } from './player';

describe('socket part', () => {
  let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>;
  let serverSocket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>;
  let clientSocket: { on: (arg0: string, arg1: jest.DoneCallback) => void, close: () => void, emit: (arg0: string, arg1: (arg: unknown) => void) => void };
  const httpServer = createServer();
  const PORT = 3040;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allGames: Game[] = [];
  let self: Player;
  const sockets: { [key: string]: { on: (arg0: string, arg1: jest.DoneCallback) => void, close: () => void, emit: (arg0: string, arg1: (arg: unknown) => void) => void } } = {};

  beforeAll((done) => {
    io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents
    >(httpServer, {
      cors: {
        origin: '*', // http://localhost:4200/
        credentials: true
      }
    });
    httpServer.listen(PORT);
    const mainUrl = 'http://localhost:3030';
    // @ts-expect-error
    clientSocket = new Client(`http://localhost:${PORT}`);
    // @ts-expect-error
    sockets.getReady = new Client(mainUrl);
    // @ts-expect-error
    sockets.setGameAvailability = new Client(mainUrl);
    // @ts-expect-error
    sockets.joinRoom1 = new Client(mainUrl);
    // @ts-expect-error
    sockets.joinRoom2 = new Client(mainUrl);
    // @ts-expect-error
    sockets.getGames = new Client(mainUrl);
    // @ts-expect-error
    sockets.message = new Client(mainUrl);
    // @ts-expect-error
    sockets.messageRoom = new Client(mainUrl);
    // @ts-expect-error
    sockets.rename = new Client(mainUrl);
    // @ts-expect-error
    sockets.setAdmin1 = new Client(mainUrl);
    // @ts-expect-error
    sockets.setAdmin2 = new Client(mainUrl);
    // @ts-expect-error
    sockets.kickFromRoom1 = new Client(mainUrl);
    // @ts-expect-error
    sockets.kickFromRoom2 = new Client(mainUrl);
    // @ts-expect-error
    sockets.getRoomMembers = new Client(mainUrl);

    // @ts-expect-error
    sockets.testConnectError = new Client(mainUrl);

    io.on('connection', (socket) => {
      serverSocket = socket;
      self = new Player(serverSocket.id, serverSocket.id.slice(0, 4), serverSocket, io, allGames);
    });
    clientSocket.on('connect', done);
    for (const property in sockets) {
      sockets[property].on('connect', done);
    }
  });

  afterAll((done) => {
    io.close();
    clientSocket.close();
    for (const property in sockets) {
      sockets[property].close();
    }
    httpServer.close();
    done();
  });

  test('message_sTc', (done) => {
    // @ts-expect-error
    clientSocket.on('message', (msg: string) => {
      expect(msg).toBe('message');
      done();
    });
    serverSocket.emit('message', 'message');
  });

  test('join', (done) => {
    serverSocket.on('join_room', async (room: string) => {
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      expect(allGames).toHaveLength(1);
      expect(allGames[0].members).toHaveLength(1);
      allGames.pop();
      done();
    });
    // @ts-expect-error
    clientSocket.emit('join_room', 'join-room');
  });

  test('double_join', (done) => {
    // @ts-expect-error
    serverSocket.on('double_join_room', async (room: string) => {
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      await self.joinRoom(room);
      expect(allGames).toHaveLength(1);
      expect(allGames[0].members).toHaveLength(1);
      allGames.pop();
      done();
    });
    // @ts-expect-error
    clientSocket.emit('double_join_room', 'double_join-room');
  });

  test('leave', (done) => {
    serverSocket.on('leave_rooms', async () => {
      const room = 'leave-room';
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      await self.leaveRooms();
      expect(allGames).toHaveLength(0);
      done();
    });
    // @ts-expect-error
    clientSocket.emit('leave_rooms');
  });

  test('leave_admin', (done) => {
    // @ts-expect-error
    serverSocket.on('leave_rooms_admin', async () => {
      const room = 'leave-room-admin';
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      allGames[0].members.push(Object.assign(Object.create(Object.getPrototypeOf(allGames[0].members[0])), allGames[0].members[0]));
      allGames[0].members[0].isAdmin = true;
      await self.leaveRooms();
      expect(allGames).toHaveLength(1);
      expect(allGames[0].members).toHaveLength(1);
      expect(allGames[0].members[0].isAdmin).toBe(true);
      allGames.pop();
      done();
    });
    // @ts-expect-error
    clientSocket.emit('leave_rooms_admin');
  });

  test('getAllAvailableRoomsReduced', (done) => {
    serverSocket.on('get_games', async () => {
      const room = 'get_games-room';
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      const rooms: { [key: string]: number } = self.getAllAvailableRoomsReduced();
      expect(Object.keys(rooms).length).toBe(1);
      await self.leaveRooms();
      done();
    });
    // @ts-expect-error
    clientSocket.emit('get_games');
  });

  test('getRoomMembers', (done) => {
    const room = 'getRoomMembers-room';
    // @ts-expect-error
    serverSocket.on('getRoomMembers', async () => {
      const game = new Game(room);
      allGames.push(game);
      await self.joinRoom(room);
      const members: Array<{ id: string, name: string, isAdmin: boolean }> = self.getRoomMembers(room);
      expect(members).toHaveLength(1);
      await self.leaveRooms();
      done();
    });
    // @ts-expect-error
    clientSocket.emit('getRoomMembers', room);
  });

  test('main_get_ready', (done) => {
    // @ts-expect-error
    sockets.getReady.on('get_ready', () => {
      done();
    });
    // @ts-expect-error
    sockets.getReady.on('toast', (type: string, msg: string) => {
      if (msg === 'You are not the Captain') {
        // @ts-expect-error
        sockets.getReady.emit('join_room', 'main_get_ready');
        setTimeout(() => {
          // @ts-expect-error
          sockets.getReady.emit('get_ready', 'classic');
        }, 100);
      }
    });
    // @ts-expect-error
    sockets.getReady.emit('get_ready', 'classic');
  });

  test('main_set_game_availability', (done) => {
    let i = 0;
    // @ts-expect-error
    sockets.setGameAvailability.on('get_games', () => {
      if (i++ === 1) {
        done();
      }
    });
    // @ts-expect-error
    sockets.setGameAvailability.on('toast', (type: string, msg: string) => {
      if (msg === 'You are not the Captain') {
        // @ts-expect-error
        sockets.setGameAvailability.emit('join_room', 'main_set_game_availability');
        setTimeout(() => {
          // @ts-expect-error
          sockets.setGameAvailability.emit('set_game_availability', 'classic');
        }, 100);
      }
    });
    // @ts-expect-error
    sockets.setGameAvailability.emit('set_game_availability', 'classic');
  });

  test('main_join_room', (done) => {
    // @ts-expect-error
    sockets.joinRoom2.on('toast', (type: string, msg: string) => {
      if (msg === 'You joined main_join_room') {
        // @ts-expect-error
        sockets.joinRoom2.emit('leave_rooms');
        // @ts-expect-error
        sockets.joinRoom1.emit('set_game_availability', false);
        setTimeout(() => {
          // @ts-expect-error
          sockets.joinRoom2.emit('join_room', 'main_join_room');
        }, 100);
      } else if (msg === 'That room name is already taken') {
        done();
      }
    });
    // @ts-expect-error
    sockets.joinRoom1.on('self_is_admin', () => {
      // @ts-expect-error
      sockets.joinRoom2.emit('join_room', 'main_join_room');
    });
    // @ts-expect-error
    sockets.joinRoom1.emit('join_room', 'main_join_room');
    // double join test
    setTimeout(() => {
    // @ts-expect-error
      sockets.joinRoom1.emit('join_room', 'main_join_room');
    }, 100);
  });

  test('main_get_games', (done) => {
    // @ts-expect-error
    sockets.getGames.on('get_games', (v: { [key: string]: number }) => {
      for (const property in v) {
        if (property === 'get_games' && v[property] === 1) {
          done();
        }
      }
    });
    // @ts-expect-error
    sockets.getGames.emit('join_room', 'get_games');
    // @ts-expect-error
    sockets.getGames.emit('get_games');
  });

  test('main_message', (done) => {
    // @ts-expect-error
    sockets.message.on('info', (id: string, name: string, type: string, msg: string) => {
      if (type === 'message' && msg === 'main_message') done();
    });
    // @ts-expect-error
    sockets.message.emit('message', 'main_message');
  });

  test('main_message_room', (done) => {
    // @ts-expect-error
    sockets.messageRoom.on('toast', (type: string, msg: string) => {
      // @ts-expect-error
      sockets.messageRoom.emit('message_room', 'main_message_room');
    });

    // @ts-expect-error
    sockets.messageRoom.on('info_room', (id: string, name: string, type: string, msg: string) => {
      if (type === 'message_room' && msg === 'main_message_room') done();
    });

    // @ts-expect-error
    sockets.messageRoom.emit('join_room', 'main_message_room');
  });

  test('main_rename', (done) => {
    // @ts-expect-error
    sockets.rename.on('info_room', (id: string, name: string, type: string, msg: string) => {
      if (type === 'rename_room' && name === 'Globy is a pure') done();
    });

    // @ts-expect-error
    sockets.rename.on('toast', (type: string, msg: string) => {
      // @ts-expect-error
      sockets.rename.emit('rename', 'Globy is a pure dinosaur');
    });

    // @ts-expect-error
    sockets.rename.emit('join_room', 'main_rename');
  });

  test('main_setAdmin', (done) => {
    // @ts-expect-error
    sockets.setAdmin1.on('info_room', (id: string, name: string, type: string, msg: string) => {
      // @ts-expect-error
      if (sockets.setAdmin1.id !== id) {
        // @ts-expect-error
        sockets.setAdmin1.emit('set_admin', sockets.setAdmin1.id);
        setTimeout(() => {
        // @ts-expect-error
          sockets.setAdmin1.emit('set_admin', id);
        }, 100);
      }
    });

    // @ts-expect-error
    sockets.setAdmin1.on('self_is_admin', (isAdmin: boolean) => {
      if (!isAdmin) { done(); }
    });

    // @ts-expect-error
    sockets.setAdmin1.emit('join_room', 'main_setAdmin');
    // @ts-expect-error
    sockets.setAdmin2.emit('join_room', 'main_setAdmin');
  });

  test('main_kickFromRoom', (done) => {
    // @ts-expect-error
    sockets.kickFromRoom1.on('info_room', (id: string, name: string, type: string, msg: string) => {
      // @ts-expect-error
      if (sockets.kickFromRoom1.id !== id) {
        // @ts-expect-error
        sockets.kickFromRoom1.emit('kick_from_room', sockets.kickFromRoom1.id);
        setTimeout(() => {
          // @ts-expect-error
          sockets.kickFromRoom1.emit('kick_from_room', id);
        }, 100);
      }
    });

    // @ts-expect-error
    sockets.kickFromRoom2.on('toast', (type: string, msg: string) => {
      if (type === 'warning' && msg === 'You have been jettisoned in space') { done(); }
    });

    // @ts-expect-error
    sockets.kickFromRoom1.emit('join_room', 'main_kickFromRoom');
    // @ts-expect-error
    sockets.kickFromRoom2.emit('join_room', 'main_kickFromRoom');
    // @ts-expect-error
    sockets.kickFromRoom2.emit('kick_from_room', sockets.kickFromRoom1.id);
  });

  test('get_room_members', (done) => {
    let preventDouble = true;
    // @ts-expect-error
    sockets.getRoomMembers.on('get_room_members', (members: [{ id: string, name: string, isAdmin: boolean }]) => {
      if (members.length > 0 && preventDouble && members[0].isAdmin) {
        preventDouble = false;
        done();
      }
    });

    // @ts-expect-error
    sockets.getRoomMembers.emit('join_room', 'room-test-get-room-members');
    setTimeout(() => {
      // @ts-expect-error
      sockets.getRoomMembers.emit('get_room_members');
    }, 500);
  });

  // test('test_connect_error', (done) => {
  //   // @ts-expect-error
  //   sockets.testConnectError.on('connect_error_test', (msg: string) => {
  //     expect(msg).toEqual('worked');
  //     done();
  //   });
  //   // @ts-expect-error
  //   sockets.testConnectError.emit('connect_error_test');
  // });

  test('connect_error_test', (done) => {
    unitTestsAngular(serverSocket);
    done();
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function log (title: string, variable: unknown): void {
  console.log(title, '\x1b[1m\x1b[36m', variable, '\x1b[0m');
}
