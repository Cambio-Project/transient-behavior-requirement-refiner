import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphPlotterComponent } from './components/graph-plotter/graph-plotter.component';
import { CsvLoaderComponent } from './components/csv-loader/csv-loader.component';
import { PatternFilterPipe } from './pipes/pattern-filter.pipe';
import { CategoryFilterPipe } from './pipes/category-filter.pipe';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import {MatDatepickerModule} from "@angular/material/datepicker";



@NgModule({
	declarations: [
		CsvLoaderComponent,
		GraphPlotterComponent,
		PatternFilterPipe,
		CategoryFilterPipe,
	],
    imports: [
        CommonModule,

        // Forms
        FormsModule,
        ReactiveFormsModule,

        // Material
        MatTabsModule,
        MatToolbarModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatDividerModule,
        MatSliderModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatSnackBarModule,
        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
    ],
	exports: [
		// Components
		CsvLoaderComponent,
		GraphPlotterComponent,

		// Forms
		FormsModule,
		ReactiveFormsModule,

		// Material
		MatTabsModule,
		MatToolbarModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatCardModule,
		MatDividerModule,
		MatSliderModule,
		MatButtonModule,
		MatIconModule,
		MatRadioModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatStepperModule,
        MatSnackBarModule,

		// Pipes
		PatternFilterPipe,
		CategoryFilterPipe,
	]
})
export class SharedModule { }
