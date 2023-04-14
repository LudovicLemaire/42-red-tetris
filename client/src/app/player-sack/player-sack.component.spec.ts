import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSackComponent } from './player-sack.component';

describe('PlayerSackComponent', () => {
	let component: PlayerSackComponent;
	let fixture: ComponentFixture<PlayerSackComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PlayerSackComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PlayerSackComponent);
		component = fixture.componentInstance;
		component.chaosPieceRemaining = 0;
		component.hasLost = false;
		component.sack = [0, 1, 2];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
