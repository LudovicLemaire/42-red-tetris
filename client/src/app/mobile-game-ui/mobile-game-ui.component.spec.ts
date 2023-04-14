import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileGameUIComponent } from './mobile-game-ui.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

describe('MobileGameUIComponent', () => {
	let component: MobileGameUIComponent;
	let fixture: ComponentFixture<MobileGameUIComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MobileGameUIComponent],
			imports: [MatGridListModule, MatIconModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MobileGameUIComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('pushUI', () => {
		component.pushUI('ArrowRight');
		component.pushUI('ArrowLeft');
		component.pushUI('ArrowDown');
		component.pushUI('ArrowUp');
		component.pushUI(' ');
		component.pushUI('Chaos');
		expect(component).toBeTruthy();
	});
});
