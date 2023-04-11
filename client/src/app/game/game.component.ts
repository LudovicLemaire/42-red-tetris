import { MediaMatcher } from '@angular/cdk/layout';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketIoService } from '../socketio-service/socket-io.service';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
	playerGameboard: number[][];
	spectras: {
		[key: string]: {
			name: string;
			board: number[][];
			hasLost: boolean;
			score: number;
			lineBlocked: number;
		};
	};
	spectrasReduced: {
		[key: string]: {
			name: string;
			board: number[][];
			hasLost: boolean;
			score: number;
			lineBlocked: number;
		};
	};
	playerScore: number;
	playerHasLost: boolean;
	playerSack: number[];
	playerChaosPieceRemaining: number;
	playerChaosPieceAvailable: number;
	playerLineBlocked: number;
	rdImg: number;
	isMobile: boolean = false;
	private boardsSub$!: Subscription;
	private playerBoardSub$!: Subscription;

	length = 0;
	pageSize = 6;
	pageIndex = 0;
	pageSizeOptions = [6, 12, 24, 96, 960];
	pageEvent: PageEvent | undefined;

	constructor(
		private socketIoService: SocketIoService,
		private media: MediaMatcher
	) {
		this.playerGameboard = [];
		this.spectras = {};
		this.spectrasReduced = {};
		this.playerHasLost = false;
		this.rdImg = Math.floor(Math.random() * 7.99);
		this.playerSack = [];

		for (var i: number = 0; i < 20; i++) {
			this.playerGameboard[i] = [];
			for (var j: number = 0; j < 10; j++) {
				this.playerGameboard[i][j] = 0;
			}
		}
		this.playerScore = 0;
		this.playerChaosPieceRemaining = 0;
		this.playerChaosPieceAvailable = 0;
		this.playerLineBlocked = 0;
	}

	ngOnInit(): void {
		this.boardsSub$ = this.socketIoService.getBoards().subscribe(
			(boards: {
				[key: string]: {
					name: string;
					board: number[][];
					hasLost: boolean;
					score: number;
					lineBlocked: number;
				};
			}) => {
				if (
					boards !== null &&
					boards !== undefined &&
					Object.keys(boards).length > 0
				) {
					for (let [key, value] of Object.entries(boards)) {
						if (key !== this.socketIoService.socket.id) {
							if (boards[key].hasLost) {
								delete this.spectras[key];
								this.getSpectraReduced();
							} else {
								this.spectras[key] = value;
								if (key in this.spectrasReduced) {
									this.spectrasReduced[key] = value;
								}
							}
						}
					}
					if (
						(Object.keys(this.spectrasReduced).length < 6 &&
							Object.keys(this.spectras).length > 6) ||
						Object.keys(this.spectrasReduced).length === 0
					) {
						this.getSpectraReduced();
					}
				}
				this.getSpectraReduced();
			}
		);

		this.playerBoardSub$ = this.socketIoService
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
					if (
						userData !== null &&
						userData !== undefined &&
						Object.keys(userData).length > 0 &&
						userData.board.length > 0
					) {
						this.playerSack = userData.sack.slice(
							userData.currentPiece,
							userData.currentPiece + 3
						);
						this.playerGameboard = userData.board;
						this.playerScore = userData.score;
						this.playerLineBlocked = userData.lineBlocked;
						this.playerChaosPieceRemaining = userData.chaosPieceRemaining;
						this.playerChaosPieceAvailable = userData.chaosPieceAvailable;
						if (userData.hasLost) {
							this.playerHasLost = true;
						}
					}
				}
			);

		if (this.media.matchMedia('(max-width: 600px)').matches) {
			this.isMobile = true;
		}
	}

	ngOnDestroy() {
		this.socketIoService.resetBoards();
		this.socketIoService.resetPlayerBoard();
		if (this.boardsSub$) this.boardsSub$.unsubscribe();
		this.socketIoService.unsubSocket('get_boards');
		if (this.playerBoardSub$) this.playerBoardSub$.unsubscribe();
		this.socketIoService.unsubSocket('get_player_board');
	}

	handlePageEvent(e: PageEvent) {
		this.pageEvent = e;
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
		this.length = e.length;
		this.getSpectraReduced();
	}

	getSpectraLength(): number {
		return Object.keys(this.spectras).length;
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		let direction = event.key;
		if (
			direction === 'ArrowRight' ||
			direction === 'ArrowLeft' ||
			direction === 'ArrowDown' ||
			direction === 'ArrowUp' ||
			direction === ' '
		) {
			this.socketIoService.movePiece(event.key);
			// prevent scrolling
			event.preventDefault();
		}
	}

	sendChaosPiece() {
		this.socketIoService.sendChaosPiece();
	}

	getSpectraReduced() {
		this.spectrasReduced = {};
		if (!this.pageEvent) {
			this.pageEvent = {
				pageIndex: 0,
				pageSize: 6,
				length: this.getSpectraLength(),
			};
		}
		let start = this.pageEvent.pageIndex * this.pageEvent.pageSize;
		let end =
			this.pageEvent.pageIndex * this.pageEvent.pageSize +
			this.pageEvent.pageSize;
		if (end > this.getSpectraLength()) end = this.getSpectraLength();
		this.spectrasReduced = {};
		if (end - start > Object.entries(this.spectras).length) return;

		for (const [key, value] of Object.entries(this.spectras).slice(
			start,
			end
		)) {
			this.spectrasReduced[key] = value;
		}

		// let totalSpectra = 0;
		// this.spectrasReduced = {};
		// for (const [key, value] of Object.entries(this.spectras)) {
		// 	if (totalSpectra === 6) break;

		// 	if (!value.hasLost) {
		// 		this.spectrasReduced[key] = value;
		// 		totalSpectra++;
		// 	}
		// }
	}
}
