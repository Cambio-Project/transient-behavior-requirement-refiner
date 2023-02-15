import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
import { Event } from 'src/app/shared/psp/sel/event';
import { Property } from 'src/app/shared/psp/sel/property';

@Component({
	selector: 'app-predicate-refinement',
	templateUrl: './predicate-refinement.component.html',
	styleUrls: ['./predicate-refinement.component.scss']
})
export class PredicateRefinementComponent implements OnInit {

	@ViewChild('chart') chart?: ElementRef;

	dataset: Dataset;
	predicateName: string;
	property: Property;

	validationResponses?: ValidationResponse[];
	isLoading: boolean = false;

	constructor(
		private dialogRef: MatDialogRef<PredicateRefinementComponent>,
		@Inject(MAT_DIALOG_DATA) private data: { dataset: Dataset, predicateName: string, property: Property },
		private validationSvc: ValidationService,
	) {
		this.dataset = data.dataset;
		this.predicateName = data.predicateName;
		this.property = data.property;
	}

	ngOnInit(): void {
		this.refinePredicate();
	}

	async refinePredicate() {
		this.isLoading = true;
		console.log(this.predicateName)
		this.validationResponses = await this.validationSvc.refinePredicate(this.dataset, this.predicateName, this.property);
		this.isLoading = false;

		this.validationResponses.forEach(res => {
			if (res.validatedItem instanceof Property) {
				console.log(res.validatedItem.getPattern()?.getEvents().find(predicate => predicate.getName() === this.predicateName)?.getComparisonValue());
			}
		})
	}

	onConfirm(index: number) {
		this.dialogRef.close(index);
	}


}
