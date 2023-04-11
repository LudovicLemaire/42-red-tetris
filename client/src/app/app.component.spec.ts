import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

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
