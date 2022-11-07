import { Server } from "socket.io";
import { createServer } from "http";
import { Player } from "./player";
import { Game } from "./game";

interface ServerToClientEvents {
  basicEmit: (a: number, b: string, c: Buffer) => void;
  message: (message: string) => void;
  info: (user: string, name: string, type: string, message: string) => void;
  info_room: (
    user: string,
    name: string,
    type: string,
    message: string
  ) => void;
  toast: (type: string, message: string, emoji?: string) => void;
  self_get_room: (room: string) => void;
  self_is_admin: (isAdmin: boolean) => void;
  get_games: (rooms: { [key: string]: number }) => void;
  get_room_members: (
    members: { id: string; name: string; isAdmin: boolean }[]
  ) => void;
  debug: (cheat: any) => void;
  kicked: (kicked: boolean) => void;
  get_ready: (v: boolean) => void;
  reset: () => void;
}

interface ClientToServerEvents {
  message: (message: string) => void;
  message_room: (message: string) => void;
  rename: (name: string) => void;
  join_room: (room: string) => void;
  leave_rooms: () => void;
  create_room: (room: string) => void;
  set_game_availability: (v: boolean) => void;
  get_games: () => void;
  kick_from_room: (id: string) => void;
  set_admin: (id: string) => void;
  get_ready: (mode: string) => void;
  start_game: () => void;
  set_game_mode: (mode: string) => void;
  connect_error: (err: { message: string }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

const httpServer = createServer();
const PORT = 3030;
let allGames: Game[] = [];

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  cors: {
    origin: "*", // http://localhost:4200/
    credentials: true,
  },
});

io.close();

// TODO
// create Piece class

