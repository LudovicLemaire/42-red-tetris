import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { TetrisboardComponent } from './tetrisboard/tetrisboard.component';
import { ChaosButtonComponent } from '../chaos-button/chaos-button.component';
import { MatIconModule } from '@angular/material/icon';
import { SocketIoService } from 'app/socketio-service/socket-io.service';
import { PageEvent } from '@angular/material/paginator';

describe('GameComponent', () => {
	let component: GameComponent;
	let fixture: ComponentFixture<GameComponent>;
	let service: SocketIoService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GameComponent, TetrisboardComponent, ChaosButtonComponent],
			imports: [MatIconModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GameComponent);
		service = TestBed.inject(SocketIoService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('get boards', done => {
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

	it('get our board', done => {
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

	it('send chaos piece', () => {
		component.sendChaosPiece();
		expect(component).toBeTruthy();
	});

	it('handlePageEvent', () => {
		let pageEvent = new PageEvent();
		pageEvent.pageIndex = 1;
		component.handlePageEvent(pageEvent);
		expect(component.pageIndex).toBe(1);
	});

	it('handleKeyboardEvent', () => {
		component.handleKeyboardEvent(
			new KeyboardEvent('keydown', { key: 'ArrowRight' })
		);
		component.handleKeyboardEvent(
			new KeyboardEvent('keydown', { key: 'ArrowLeft' })
		);
		component.handleKeyboardEvent(
			new KeyboardEvent('keydown', { key: 'ArrowDown' })
		);
		component.handleKeyboardEvent(
			new KeyboardEvent('keydown', { key: 'ArrowUp' })
		);
		component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: ' ' }));
		expect(component).toBeTruthy();
	});
});
