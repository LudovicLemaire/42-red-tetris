import { Server } from "socket.io";
import { createServer } from "http";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const PORT = 3030;

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(PORT);

io.close();

const httpServer = createServer();

httpServer.listen(PORT);

io.attach(httpServer);
console.log("Listen on port:", "\x1b[1m\x1b[32m" + PORT, "\x1b[0m");

io.on("connection", (socket) => {
  socket.emit("noArg");
  socket.emit("basicEmit", 1, "2", Buffer.from([3]));
  socket.emit("withAck", "4", (e) => {
    // e is inferred as number
  });

  // works when broadcast to all
  io.emit("noArg");

  // works when broadcasting to a room
  io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});