io.on("connection", async (socket) => {
  let self = new Player(socket.id, socket.id.slice(0, 4));
  socket.emit("reset");
  socket.emit("get_games", getAllAvailableRoomsReduced());

  io.emit("info", `${socket.id}`, `${self.name}`, "connected", "");
  socket.on("disconnect", () => {
    leaveRooms();
    io.emit("info", `${socket.id}`, `${self.name}`, "disconnected", "");
    io.emit("get_games", getAllAvailableRoomsReduced());
  });

  socket.on("message", (message: string) => {
    io.emit("info", `${socket.id}`, `${self.name}`, "message", `${message}`);
  });

  socket.on("message_room", (message: string) => {
    if (self.room !== "" && self.room !== undefined)
      io.in(self.room).emit(
        "info_room",
        `${socket.id}`,
        `${self.getAdminName()}`,
        "message_room",
        `${message}`
      );
  });

  socket.on("rename", (name: string) => {
    io.emit(
      "info",
      `${socket.id}`,
      `${self.name}`,
      "rename",
      `${self.name} renamed himself as ${name}`
    );
    let oldName = self.name;
    self.name = name;
    if (self.room !== "" && self.room !== undefined) {
      io.in(self.room).emit("get_room_members", getRoomMembers(self.room));
      io.in(self.room).emit(
        "info_room",
        `${socket.id}`,
        `${self.name}`,
        "rename_room",
        `${oldName} renamed himself as ${self.name}`
      );
    }
  });

  socket.on("join_room", async (room: string) => {
    if (room === self.room) return;
    const roomIndex = allGames.findIndex((element) => element.id === room);
    if (roomIndex !== -1) {
      if (allGames[roomIndex].isAvailable) {
        await joinRoom(room);
        socket.emit("toast", "info", "You joined " + room);
      } else {
        socket.emit("toast", "error", "That room name is already taken");
      }
    } else {
      // create room
      let game = new Game(room);
      allGames.push(game);
      await joinRoom(room);
      io.emit(
        "info",
        `${socket.id}`,
        `${self.name}`,
        "create_room",
        `${self.name} created ${room} room`
      );
      self.isAdmin = true;
      socket.emit("self_is_admin", self.isAdmin);
      socket.emit("toast", "show", "You are the captain of " + room + " !");
    }
  });

  socket.on("leave_rooms", async () => {
    await leaveRooms();
    io.emit("get_games", getAllAvailableRoomsReduced());
  });

  socket.on("get_ready", (mode: string) => {
    if (self.isAdmin) {
      io.in(self.room).emit("get_ready", true);
      const roomIndex = allGames.findIndex(
        (element) => element.id === self.room
      );
      allGames[roomIndex].gameMode = mode;
      io.in(self.room).emit(
        "info_room",
        `${self.id}`,
        `${self.name}`,
        "new_admin_room",
        `🚀  Prepare for launch ! ${mode} mode has been chosen.`
      );
    } else {
      socket.emit("toast", "error", "You are not the Captain");
    }
  });

  socket.on("start_game", () => {
    // TODO
  });

  socket.on("set_game_availability", (v: boolean) => {
    if (self.isAdmin) {
      const roomIndex = allGames.findIndex(
        (element) => element.id === self.room
      );
      allGames[roomIndex].isAvailable = v;
      console.log(self.room, "availability:", v);
      io.emit("get_games", getAllAvailableRoomsReduced());
    } else {
      socket.emit("toast", "error", "You are not the Captain");
    }
  });

  socket.on("get_games", () => {
    socket.emit("get_games", getAllAvailableRoomsReduced());
  });

  socket.on("kick_from_room", (id: string) => {
    if (!self.isAdmin) return;
    if (self.id === id) {
      socket.emit("toast", "error", "You can't jettison yourself");
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
          if (memberIndexToRemove > -1)
            allGames[roomIndex].members.splice(memberIndexToRemove, 1);
          // delete game if empty
          if (allGames[roomIndex].members.length === 0) {
            const gameIndexToRemove = allGames.findIndex(
              (element) => element.id === allGames[roomIndex].id
            );
            if (gameIndexToRemove > -1) allGames.splice(gameIndexToRemove, 1);
          }
          member.room = "";
          io.to(member.id).emit("kicked", true);
          io.to(member.id).emit(
            "toast",
            "warning",
            "You have been jettisoned in space"
          );
          io.to(member.id).emit("self_get_room", member.room);
          socket.emit("toast", "info", "You jettisoned " + member.name);
          io.in(self.room).emit(
            "info_room",
            `${self.id}`,
            `${self.name}`,
            "leave_room",
            `${member.name} have been jettisoned in space`
          );
          io.in(self.room).emit("get_room_members", getRoomMembers(self.room));
          io.emit("get_games", getAllAvailableRoomsReduced());
        }
      }
    }
  });

  socket.on("set_admin", (id: string) => {
    if (!self.isAdmin || self.id === id) return;
    const roomIndex = allGames.findIndex((element) => element.id === self.room);
    if (roomIndex !== -1) {
      for (const member of allGames[roomIndex].members) {
        if (member.id === id) {
          member.isAdmin = true;
          self.isAdmin = false;
          io.to(member.id).emit(
            "toast",
            "show",
            "Congratulations !</br>You have been promoted to Captain."
          );
          io.to(member.id).emit("self_is_admin", true);
          socket.emit("self_is_admin", false);
          socket.emit(
            "toast",
            "info",
            "You convey your Captain's hat to " + member.name
          );
          io.in(self.room).emit(
            "info_room",
            `${self.id}`,
            `${member.name}`,
            "new_admin_room",
            `🚀 ${member.name} has been promoted to Captain !`
          );
          io.in(self.room).emit("get_room_members", getRoomMembers(self.room));
        }
      }
    }
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  async function joinRoom(room: string): Promise<void> {
    if (self.room === room) return;
    await leaveRooms();
    for (const game of allGames) {
      if (game.id == room) {
        game.members.push(self);
      }
    }
    socket.join(room);
    io.in(room).emit(
      "info_room",
      `${socket.id}`,
      `${self.name}`,
      "join_room",
      `${self.name} joined the room`
    );
    io.emit("get_games", getAllAvailableRoomsReduced());
    io.in(room).emit("get_room_members", getRoomMembers(room));
    self.room = room;
    socket.emit("self_get_room", self.room);
  }

  async function leaveRooms(): Promise<void> {
    if (self.room === "") return;
    for (const game of allGames) {
      if (game.id == self.room) {
        // delete user from game members
        const memberIndexToRemove = game.members.findIndex(
          (element) => element.id === self.id
        );
        if (memberIndexToRemove > -1)
          game.members.splice(memberIndexToRemove, 1);
        // delete game if empty
        if (game.members.length === 0) {
          const gameIndexToRemove = allGames.findIndex(
            (element) => element.id === game.id
          );
          if (gameIndexToRemove > -1) allGames.splice(gameIndexToRemove, 1);
        }
      }
    }
    io.in(self.room).emit(
      "info_room",
      `${socket.id}`,
      `${self.name}`,
      "leave_room",
      `${self.name} left the room`
    );
    // give new admin
    const oldRoomIndex = allGames.findIndex(
      (element) => element.id === self.room
    );
    if (
      self.isAdmin &&
      oldRoomIndex !== -1 &&
      allGames.length > 0 &&
      allGames[oldRoomIndex].members.length > 0
    ) {
      allGames[oldRoomIndex].members[0].isAdmin = true;
      io.to(allGames[oldRoomIndex].members[0].id).emit(
        "toast",
        "show",
        "Congratulations !</br>You have been promoted to Captain."
      );
      io.to(allGames[oldRoomIndex].members[0].id).emit("self_is_admin", true);
      io.in(self.room).emit(
        "info_room",
        `${allGames[oldRoomIndex].members[0].id}`,
        `${allGames[oldRoomIndex].members[0].name}`,
        "new_admin_room",
        `🚀 ${allGames[oldRoomIndex].members[0].name} has been promoted to Captain !`
      );
    }
    io.in(self.room).emit("get_room_members", getRoomMembers(self.room));
    self.isAdmin = false;
    self.room = "";
    socket.emit("self_get_room", self.room);
    socket.emit("self_is_admin", self.isAdmin);
    let i = 0;
    for (const item of socket.rooms.values()) {
      if (i !== 0) {
        socket.leave(item);
      }
      ++i;
    }
  }

  function getAllAvailableRoomsReduced(): { [key: string]: number } {
    const rooms: { [key: string]: number } = {};
    for (const game of allGames) {
      if (game.isAvailable) {
        rooms[game.id] = game.members.length;
      }
    }
    return rooms;
  }

  function getRoomMembers(
    room: string
  ): { id: string; name: string; isAdmin: boolean }[] {
    let roomMembers: { id: string; name: string; isAdmin: boolean }[] = [];
    for (const game of allGames) {
      if (game.id == room) {
        for (const member of game.members) {
          roomMembers.push({
            id: member.id,
            name: member.name,
            isAdmin: member.isAdmin,
          });
        }
      }
    }
    return roomMembers;
  }
});

httpServer.listen(PORT);

console.log("Listen on port:", "\x1b[1m\x1b[32m" + PORT, "\x1b[0m");

// npx ts-node script.ts
