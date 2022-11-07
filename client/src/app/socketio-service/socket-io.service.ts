import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from "socket.io-client";

@Injectable({
	providedIn: 'root',
})

export class SocketIoService {
	public info$: BehaviorSubject<[string, string, string, string]> = new BehaviorSubject(['', '', '', '']);
	public games$: BehaviorSubject<{[key: string]: number}> = new BehaviorSubject({});
	public joinRoom$: BehaviorSubject<string> = new BehaviorSubject('');
	public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public infoRoom$: BehaviorSubject<[string, string, string, string]> = new BehaviorSubject(['', '', '', '']);
	public toast$: BehaviorSubject<[string, string]> = new BehaviorSubject(['', '']);
	public roomMembers$: BehaviorSubject<{id: string, name: string, isAdmin: boolean}[]> = new BehaviorSubject<{id: string, name: string, isAdmin: boolean}[]>([]);
	public reset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public kicked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public getReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public connectError$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
	public socket!: Socket;
	constructor() {
		this.socket = io('http://127.0.0.1:3030');
	}

	public sendMessage(message: string) {
		this.socket.emit('message', message);
	}

	public sendMessageRoom(message: string) {
		this.socket.emit('message_room', message);
	}

	public joinRoom(room: string) {
		this.socket.emit('join_room', room);
	}
	public leaveRooms() {
		this.socket.emit('leave_rooms');
	}

	public getGamesRequest() {
		this.socket.emit('get_games');
	}

	public editName(name: string) {
		this.socket.emit('rename', name);
	}

	public kickFromRoom(id: string) {
		this.socket.emit('kick_from_room', id);
	}

	public setAdmin(id: string) {
		this.socket.emit('set_admin', id);
	}

	public setGameAvailability(v: boolean) {
		this.socket.emit('set_game_availability', v);
	}

	public setGameMode(mode: string) {
		this.socket.emit('set_game_mode', mode);
	}

	public startGame() {
		this.socket.emit('start_game');
	}

	public prepareGame(mode: string) {
		this.socket.emit('get_ready', mode);
	}

	public getReady = () => {
		this.socket.on('get_ready', (v: boolean) =>{
			this.getReady$.next(v);
			this.getReady$.next(false);
 	 	});
		return this.getReady$.asObservable();
	};

	public selfGetRoom = () => {
		this.socket.on('self_get_room', (room: string) =>{
			this.joinRoom$.next(room);
 	 	});
		return this.joinRoom$.asObservable();
	};

	public selfIsAdmin = () => {
		this.socket.on('self_is_admin', (isAdmin: boolean) =>{
			this.isAdmin$.next(isAdmin);
 	 	});
		return this.isAdmin$.asObservable();
	};

	public getNewInfo = () => {
		this.socket.on('info', (user: string, name: string, type: string, message: string) =>{
			this.info$.next([user, name, type, message]);
 	 	});
		return this.info$.asObservable();
	};

	public getNewInfoRoom = () => {
		this.socket.on('info_room', (user: string, name: string, type: string, message: string) =>{
			this.infoRoom$.next([user, name, type, message]);
 	 	});
		return this.infoRoom$.asObservable();
	};

	public getGames = () => {
		this.socket.on('get_games', (games: { [key: string]: number }) =>{
			this.games$.next(games);
 	 	});
		return this.games$.asObservable();
	};

	public toast = () => {
		this.socket.on('toast', (type: string, message: string) =>{
			this.toast$.next([type, message]);
 	 	});
		return this.toast$.asObservable();
	};

	public reset = () => {
		this.socket.on('reset', (reset: boolean) =>{
			this.reset$.next(reset);
 	 	});
		return this.reset$.asObservable();
	};

	public kicked = () => {
		this.socket.on('kicked', (kicked: boolean) =>{
			this.kicked$.next(kicked);
			this.kicked$.next(false);
 	 	});
		return this.kicked$.asObservable();
	};

	public connectError = () => {
		this.socket.on('connect_error', (err: any) =>{
			this.connectError$.next(err);
 	 	});
		return this.connectError$.asObservable();
	};

	public getRoomMembers = () => {
		this.socket.on('get_room_members', (members:{id: string, name: string, isAdmin: boolean}[]) =>{
			this.roomMembers$.next(members);
 	 	});
		return this.roomMembers$.asObservable();
	};

	public unsubSocket(name: string) {
		this.socket.removeListener(name);
	}

	public getDebug = () => {
		this.socket.on('debug', (cheat: any) =>{
			console.log(cheat);
 	 	});
	};
}
