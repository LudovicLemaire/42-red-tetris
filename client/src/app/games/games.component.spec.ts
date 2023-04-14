import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesComponent } from './games.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

describe('GamesComponent', () => {
	let component: GamesComponent;
	let fixture: ComponentFixture<GamesComponent>;
	let nameInput: HTMLInputElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GamesComponent],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				MatFormFieldModule,
				BrowserAnimationsModule,
				MatInputModule,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GamesComponent);
		component = fixture.componentInstance;
		nameInput = fixture.nativeElement.querySelector('input');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('join room with error', () => {
		nameInput.value = 'wrong name';
		nameInput.dispatchEvent(new Event('input'));
		component.joinRoom();
		expect(component).toBeTruthy();
	});

	it('check room name too long', () => {
		nameInput.value = 'Room-555555555555555555555555';
		nameInput.dispatchEvent(new Event('input'));
		expect(component.getErrorMessage()).toEqual('Too long');
	});

	it('check room name empty', () => {
		nameInput.value = '';
		nameInput.dispatchEvent(new Event('input'));
		expect(component.getErrorMessage()).toEqual('You must enter a value');
	});

	it('check room name valid', () => {
		nameInput.value = 'Room-5';
		nameInput.dispatchEvent(new Event('input'));
		expect(component.getErrorMessage()).toEqual('');
	});

	it('move button', () => {
		component.moveButton();
		component.moveButton();
		component.moveButton();
		component.moveButton();
		expect(component.typeAnimation).toEqual(4);
	});
});
