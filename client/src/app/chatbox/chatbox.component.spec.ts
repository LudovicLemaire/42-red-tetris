import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
