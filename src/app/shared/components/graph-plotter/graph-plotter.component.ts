import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Dataset } from '../../models/dataset';
import { ValidationResponse } from '../../models/validation-response';

declare var Plot: any;

@Component({
	selector: 'app-graph-plotter',
	templateUrl: './graph-plotter.component.html',
	styleUrls: ['./graph-plotter.component.scss']
})
export class GraphPlotterComponent implements OnInit, AfterViewInit {

	/*
		DATASET
	*/
	private _dataset?: Dataset;
	get dataset(): Dataset | undefined {
		return this._dataset;
	}
	@Input() set dataset(dataset: Dataset | undefined) {
		this._dataset = dataset;
		this.plot();
	}

	/*
		PROPERTIES
	*/
	private _properties?: string[];
	get properties(): string[] | undefined {
		return this._properties;
	}
	@Input() set properties(properties: string[] | undefined) {
		this._properties = properties;
		this.plot();
	}

	/*
		COMPARISON VALUE
	*/
	private _comparisonValue?: number;
	get comparisonValue(): number | undefined {
		return this._comparisonValue;
	}
	@Input() set comparisonValue(comparisonValue: number | undefined) {
		this._comparisonValue = comparisonValue;
		this.plot();
	}

	/*
		VALIDATION RESPONSE
	*/
	private _validationResponse?: ValidationResponse | null;
	get validationResponse(): ValidationResponse | null | undefined {
		return this._validationResponse;
	}
	@Input() set validationResponse(validationResponse: ValidationResponse | null | undefined) {
		this._validationResponse = validationResponse;
		this.plot();
	}

	@Input() width: number = 640;
	@Input() height: number = 320;


	@ViewChild('chart') chart?: ElementRef;

	displayPlaceholder: boolean = true;


	constructor() { }

	ngOnInit(): void { }

	ngAfterViewInit(): void {
		this.plot();
	}

	plot() {
		if (!this.chart?.nativeElement) {
			return;
		}

		const properties = this.properties?.filter(property => property !== null);

		while (this.chart.nativeElement.firstChild) this.chart.nativeElement.removeChild(this.chart.nativeElement.firstChild);
		if (this.dataset && properties && properties.length > 0) {
			//while (this.chart.nativeElement.firstChild) this.chart.nativeElement.removeChild(this.chart.nativeElement.firstChild);
			this.displayPlaceholder = false;


			// DATASET			
			const marks = properties.map(property => Plot.line(this.dataset?.data, { x: 'time', y: property }));

			// COMPARISON VALUE
			if (!Number.isNaN(this.comparisonValue)) {
				marks.push(Plot.ruleY([this.comparisonValue], { stroke: '#00f' }));
			}

			// VALIDATION RESPONSE
			if (this.validationResponse) {
				// TODO
				//const height = this.dataset?.metricMax(properties[0]);				
				const height = Math.max(...properties.map(property => this.dataset?.metricMax(property) || 0));

				this.validationResponse.intervals.forEach(interval => {
					const arr = Array.from({ length: interval.end - interval.start + 1 }).map((val, i) => {
						return {
							time: i + interval.start,
							height: height,
						}
					});
					marks.push(Plot.areaY(arr, { x: 'time', y: 'height', fill: interval.result ? '#0f0' : '#f00', opacity: 0.25 }));
				})
			}

			// PLOT
			const plot = Plot.plot({
				height: this.height,
				width: this.width,
				y: {
					grid: true,
					inset: 6
				},
				marks,
			});
			this.chart.nativeElement.append(plot);
		} else {
			this.displayPlaceholder = true;
		}
	}

}
