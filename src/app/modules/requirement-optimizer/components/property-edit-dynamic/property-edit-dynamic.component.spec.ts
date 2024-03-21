import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEditDynamicComponent } from './property-edit-dynamic.component';

describe('PropertyEditDynamicComponent', () => {
  let component: PropertyEditDynamicComponent;
  let fixture: ComponentFixture<PropertyEditDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEditDynamicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEditDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
