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
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphPlotterComponent } from './components/graph-plotter/graph-plotter.component';
import { CsvLoaderComponent } from './components/csv-loader/csv-loader.component';
import { PatternFilterPipe } from './pipes/pattern-filter.pipe';
import { CategoryFilterPipe } from './pipes/category-filter.pipe';
import { LogicOperatorPipe } from './pipes/logic-operator.pipe';


@NgModule({
	declarations: [
		CsvLoaderComponent,
		GraphPlotterComponent,
		PatternFilterPipe,
		CategoryFilterPipe,
		LogicOperatorPipe,
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
		MatCheckboxModule,
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
		MatCheckboxModule,

		// Pipes
		PatternFilterPipe,
		CategoryFilterPipe,
		LogicOperatorPipe,
	]
})
export class SharedModule { }
