import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisboardComponent } from './tetrisboard.component';

describe('TetrisboardComponent', () => {
  let component: TetrisboardComponent;
  let fixture: ComponentFixture<TetrisboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TetrisboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TetrisboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
