import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

	sourceType: 'demo' | 'upload' | 'prometheus' = 'demo';
	assetCsvFiles: string[] = [
		'chaos-exp-1-trace.csv',
		'chaos-exp-2-trace.csv',
        'chaos-exp-3-trace.csv',
	];

    dbUrl: string = 'http://localhost:9090';
    dbConnected: boolean = false;
    dbMetricLabels: string[] = [];
    selectedStartDatetime: Date = new Date();
    selectedEndDatetime: Date = new Date();
    selectedStepSize: string = "1m";
    selectedMetrics: string[] = [];

	constructor(private dataSvc: DataService, private snackBar: MatSnackBar) {
        this.selectedStartDatetime.setMinutes(this.selectedStartDatetime.getMinutes() - 30);
    }

    ngOnInit(): void { }

	onFileSelected(ev: any) {
		const file = ev.srcElement.files[0];
		this.loadCsvFileLocal(file);
	}

	onDemoFileChange(event: MatSelectChange) {
		const fileName = event.value;
		this.loadCsvFileFromAssets(fileName);
	}

    async onConnectButtonPressed() {
        this.dataSvc.setDbUrl(this.dbUrl).then(res => {
            if (res) {
                this.dbConnected = true;
                this.showSnackbar('Successfully connected to the database!', ['mat-toolbar', 'mat-primary'])
                this.loadAvailableMetrics();
            } else {
                this.dbConnected = false;
                this.showSnackbar('Failed to connect to the database!', ['mat-toolbar', 'mat-warn'])
            }
        });
    }

    async onQueryButtonPressed() {
        await this.dataSvc.getMetrics(
            this.dbUrl,
            this.selectedMetrics,
            this.selectedStartDatetime,
            this.selectedEndDatetime,
            this.selectedStepSize
        ).then(res => {
            if (res.length == 0) {
                this.showSnackbar('No metrics found!', ['mat-toolbar', 'mat-warn']);
            } else {
                this.setDataset(res);
            }
        }).catch(err => {
            let msg = err.error.error
            this.showSnackbar(msg, ['mat-toolbar', 'mat-warn']);
        })
    }


    async onMetricChange(event: MatSelectChange) {
        this.selectedMetrics = event.value;
    }

	async loadCsvFileLocal(file: File) {
		const dataset = await this.dataSvc.parseCsvFile(file);
		this.setDataset(dataset);
	}

	async loadCsvFileFromAssets(fileName: string) {
		const dataset = await this.dataSvc.parseCsvFileFromAssets(fileName);
		this.setDataset(dataset);
	}

    async loadAvailableMetrics() {
        this.dbMetricLabels = await this.dataSvc.getAvailableMetrics(this.dbUrl);
    }

	setDataset(dataset: Dataset) {
		this.dataset = dataset;
		this.datasetChange.emit(this.dataset);
		this.metricDefinitions = ['time', ...this.dataset.metricDefinitions];
	}

    private showSnackbar(message: string, panelClass: string[]) {
        this.snackBar.open(message, 'Close', {duration: 3000, panelClass: panelClass});
    }

}
