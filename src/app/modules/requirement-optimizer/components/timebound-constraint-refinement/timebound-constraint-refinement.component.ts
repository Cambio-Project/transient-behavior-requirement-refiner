import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Dataset } from 'src/app/shared/models/dataset';
import { Interval } from 'src/app/shared/psp/constraints/interval';
import { TimeBound } from 'src/app/shared/psp/constraints/time-bound';
import { UpperTimeBound } from 'src/app/shared/psp/constraints/upper-time-bound';
import { Absence } from 'src/app/shared/psp/sel/patterns/occurence/absence';
import { Universality } from 'src/app/shared/psp/sel/patterns/occurence/universality';
import { Response } from 'src/app/shared/psp/sel/patterns/order/response';
import { Property } from 'src/app/shared/psp/sel/property';

declare var Plot: any;

@Component({
	selector: 'app-timebound-constraint-refinement',
	templateUrl: './timebound-constraint-refinement.component.html',
	styleUrls: ['./timebound-constraint-refinement.component.scss']
})
export class TimeboundConstraintRefinementComponent implements OnInit {

	@ViewChild('chart') chart?: ElementRef;

	dataset: Dataset;
	property: Property;
	isLoading: boolean = false;

	refinedTimebound?: TimeBound | null;

	constructor(
		private dialogRef: MatDialogRef<TimeboundConstraintRefinementComponent>,
		@Inject(MAT_DIALOG_DATA) private data: { dataset: Dataset, property: Property },
		private validationSvc: ValidationService,
	) {
		this.dataset = data.dataset;
		this.property = data.property;
	}

	ngOnInit(): void {
		this.refineTimeboundConstraint();
	}

	async refineTimeboundConstraint() {
		this.isLoading = true;
		this.refinedTimebound = await this.validationSvc.refineTimebound(this.dataset, this.property);
		this.isLoading = false;
		this.plot(this.refinedTimebound);
	}

	plot(timeBound: TimeBound | null) {
		if (!this.chart?.nativeElement || !timeBound) return;

		const marks: any[] = [];

		if (timeBound instanceof Interval) {
			const lowerLimit = timeBound.getLowerLimit();
			const upperLimit = timeBound.getUpperLimit();

			// Area Valid
			const areaValid = Array.from({ length: upperLimit - lowerLimit + 2 }).map((val, j) => {
				return {
					timebound: j + lowerLimit - 1,
					height: 1,
				}
			})
			marks.push(Plot.areaY(areaValid, { x: 'timebound', y: 'height', fill: '#0f0', opacity: 0.25 }));

			// Area Invalid Lower
			const areaInvalidLower = Array.from({ length: lowerLimit }).map((val, j) => {
				return {
					timebound: j,
					height: 1,
				}
			})
			marks.push(Plot.areaY(areaInvalidLower, { x: 'timebound', y: 'height', fill: '#f00', opacity: 0.25 }));

			// Area Invalid Upper
			const areaInvalidUpper = Array.from({ length: this.data.dataset.data.length - upperLimit }).map((val, j) => {
				return {
					timebound: j + upperLimit,
					height: 1,
				}
			})
			marks.push(Plot.areaY(areaInvalidUpper, { x: 'timebound', y: 'height', fill: '#f00', opacity: 0.25 }));
		} else if (timeBound instanceof UpperTimeBound) {
			const upperLimit = timeBound.getUpperLimit();
			const areaValid = Array.from({ length: upperLimit + 1 }).map((val, j) => {
				return {
					timebound: j,
					height: 1,
				}
			})
			marks.push(Plot.areaY(areaValid, { x: 'timebound', y: 'height', fill: '#0f0', opacity: 0.25 }));

			const areaInvalid = Array.from({ length: this.data.dataset.data.length - upperLimit }).map((val, j) => {
				return {
					timebound: j + upperLimit,
					height: 1,
				}
			})
			marks.push(Plot.areaY(areaInvalid, { x: 'timebound', y: 'height', fill: '#f00', opacity: 0.25 }));
		}

		// PLOT
		const plot = Plot.plot({
			height: 480,
			width: 720,
			y: {
				grid: true,
				inset: 6,
				label: null,
				tickFormat: null,
			},
			marks,
		});
		this.chart.nativeElement.append(plot);
	}

	onConfirm() {
		if (this.refinedTimebound) {
			const pattern = this.property.getPattern();
			if (pattern instanceof Response) {
				pattern.setSTimeBound(this.refinedTimebound);
				this.dialogRef.close(this.refinedTimebound);
			} else if (pattern instanceof Absence || pattern instanceof Universality) {
				pattern.setPTimeBound(this.refinedTimebound);
				this.dialogRef.close(this.refinedTimebound);
			}
		}
	}

}
