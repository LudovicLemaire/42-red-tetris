import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdSubComponent } from './third-sub.component';

describe('ThirdSubComponent', () => {
  let component: ThirdSubComponent;
  let fixture: ComponentFixture<ThirdSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
