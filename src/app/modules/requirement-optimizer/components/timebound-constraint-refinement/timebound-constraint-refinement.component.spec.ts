import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeboundConstraintRefinementComponent } from './timebound-constraint-refinement.component';

describe('TimeboundConstraintRefinementComponent', () => {
  let component: TimeboundConstraintRefinementComponent;
  let fixture: ComponentFixture<TimeboundConstraintRefinementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeboundConstraintRefinementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeboundConstraintRefinementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
