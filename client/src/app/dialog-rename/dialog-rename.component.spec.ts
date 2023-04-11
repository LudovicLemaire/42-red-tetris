import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogRenameComponent } from './dialog-rename.component';

describe('DialogRenameComponent', () => {
	let component: DialogRenameComponent;
	let fixture: ComponentFixture<DialogRenameComponent>;
	let nameInput: HTMLInputElement;
	const dialogMock = {
		close: () => {},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogRenameComponent],
			imports: [
				MatFormFieldModule,
				MatInputModule,
				MatIconModule,
				FormsModule,
				BrowserAnimationsModule,
			],
			providers: [{ provide: MatDialogRef, useValue: dialogMock }],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogRenameComponent);
		component = fixture.componentInstance;
		nameInput = fixture.nativeElement.querySelector('input');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('input change', () => {
		nameInput.value = 'globy';
		nameInput.dispatchEvent(new Event('input'));

		expect(component.newName).toEqual('globy');
	});

	it('name edit worked', () => {
		nameInput.value = 'globy';
		nameInput.dispatchEvent(new Event('input'));

		let button = fixture.nativeElement.querySelector('button');
		button.click();

		expect(component.newName).toEqual('');
	});
});
