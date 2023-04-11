import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { TetrisboardComponent } from './tetrisboard/tetrisboard.component';

describe('GameComponent', () => {
	let component: GameComponent;
	let fixture: ComponentFixture<GameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GameComponent, TetrisboardComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
