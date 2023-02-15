import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternOrderResponseEditComponent } from './pattern-order-response-edit.component';

describe('PatternOrderResponseEditComponent', () => {
  let component: PatternOrderResponseEditComponent;
  let fixture: ComponentFixture<PatternOrderResponseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternOrderResponseEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternOrderResponseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
