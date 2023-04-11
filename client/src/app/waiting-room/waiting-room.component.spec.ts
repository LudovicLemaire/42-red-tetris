import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
	let component: WaitingRoomComponent;
	let fixture: ComponentFixture<WaitingRoomComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WaitingRoomComponent],
			imports: [
				MatCardModule,
				MatChipsModule,
				MatListModule,
				MatMenuModule,
				RouterTestingModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
			],
			providers: [],
		}).compileComponents();

		fixture = TestBed.createComponent(WaitingRoomComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('launch game', done => {
		component.startGame();
		component.prepareGame();
		setTimeout(() => {
			expect(component).toBeTruthy();
			done();
		}, 2000);
	});

	it('setAdmin', () => {
		component.setAdmin('fakeUser');
		expect(component).toBeTruthy();
	});

	it('kickFromRoom', () => {
		component.kickFromRoom('fakeUser');
		expect(component).toBeTruthy();
	});

	it('setRoom', () => {
		component.setRoom('fakeRoom');
		expect(component).toBeTruthy();
	});
});
