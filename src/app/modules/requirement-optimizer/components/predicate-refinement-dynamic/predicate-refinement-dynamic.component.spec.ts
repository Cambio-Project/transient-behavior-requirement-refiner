import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicateRefinementDynamicComponent } from './predicate-refinement-dynamic.component';

describe('PredicateRefinementDynamicComponent', () => {
  let component: PredicateRefinementDynamicComponent;
  let fixture: ComponentFixture<PredicateRefinementDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredicateRefinementDynamicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredicateRefinementDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
