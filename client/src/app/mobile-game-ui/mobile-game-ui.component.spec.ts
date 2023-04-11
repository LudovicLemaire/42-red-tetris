import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileGameUIComponent } from './mobile-game-ui.component';

describe('MobileGameUIComponent', () => {
  let component: MobileGameUIComponent;
  let fixture: ComponentFixture<MobileGameUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileGameUIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileGameUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
