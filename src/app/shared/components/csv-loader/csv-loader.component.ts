import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Dataset} from '../../models/dataset';
import {DataService} from '../../../core/services/data.service';
import {MatSelectChange} from '@angular/material/select';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-csv-loader',
  templateUrl: './csv-loader.component.html',
  styleUrls: ['./csv-loader.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, height: '*' })),
      state('out', style({ opacity: 0, height: '0px' })),
      transition('out => in', animate('200ms ease-in')),
      transition('in => out', animate('200ms ease-out'))
    ])
  ]
})
export class CsvLoaderComponent implements OnInit {

  dataset: Dataset | null = null;
  @Output() datasetChange: EventEmitter<Dataset> = new EventEmitter<Dataset>();
  metricDefinitions?: string[];

  sourceType: 'demo' | 'upload' | 'prometheus' = 'demo';
  assetCsvFiles: string[] = [
    'chaos-exp-1-trace.csv',
    'chaos-exp-2-trace.csv',
  ];

  dbUrl: string = 'http://localhost:9090';
  dbProxyUrl: string = 'http://localhost:3000/proxy';
  dbUseCredentials: boolean = false;
  dbUsername: string = '';
  dbPassword: string = '';
  dbConnected: boolean = false;
  dbMetricLabels: string[] = [];
  selectedStartDatetime: Date = new Date();
  selectedEndDatetime: Date = new Date();
  selectedStepSize: string = "1m";
  selectedMetrics: string[] = [];

  constructor(private dataSvc: DataService, private snackBar: MatSnackBar) {
    this.selectedStartDatetime.setMinutes(this.selectedStartDatetime.getMinutes() - 30);
  }

  ngOnInit(): void {
  }

  onFileSelected(ev: any) {
    const file = ev.srcElement.files[0];
    this.loadCsvFileLocal(file);
  }

  onDemoFileChange(event: MatSelectChange) {
    const fileName = event.value;
    this.loadCsvFileFromAssets(fileName);
  }

  async onConnectButtonPressed() {
    if (this.dbUseCredentials && (this.dbUsername == '' || this.dbPassword == '' || this.dbProxyUrl == '')) {
      this.showSnackbar('Please provide proxy URL and credentials!', ['mat-toolbar', 'mat-warn'])
      return;
    }

    if (this.dbUseCredentials) {
      this.dataSvc.setCredentials(this.dbProxyUrl, this.dbUsername, this.dbPassword);
    } else {
      this.dataSvc.clearCredentials();
    }

    this.dataSvc.setDbUrl(this.dbUrl).then(res => {
      if (res["success"]) {
        this.dbConnected = true;
        this.showSnackbar(res["msg"], ['mat-toolbar', 'mat-primary'])
        this.loadAvailableMetrics();
      } else {
        this.dbConnected = false;
        this.showSnackbar(res["msg"], ['mat-toolbar', 'mat-warn'])
      }
    });
  }

  async onQueryButtonPressed() {
    await this.dataSvc.getMetrics(
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
      console.log(err);
      let msg = err.error.message;
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
    this.dbMetricLabels = await this.dataSvc.getAvailableMetrics();
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
