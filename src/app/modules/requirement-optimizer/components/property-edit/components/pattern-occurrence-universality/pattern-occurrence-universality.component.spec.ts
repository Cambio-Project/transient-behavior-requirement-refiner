import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternOccurrenceUniversalityComponent } from './pattern-occurrence-universality.component';

describe('PatternOccurrenceUniversalityComponent', () => {
  let component: PatternOccurrenceUniversalityComponent;
  let fixture: ComponentFixture<PatternOccurrenceUniversalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternOccurrenceUniversalityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternOccurrenceUniversalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
