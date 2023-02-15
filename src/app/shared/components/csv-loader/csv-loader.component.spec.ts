import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvLoaderComponent } from './csv-loader.component';

describe('CsvLoaderComponent', () => {
  let component: CsvLoaderComponent;
  let fixture: ComponentFixture<CsvLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
