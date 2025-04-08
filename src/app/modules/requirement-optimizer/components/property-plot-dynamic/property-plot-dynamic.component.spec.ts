import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPlotDynamicComponent } from './property-plot-dynamic.component';

describe('PropertyPlotDynamicComponent', () => {
  let component: PropertyPlotDynamicComponent;
  let fixture: ComponentFixture<PropertyPlotDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPlotDynamicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyPlotDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
