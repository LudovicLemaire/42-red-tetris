/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/restrict-template-expressions */
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents } from './script';
import { Game } from './game';
import { Player } from './player';

describe('socket part', () => {
  let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>;
  let serverSocket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>;
  let clientSocket: { on: (arg0: string, arg1: jest.DoneCallback) => void, close: () => void, emit: (arg0: string, arg1: (arg: unknown) => void) => void };
  const httpServer = createServer();
  const PORT = 3030;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allGames: Game[] = [];
  let self: Player;

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
    // @ts-expect-error
    clientSocket = new Client(`http://localhost:${PORT}`);
    io.on('connection', (socket) => {
      serverSocket = socket;
      self = new Player(serverSocket.id, serverSocket.id.slice(0, 4), serverSocket, io, allGames);
    });
    clientSocket.on('connect', done);
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
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
});
