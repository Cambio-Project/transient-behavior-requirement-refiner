import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternOccurrenceAbsenceComponent } from './pattern-occurrence-absence.component';

describe('PatternOccurrenceAbsenceComponent', () => {
  let component: PatternOccurrenceAbsenceComponent;
  let fixture: ComponentFixture<PatternOccurrenceAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternOccurrenceAbsenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternOccurrenceAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
