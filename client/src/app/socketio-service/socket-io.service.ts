import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
	providedIn: 'root',
})
export class SocketIoService {
	public info$: BehaviorSubject<[string, string, string, string]> =
		new BehaviorSubject(['', '', '', '']);

	public games$: BehaviorSubject<{ [key: string]: number }> =
		new BehaviorSubject({});

	public joinRoom$: BehaviorSubject<string> = new BehaviorSubject('');

	public getBoards$: BehaviorSubject<{
		[key: string]: {
			name: string;
			board: number[][];
			hasLost: boolean;
			score: number;
			lineBlocked: number;
		};
	}> = new BehaviorSubject<{
		[key: string]: {
			name: string;
			board: number[][];
			hasLost: boolean;
			score: number;
			lineBlocked: number;
		};
	}>({});

	public getPlayerBoard$: BehaviorSubject<{
		board: number[][];
		sack: number[];
		currentPiece: number;
		chaosPieceRemaining: number;
		chaosPieceAvailable: number;
		hasLost: boolean;
		score: number;
		lineBlocked: number;
	}> = new BehaviorSubject<{
		board: number[][];
		sack: number[];
		currentPiece: number;
		chaosPieceRemaining: number;
		chaosPieceAvailable: number;
		hasLost: boolean;
		score: number;
		lineBlocked: number;
	}>({
		board: [],
		sack: [],
		currentPiece: 0,
		chaosPieceRemaining: 0,
		chaosPieceAvailable: 0,
		hasLost: false,
		score: 0,
		lineBlocked: 0,
	});

	public gameEnded$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<
		boolean | undefined
	>(undefined);

	public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	public infoRoom$: BehaviorSubject<[string, string, string, string]> =
		new BehaviorSubject(['', '', '', '']);

	public toast$: BehaviorSubject<[string, string]> = new BehaviorSubject([
		'',
		'',
	]);

	public roomMembers$: BehaviorSubject<
		{ id: string; name: string; isAdmin: boolean }[]
	> = new BehaviorSubject<{ id: string; name: string; isAdmin: boolean }[]>([]);

	public reset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public kicked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	public getReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	public connectError$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(
		undefined
	);

	public socket!: Socket;
	constructor() {
		// this.socket = io('http://192.168.1.14:3030');
		// this.socket = io('http://86.242.233.138:3030');
		this.socket = io('https://api-tetris.globy.dev');
		this.socket.on('connect', function () {});
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

	public getRoomMembersRequest() {
		this.socket.emit('get_room_members');
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

	public movePiece(direction: string) {
		this.socket.emit('move_piece', direction);
	}

	public sendChaosPiece() {
		this.socket.emit('add_chaos_piece');
	}

	public prepareGame(mode: string) {
		this.socket.emit('get_ready', mode);
	}

	public getReady = () => {
		this.socket.on('get_ready', (v: boolean) => {
			this.getReady$.next(v);
			this.getReady$.next(false);
		});
		return this.getReady$.asObservable();
	};

	public selfGetRoom = () => {
		this.socket.on('self_get_room', (room: string) => {
			this.joinRoom$.next(room);
		});
		return this.joinRoom$.asObservable();
	};

	public getBoards = () => {
		this.socket.on(
			'get_boards',
			(boards: {
				[key: string]: {
					name: string;
					board: number[][];
					hasLost: boolean;
					score: number;
					lineBlocked: number;
				};
			}) => {
				this.getBoards$.next(boards);
			}
		);
		return this.getBoards$.asObservable();
	};

	public resetBoards = () => {
		this.getBoards$.next({});
		return this.getBoards$.asObservable();
	};

	public getPlayerBoard = () => {
		this.socket.on(
			'get_player_board',
			(board: {
				board: number[][];
				sack: number[];
				currentPiece: number;
				chaosPieceRemaining: number;
				chaosPieceAvailable: number;
				hasLost: boolean;
				score: number;
				lineBlocked: number;
			}) => {
				this.getPlayerBoard$.next(board);
			}
		);
		return this.getPlayerBoard$.asObservable();
	};

	public resetPlayerBoard = () => {
		this.getPlayerBoard$.next({
			board: [],
			sack: [],
			currentPiece: 0,
			chaosPieceRemaining: 0,
			chaosPieceAvailable: 0,
			hasLost: false,
			score: 0,
			lineBlocked: 0,
		});
		return this.getPlayerBoard$.asObservable();
	};

	public gameEnded = () => {
		this.socket.on('game_ended', () => {
			this.gameEnded$.next(true);
			this.gameEnded$.next(undefined);
		});
		return this.gameEnded$.asObservable();
	};

	public selfIsAdmin = () => {
		this.socket.on('self_is_admin', (isAdmin: boolean) => {
			this.isAdmin$.next(isAdmin);
		});
		return this.isAdmin$.asObservable();
	};

	public getNewInfo = () => {
		this.socket.on(
			'info',
			(user: string, name: string, type: string, message: string) => {
				this.info$.next([user, name, type, message]);
			}
		);
		return this.info$.asObservable();
	};

	public getNewInfoRoom = () => {
		this.socket.on(
			'info_room',
			(user: string, name: string, type: string, message: string) => {
				this.infoRoom$.next([user, name, type, message]);
			}
		);
		return this.infoRoom$.asObservable();
	};

	public getGames = () => {
		this.socket.on('get_games', (games: { [key: string]: number }) => {
			this.games$.next(games);
		});
		return this.games$.asObservable();
	};

	public toast = () => {
		this.socket.on('toast', (type: string, message: string) => {
			this.toast$.next([type, message]);
		});
		return this.toast$.asObservable();
	};

	public reset = () => {
		this.socket.on('reset', (reset: boolean) => {
			this.reset$.next(reset);
		});
		return this.reset$.asObservable();
	};

	public kicked = () => {
		this.socket.on('kicked', (kicked: boolean) => {
			this.kicked$.next(kicked);
			this.kicked$.next(false);
		});
		return this.kicked$.asObservable();
	};

	/* istanbul ignore next */
	public connectError = () => {
		this.socket.on('connect_error', (err: unknown) => {
			this.connectError$.next(err);
		});
		return this.connectError$.asObservable();
	};

	public getRoomMembers = () => {
		this.socket.on(
			'get_room_members',
			(members: { id: string; name: string; isAdmin: boolean }[]) => {
				this.roomMembers$.next(members);
			}
		);
		return this.roomMembers$.asObservable();
	};

	public unsubSocket(name: string) {
		this.socket.removeListener(name);
	}
}
