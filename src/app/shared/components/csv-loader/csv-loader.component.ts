import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Dataset } from '../../models/dataset';
import { DataService } from '../../../core/services/data.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
	selector: 'app-csv-loader',
	templateUrl: './csv-loader.component.html',
	styleUrls: ['./csv-loader.component.scss']
})
export class CsvLoaderComponent implements OnInit {

	dataset: Dataset | null = null;
	@Output() datasetChange: EventEmitter<Dataset> = new EventEmitter<Dataset>();
	metricDefinitions?: string[];

	sourceType: 'demo' | 'upload' = 'demo';
	assetCsvFiles: string[] = [
		'chaos-exp-1-trace.csv',
		'chaos-exp-2-trace.csv',
	];

	constructor(private dataSvc: DataService) { }

	ngOnInit(): void { }

	onFileSelected(ev: any) {
		const file = ev.srcElement.files[0];
		this.loadCsvFileLocal(file);
	}

	onDemoFileChange(event: MatSelectChange) {
		const fileName = event.value;
		this.loadCsvFileFromAssets(fileName);
	}

	async loadCsvFileLocal(file: File) {
		const dataset = await this.dataSvc.parseCsvFile(file);
		this.setDataset(dataset);
	}

	async loadCsvFileFromAssets(fileName: string) {
		const dataset = await this.dataSvc.parseCsvFileFromAssets(fileName);
		this.setDataset(dataset);
	}

	setDataset(dataset: Dataset) {
		this.dataset = dataset;
		this.datasetChange.emit(this.dataset);
		this.metricDefinitions = ['time', ...this.dataset.metricDefinitions];
	}

}
