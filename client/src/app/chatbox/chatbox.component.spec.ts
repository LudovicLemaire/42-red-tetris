import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';

import { ChatboxComponent } from './chatbox.component';
import { DialogRenameComponent } from '../dialog-rename/dialog-rename.component';

describe('ChatboxComponent', () => {
	let component: ChatboxComponent;
	let fixture: ComponentFixture<ChatboxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ChatboxComponent, DialogRenameComponent],
			imports: [
				MatDialogModule,
				MatCardModule,
				MatTabsModule,
				MatIconModule,
				BrowserAnimationsModule,
				MatFormFieldModule,
				MatInputModule,
				FormsModule,
			],
			providers: [],
		}).compileComponents();

		fixture = TestBed.createComponent(ChatboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('dialog openned', () => {
		component.openDialog();
		expect(component).toBeTruthy();
	});

	it('leaveRooms', () => {
		component.leaveRooms();
		expect(component.room).toEqual('');
	});

	it('colorFromString func', () => {
		expect(component.colorFromString('globy')).toEqual('#ff8f00');
	});

	it('sendMessage empty', () => {
		component.newMessage = '';
		component.sendMessage();
		expect(component).toBeTruthy();
	});

	it('sendMessage check if empty after processing', () => {
		component.newMessage = 'Salut';
		component.sendMessage();
		expect(component.newMessage).toEqual('');
		component.newMessage = 'Salut';
		component.activeChatIndex = 1;
		component.sendMessage();
		expect(component.newMessage).toEqual('');
	});

	it('changeExpanded', () => {
		component.expanded = true;
		component.changeExpanded();
		expect(component.expanded).toBeFalsy();
		component.changeExpanded();
		expect(component.expanded).toBeTruthy();
	});
});
