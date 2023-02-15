import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
import { Interval } from 'src/app/shared/psp/constraints/interval';
import { TimeBound } from 'src/app/shared/psp/constraints/time-bound';
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
		const result = await this.validationSvc.refineTimebound(this.dataset, this.property);
		this.isLoading = false;
		this.plot(result);

		const validatedItem = result?.validatedItem;
		if (validatedItem instanceof Property) {
			const pattern = validatedItem.getPattern()
			if (pattern instanceof Response) {
				this.refinedTimebound = pattern.getSTimeBound();
			}
		}
	}

	plot(validationResponse: ValidationResponse | null) {
		if (!this.chart?.nativeElement || !validationResponse) {
			return;
		}

		const marks: any[] = [];

		const validatedItem = validationResponse.validatedItem;
		if (validatedItem instanceof Property) {
			const pattern = validatedItem.getPattern()
			if (pattern instanceof Response) {
				const timeBound = pattern.getSTimeBound();
				if (timeBound instanceof Interval) {
					const upperLimit = timeBound.getUpperLimit();
					console.log(upperLimit)

					const areaValid = Array.from({ length: upperLimit }).map((val, j) => {
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
			}
		}

		// PLOT
		const plot = Plot.plot({
			height: 480,
			width: 720,
			y: {
				grid: true,
				inset: 6
			},
			marks,
		});
		this.chart.nativeElement.append(plot);
	}

	/* async refineTimeboundConstraint() {
		this.isLoading = true;
		const result = await this.validationSvc.refineTimebound(this.dataset, this.property);
		this.isLoading = false;
		this.plot(result);


		const validatedItem = result?.find(r => r.result)?.validatedItem;
		if (validatedItem instanceof Property) {
			const pattern = validatedItem.getPattern()
			if (pattern instanceof Response) {
				this.refinedTimebound = pattern.getSTimeBound();
			}
		}
	} */

	/* plot(validationResponses: ValidationResponse[] | null) {
		if (!this.chart?.nativeElement || !validationResponses) {
			return;
		}

		const marks: any[] = [];
		validationResponses.forEach((validationResponse, i) => {
			const arr = Array.from({ length: 11 }).map((val, j) => {
				return {
					timebound: i * 10 + j,
					height: 1,
				}
			});
			marks.push(Plot.areaY(arr, { x: 'timebound', y: 'height', fill: validationResponse.result ? '#0f0' : '#f00', opacity: 0.25 }));
		})


		// PLOT
		const plot = Plot.plot({
			height: 480,
			width: 720,
			y: {
				grid: true,
				inset: 6
			},
			marks,
		});
		this.chart.nativeElement.append(plot);
	} */

	onConfirm() {
		if (this.refinedTimebound) {
			const pattern = this.property.getPattern();
			if (pattern instanceof Response) {
				pattern.setSTimeBound(this.refinedTimebound);
				this.dialogRef.close(this.refinedTimebound);
			}
		}
	}

}
