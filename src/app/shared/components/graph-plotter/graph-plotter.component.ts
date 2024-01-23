import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Dataset } from '../../models/dataset';
import { ValidationResponse } from '../../models/validation-response';
import { MatCheckboxChange } from '@angular/material/checkbox';

declare var Plot: any;
declare var d3: any;

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
		this._properties = properties?.filter(property => !!property);
		this.plot();
	}

	deactivatedProperties = new Set<string>();

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
		if (!this.chart?.nativeElement) return;

		const properties = this.properties?.filter(property => !this.deactivatedProperties.has(property));

		while (this.chart.nativeElement.firstChild) this.chart.nativeElement.removeChild(this.chart.nativeElement.firstChild);
		if (this.dataset && properties && properties.length > 0) {
			this.displayPlaceholder = false;

			// DATASET

			let yAxis;
			const marks = [];

			// Display 2 Y-Axis when pattern has exactly two properties
			if (properties.length === 2) {
				// Primary Y-Axis
				yAxis = {
					axis: "left",
					label: properties[0],
					grid: true,
					inset: 6,
					tickSize: '120px',
				};

				// Secondary Y-Axis
				const property0 = (d: any) => d[properties[0]];
				const property1 = (d: any) => d[properties[1]];
				const secondaryYAxis = d3.scaleLinear(d3.extent(this.dataset?.data, property1), [0, d3.max(this.dataset?.data, property0)]);
				const secondaryYAxisColor = '#C576F6';

				marks.push(
					Plot.axisY(secondaryYAxis.ticks(), { color: secondaryYAxisColor, anchor: "right", label: properties[1], y: secondaryYAxis, tickFormat: secondaryYAxis.tickFormat() }),
					Plot.ruleY([0]),
					Plot.lineY(this.dataset?.data, { x: "time", y: property0 }),
					Plot.lineY(this.dataset?.data, Plot.mapY((D: any) => D.map(secondaryYAxis), { x: "time", y: property1, stroke: secondaryYAxisColor }))
				);
			} else {
				marks.push(...properties.map(property => Plot.line(this.dataset?.data, { x: 'time', y: property })));
				yAxis = {
					label: properties.join(', '),
					grid: true,
					inset: 6,
					tickSize: '120px',
				};
			}

			// COMPARISON VALUE
			if (!Number.isNaN(this.comparisonValue)) {
				marks.push(Plot.ruleY([this.comparisonValue], { stroke: '#00f' }));
			}

			// VALIDATION RESPONSE
			if (this.validationResponse) {
				let height = 0;
				if(properties.length === 2)	{
					height = this.dataset?.metricMax(properties[0]);
				}	else {
					height = Math.max(...properties.map(property => this.dataset?.metricMax(property) || 0)) * 1.5;
				}
				
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
				y: yAxis,
				marks,
			});
			this.chart.nativeElement.append(plot);
		} else {
			this.displayPlaceholder = true;
		}
	}

	onSelectedMetricChange(ev: MatCheckboxChange) {
		const changedProperty = ev.source.value;
		if (!ev.checked) {
			this.deactivatedProperties.add(changedProperty);
		} else {
			this.deactivatedProperties.delete(changedProperty);
		}
		this.plot();
	}

}


