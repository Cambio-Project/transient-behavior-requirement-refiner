import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPlotterComponent } from './graph-plotter.component';

describe('GraphPlotterComponent', () => {
  let component: GraphPlotterComponent;
  let fixture: ComponentFixture<GraphPlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphPlotterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphPlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
