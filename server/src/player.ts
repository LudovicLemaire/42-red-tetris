import { Server, Socket } from 'socket.io';
import { Game } from './game';

export class Player {
  public id: string;
  public name: string;
  public room: string;
  public isAdmin: boolean;
  public socket: Socket;
  public io: Server;
  public allGames: Game[];

  constructor (id: string, name: string, socket: Socket, ioRef: Server, allGamesRef: Game[]) {
    this.id = id;
    this.name = name;
    this.room = '';
    this.isAdmin = false;
    this.socket = socket;
    this.io = ioRef;
    this.allGames = allGamesRef;
  }

  getAdminName (): string {
    if (this.isAdmin) {
      return '🚀 ' + this.name;
    } else {
      return this.name;
    }
  }

  async joinRoom (room: string): Promise<void> {
    if (this.room === room) return;
    await this.leaveRooms();
    for (const game of this.allGames) {
      if (game.id === room) {
        game.members.push(this);
      }
    }
    void this.socket.join(room);
    this.io.in(room).emit(
      'info_room',
      `${this.id}`,
      `${this.name}`,
      'join_room',
      `${this.name} joined the room`
    );
    this.io.emit('get_games', this.getAllAvailableRoomsReduced());
    this.io.in(room).emit('get_room_members', this.getRoomMembers(room));
    this.room = room;
    this.socket.emit('self_get_room', this.room);
  }

  async leaveRooms (): Promise<void> {
    if (this.room === '') return;
    for (const game of this.allGames) {
      if (game.id === this.room) {
        // delete user from game members
        const memberIndexToRemove = game.members.findIndex(
          (element) => element.id === this.id
        );
        if (memberIndexToRemove > -1) { game.members.splice(memberIndexToRemove, 1); }
        // delete game if empty
        if (game.members.length === 0) {
          const gameIndexToRemove = this.allGames.findIndex(
            (element) => element.id === game.id
          );
          if (gameIndexToRemove > -1) this.allGames.splice(gameIndexToRemove, 1);
        }
      }
    }
    this.io.in(this.room).emit(
      'info_room',
      `${this.id}`,
      `${this.name}`,
      'leave_room',
      `${this.name} left the room`
    );
    // give new admin
    const oldRoomIndex = this.allGames.findIndex(
      (element) => element.id === this.room
    );
    if (
      this.isAdmin &&
      oldRoomIndex !== -1 &&
      this.allGames.length > 0 &&
      this.allGames[oldRoomIndex].members.length > 0
    ) {
      this.allGames[oldRoomIndex].members[0].isAdmin = true;
      this.io.to(this.allGames[oldRoomIndex].members[0].id).emit(
        'toast',
        'show',
        'Congratulations !</br>You have been promoted to Captain.'
      );
      this.io.to(this.allGames[oldRoomIndex].members[0].id).emit('self_is_admin', true);
      this.io.in(this.room).emit(
        'info_room',
        `${this.allGames[oldRoomIndex].members[0].id}`,
        `${this.allGames[oldRoomIndex].members[0].name}`,
        'new_admin_room',
        `🚀 ${this.allGames[oldRoomIndex].members[0].name} has been promoted to Captain !`
      );
    }
    this.io.in(this.room).emit('get_room_members', this.getRoomMembers(this.room));
    this.isAdmin = false;
    this.room = '';
    this.socket.emit('self_get_room', this.room);
    this.socket.emit('self_is_admin', this.isAdmin);
    let i = 0;
    for (const item of this.socket.rooms.values()) {
      if (i !== 0) {
        void this.socket.leave(item);
      }
      ++i;
    }
  }

  getAllAvailableRoomsReduced (): { [key: string]: number } {
    const rooms: { [key: string]: number } = {};
    for (const game of this.allGames) {
      if (game.isAvailable) {
        rooms[game.id] = game.members.length;
      }
    }
    return rooms;
  }

  getRoomMembers (
    room: string
  ): Array<{ id: string, name: string, isAdmin: boolean }> {
    const roomMembers: Array<{ id: string, name: string, isAdmin: boolean }> = [];
    for (const game of this.allGames) {
      if (game.id === room) {
        for (const member of game.members) {
          roomMembers.push({
            id: member.id,
            name: member.name,
            isAdmin: member.isAdmin
          });
        }
      }
    }
    return roomMembers;
  }
}
