import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { LottieModule } from 'ngx-lottie';

import { GameRoomComponent } from './game-room.component';
import { WaitingRoomComponent } from '../waiting-room/waiting-room.component';
import { RouterModule } from '@angular/router';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerService } from '../player-service/player.service';

function playerFactory() {
	return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

describe('GameRoomComponent', () => {
	let component: GameRoomComponent;
	let fixture: ComponentFixture<GameRoomComponent>;
	let service: PlayerService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GameRoomComponent, WaitingRoomComponent],
			imports: [
				MatCardModule,
				LottieModule.forRoot({ player: playerFactory }),
				RouterModule.forRoot([]),
				MatChipsModule,
				MatListModule,
				MatMenuModule,
				BrowserAnimationsModule,
			],
			providers: [],
		}).compileComponents();

		fixture = TestBed.createComponent(GameRoomComponent);
		service = TestBed.inject(PlayerService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('didComplete', () => {
		component.didComplete();
		expect(component.isComplete).toBeTruthy();
	});

	it('isGameActive get/set', done => {
		component.isGameActive = undefined;
		service.getIsGameActive().subscribe((isActive: boolean) => {
			if (isActive !== false) {
				expect(isActive).toBeTruthy();
				setTimeout(() => {
					component.playLottie();
					setTimeout(() => {
						done();
					}, 1000);
				}, 1000);
			}
		});
		service.setIsGameActive(true);
	});
});
