import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementOptimizerComponent } from './requirement-optimizer.component';

describe('RequirementOptimizerComponent', () => {
  let component: RequirementOptimizerComponent;
  let fixture: ComponentFixture<RequirementOptimizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementOptimizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementOptimizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
