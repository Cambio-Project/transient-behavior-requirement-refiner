import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicateEditDynamicComponent } from './predicate-edit-dynamic.component';

describe('PredicateEditDynamicComponent', () => {
  let component: PredicateEditDynamicComponent;
  let fixture: ComponentFixture<PredicateEditDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredicateEditDynamicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredicateEditDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
