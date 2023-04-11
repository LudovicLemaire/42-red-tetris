import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { ChaosButtonComponent } from './chaos-button.component';

describe('ChaosButtonComponent', () => {
	let component: ChaosButtonComponent;
	let fixture: ComponentFixture<ChaosButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ChaosButtonComponent],
			imports: [MatIconModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ChaosButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
