import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdSubSubComponent } from './third-sub-sub.component';

describe('ThirdSubSubComponent', () => {
  let component: ThirdSubSubComponent;
  let fixture: ComponentFixture<ThirdSubSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdSubSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdSubSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
