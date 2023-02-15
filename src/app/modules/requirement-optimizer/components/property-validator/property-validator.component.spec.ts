import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyValidatorComponent } from './property-validator.component';

describe('PropertyValidatorComponent', () => {
  let component: PropertyValidatorComponent;
  let fixture: ComponentFixture<PropertyValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyValidatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
