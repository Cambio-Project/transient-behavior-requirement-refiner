import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeboundConstraintEditComponent } from './timebound-constraint-edit.component';

describe('TimeboundConstraintEditComponent', () => {
  let component: TimeboundConstraintEditComponent;
  let fixture: ComponentFixture<TimeboundConstraintEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeboundConstraintEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeboundConstraintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
