import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicateEditComponent } from './predicate-edit.component';

describe('PredicateEditComponent', () => {
  let component: PredicateEditComponent;
  let fixture: ComponentFixture<PredicateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredicateEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredicateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
