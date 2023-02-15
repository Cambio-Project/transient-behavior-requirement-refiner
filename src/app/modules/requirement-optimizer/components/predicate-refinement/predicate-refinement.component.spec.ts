import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicateRefinementComponent } from './predicate-refinement.component';

describe('PredicateRefinementComponent', () => {
  let component: PredicateRefinementComponent;
  let fixture: ComponentFixture<PredicateRefinementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredicateRefinementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredicateRefinementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
