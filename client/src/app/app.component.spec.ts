import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';

import { AppComponent } from './app.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { SocketIoService } from './socketio-service/socket-io.service';

describe('AppComponent', () => {
	let app: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let serviceSocket: SocketIoService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent, ChatboxComponent],
			imports: [
				RouterTestingModule,
				MatSidenavModule,
				BrowserAnimationsModule,
				MatSelectModule,
				MatIconModule,
				MatToolbarModule,
				MatSlideToggleModule,
				MatListModule,
				MatDialogModule,
				MatCardModule,
				MatTabsModule,
			],
			providers: [],
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
		serviceSocket = TestBed.inject(SocketIoService);
	});

	it('should create the app', () => {
		expect(app).toBeTruthy();
	});

	it(`should have as title 'red-tetris'`, () => {
		expect(app.title).toEqual('red-tetris');
	});

	it('check triggerMenu', () => {
		app.menu = false;
		app.triggerMenu();
		expect(app.menu).toBeTruthy();
		app.triggerMenu();
		expect(app.menu).toBeFalsy();
	});

	it('changeTheme', () => {
		app.changeTheme(true);
		expect(
			app.overlay.getContainerElement().classList.contains('light-theme')
		).toBeTruthy();
		app.changeTheme(false);
		expect(
			app.overlay.getContainerElement().classList.contains('light-theme')
		).toBeFalsy();
	});
});
