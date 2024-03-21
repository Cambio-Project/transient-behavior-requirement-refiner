import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationService } from 'src/app/core/services/validation.service';
import { LogicOperator } from 'src/app/shared/enums/logic-operator';
import { Dataset } from 'src/app/shared/models/dataset';
import { PredicateRefinementResponse } from 'src/app/shared/models/validation-response';
import { interval } from "rxjs";
import { Predicate } from '../property-edit-dynamic/property-edit-dynamic.component';

@Component({
	selector: 'app-predicate-refinement-dynamic',
	templateUrl: './predicate-refinement-dynamic.component.html',
	styleUrls: ['./predicate-refinement-dynamic.component.scss']
})
export class PredicateRefinementDynamicComponent implements OnInit {

	@ViewChild('chart') chart?: ElementRef;

	dataset: Dataset;
	tbv: string;
	predicates: Predicate[]
	predicateName: string;
	measurementSource: string;
	predicateLogicOperator: LogicOperator

	refinementResponse?: PredicateRefinementResponse;
	isLoading: boolean = false;

	constructor(
		private dialogRef: MatDialogRef<PredicateRefinementDynamicComponent>,
		@Inject(MAT_DIALOG_DATA) data: { dataset: Dataset, tbv: string, predicates: Predicate[], predicateName: string, measurementSource: string, predicateLogicOperator: LogicOperator },
		private validationSvc: ValidationService,
	) {
		this.dataset = data.dataset;
		this.tbv = data.tbv;
		this.predicates = data.predicates;
		this.predicateName = data.predicateName;
		this.measurementSource = data.measurementSource;
		this.predicateLogicOperator = data.predicateLogicOperator;
	}

	ngOnInit(): void {
		this.refinePredicate();
	}

	async refinePredicate() {
		this.isLoading = true;
		this.refinementResponse = await this.validationSvc.refinePredicateRemoteDynamic(
			this.dataset, this.tbv, this.predicates, this.predicateName, this.measurementSource
		);
		this.isLoading = false;
	}

	onConfirm(comparisonValue: number) {
		this.dialogRef.close(comparisonValue);
	}

	protected readonly interval = interval;
	protected readonly parseFloat = parseFloat;

	getFormattedValue(i: number): string {
		const value = this.refinementResponse!.interval.start + i * this.refinementResponse!.interval.step;
		return Number.isInteger(value) ? value.toString() : value.toFixed(5).replace(',', '.');
	}
}
