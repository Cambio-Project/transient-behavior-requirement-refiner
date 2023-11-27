import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationService } from 'src/app/core/services/validation.service';
import { LogicOperator } from 'src/app/shared/enums/logic-operator';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
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
	predicateLogicOperator: LogicOperator;
	property: Property;

	validationResponses?: ValidationResponse[];
	isLoading: boolean = false;

	constructor(
		private dialogRef: MatDialogRef<PredicateRefinementComponent>,
		@Inject(MAT_DIALOG_DATA) private data: { dataset: Dataset, predicateName: string, predicateLogicOperator: LogicOperator, property: Property },
		private validationSvc: ValidationService,
	) {
		this.dataset = data.dataset;
		this.predicateName = data.predicateName;
		this.predicateLogicOperator = data.predicateLogicOperator;
		this.property = data.property;
	}

	ngOnInit(): void {
		this.refinePredicate();
	}

	async refinePredicate() {
		this.isLoading = true;
		this.validationResponses = await this.validationSvc.refinePredicate(this.dataset, this.predicateName, this.predicateLogicOperator, this.property);
		this.isLoading = false;
	}

	onConfirm(comparisonValue: number) {
		this.dialogRef.close(comparisonValue);
	}

}
