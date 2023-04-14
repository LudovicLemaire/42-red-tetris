import { TestBed } from '@angular/core/testing';
import { SocketIoService } from './socket-io.service';

describe('SocketIoService', () => {
	let service: SocketIoService;
	let preventMultCallGetGames: boolean = true;
	let preventMultCallGetNewInfo: boolean = true;
	let preventMultCallGetNewInfoRoom: boolean = true;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SocketIoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('getRoomMembersRequest', () => {
		service.getRoomMembersRequest();
		expect(service).toBeTruthy();
	});

	it('movePiece', () => {
		service.movePiece('ArrowLeft');
		expect(service).toBeTruthy();
	});

	it('sendChaosPiece', () => {
		service.sendChaosPiece();
		expect(service).toBeTruthy();
	});

	it('resetBoards', () => {
		service.resetBoards();
		expect(service).toBeTruthy();
	});

	it('resetPlayerBoard ', () => {
		service.resetPlayerBoard();
		expect(service).toBeTruthy();
	});

	it('test if service survived after joining room', done => {
		setTimeout(() => {
			service.joinRoom('Room-1');
			service.getGamesRequest();
			service.setGameMode('rush');
			service.setGameAvailability(false);
			service.setAdmin('xD4ad');
			service.kickFromRoom('xD4ad');
			service.editName('Globy');
			service.sendMessageRoom('Wesh wesh les amis dans les rooms');
			service.sendMessage('Wesh wesh les amis dans le monde');
			service.startGame();
			service.prepareGame('Room-1');
			service.leaveRooms();
			expect(service).toBeTruthy();
			done();
		}, 4500);
	});

	it('getReady', done => {
		service.getReady().subscribe((v: boolean) => {
			if (v !== false) {
				expect(v).toBeTruthy();
				done();
			}
		});
		service.socket.emit('get_ready_test');
	});

	it('selfGetRoom and unsubSocket', done => {
		service.selfGetRoom().subscribe((room: string) => {
			if (room !== '') {
				service.unsubSocket('selfGetRoom');
				if (room === 'Room-42') {
					expect(room).toEqual('Room-42');
					done();
				}
			}
		});
		service.socket.emit('self_get_room_test');
	});

	it('selfIsAdmin', done => {
		service.selfIsAdmin().subscribe((isAdmin: boolean) => {
			if (isAdmin !== false) {
				expect(isAdmin).toBeTruthy();
				done();
			}
		});
		service.socket.emit('self_is_admin_test');
	});

	it('getNewInfo', done => {
		service
			.getNewInfo()
			.subscribe((userTypeMessage: [string, string, string, string]) => {
				if (
					userTypeMessage[0] !== '' &&
					userTypeMessage[1] !== '' &&
					userTypeMessage[2] !== '' &&
					userTypeMessage[3] !== ''
				) {
					if (userTypeMessage[0] === 'abcde') {
						expect(userTypeMessage[0]).toEqual('abcde');
						expect(userTypeMessage[1]).toEqual('Globy');
						expect(userTypeMessage[2]).toEqual('message');
						expect(userTypeMessage[3]).toEqual('Hello there');
						if (preventMultCallGetNewInfo) {
							preventMultCallGetNewInfo = false;
							done();
						} else {
							return;
						}
					}
				}
			});
		service.socket.emit('info_test');
	});

	it('getNewInfoRoom ', done => {
		service
			.getNewInfoRoom()
			.subscribe((userTypeMessage: [string, string, string, string]) => {
				if (
					userTypeMessage[0] !== '' &&
					userTypeMessage[1] !== '' &&
					userTypeMessage[2] !== '' &&
					userTypeMessage[3] !== ''
				) {
					if (userTypeMessage[0] === 'abcde') {
						expect(userTypeMessage[0]).toEqual('abcde');
						expect(userTypeMessage[1]).toEqual('Globy');
						expect(userTypeMessage[2]).toEqual('message');
						expect(userTypeMessage[3]).toEqual('Hello there');
						if (preventMultCallGetNewInfoRoom) {
							preventMultCallGetNewInfoRoom = false;
							done();
						} else {
							return;
						}
					}
				}
			});
		service.socket.emit('info_room_test');
	});

	it('getGames', done => {
		service.getGames().subscribe((games: { [key: string]: number }) => {
			if (Object.keys(games).length > 0) {
				for (const [key, value] of Object.entries(games)) {
					if (key === 'Room-42') {
						expect(key).toEqual('Room-42');
						expect(value).toBe(1);
						if (preventMultCallGetGames) {
							preventMultCallGetGames = false;
							done();
						} else {
							return;
						}
					}
				}
			}
		});
		service.socket.emit('get_games_test');
	});

	it('toast', done => {
		service.toast().subscribe((toast: [string, string]) => {
			if (toast[0] !== '' && toast[1] !== '') {
				expect(toast[0]).toEqual('info');
				expect(toast[1]).toEqual("Congrats ! You now have the captain's hat");
				done();
			}
		});
		service.socket.emit('toast_test');
	});

	it('reset', done => {
		service.reset().subscribe((reset: boolean) => {
			if (reset !== false && reset !== undefined) {
				expect(reset).toBeTruthy();
				done();
			}
		});
		service.socket.emit('reset_test');
	});

	it('kicked', done => {
		service.kicked().subscribe((kicked: boolean) => {
			if (kicked !== false && kicked !== undefined) {
				expect(kicked).toBeTruthy();
				done();
			}
		});
		service.socket.emit('kicked_test');
	});

	it('getRoomMembers', done => {
		service
			.getRoomMembers()
			.subscribe(
				(members: { id: string; name: string; isAdmin: boolean }[]) => {
					if (members !== undefined && members.length > 0) {
						expect(members.length).toBe(1);
						expect(members[0].id).toEqual('abcde');
						expect(members[0].name).toEqual('Globy');
						expect(members[0].isAdmin).toBeTruthy();
						done();
					}
				}
			);
		service.socket.emit('get_room_members_test');
	});

	it('getBoards', done => {
		let getBoards = service.getBoards().subscribe(
			(boards: {
				[key: string]: {
					name: string;
					board: number[][];
					hasLost: boolean;
					score: number;
					lineBlocked: number;
				};
			}) => {
				if (boards !== undefined && Object.entries(boards).length > 0) {
					service.unsubSocket('get_boards');
					getBoards.unsubscribe();
					expect(Object.entries(boards).length).toBe(3);
					done();
				}
			}
		);
		service.socket.emit('get_boards_test');
	});

	it('getPlayerBoard', done => {
		let getPlayerBoard = service
			.getPlayerBoard()
			.subscribe(
				(userData: {
					board: number[][];
					sack: number[];
					currentPiece: number;
					chaosPieceRemaining: number;
					chaosPieceAvailable: number;
					hasLost: boolean;
					score: number;
					lineBlocked: number;
				}) => {
					if (userData.board.length !== 0) {
						service.unsubSocket('get_player_board');
						getPlayerBoard.unsubscribe();
						expect(userData.score).toBe(200);
						expect(userData.hasLost).toBeTruthy();
						done();
					}
				}
			);
		service.socket.emit('get_our_board_test');
	});

	it('gameEnded ', done => {
		let gameEnded = service.gameEnded().subscribe(ended => {
			if (ended) {
				service.unsubSocket('game_ended');
				gameEnded.unsubscribe();
				expect(ended).toBeTruthy();
				done();
			}
		});
		service.socket.emit('game_ended_test');
	});
});

// // @ts-expect-error
