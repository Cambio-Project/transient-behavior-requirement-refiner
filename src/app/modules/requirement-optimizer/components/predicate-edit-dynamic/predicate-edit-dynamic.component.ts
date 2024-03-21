import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOGIC_OPERATOR_OPTIONS, requiresComparisonValue } from 'src/app/shared/enums/logic-operator';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
import { PSP, PSPElement, Predicate } from '../property-edit-dynamic/property-edit-dynamic.component';
import { debounceTime } from 'rxjs';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatDialog } from '@angular/material/dialog';
import { PredicateRefinementDynamicComponent } from '../predicate-refinement-dynamic/predicate-refinement-dynamic.component';

@Component({
	selector: 'app-predicate-edit-dynamic',
	templateUrl: './predicate-edit-dynamic.component.html',
	styleUrls: ['./predicate-edit-dynamic.component.scss']
})
export class PredicateEditDynamicComponent implements OnInit {

	@Input() dataset: Dataset | null = null;
	@Input() psp?: PSP;
	@Input() pspElement?: PSPElement;
	@Input() predicates?: Predicate[];
	@Output() predicatesChange = new EventEmitter<Predicate[]>();

	@ViewChild("myPlot") myPlot?: ElementRef

	validationResponse?: ValidationResponse;
	editFormExpaneded: boolean = false;

	comparisonValue: FormControl = new FormControl(null, [Validators.required])
	logicOperator: FormControl = new FormControl(null, [Validators.required])

	predicateForm: FormGroup = new FormGroup({
		predicate_name: new FormControl({ value: null, disabled: false }, [Validators.required]),
		measurement_source: new FormControl(null, [Validators.required]),
		predicate_logic: this.logicOperator,
		predicate_comparison_value: this.comparisonValue,
	});

	LOGIC_OPERATOR_OPTIONS = LOGIC_OPERATOR_OPTIONS;
	requiresComparisonValue = requiresComparisonValue;

	constructor(
		private dialog: MatDialog,
		private validationSvc: ValidationService,
	) { }

	ngOnInit(): void {
		this.initForm();

		this.logicOperator.valueChanges
			.pipe(debounceTime(400))
			.subscribe(res => {
				this.controlComparisonValueField()
			});

		this.predicateForm.valueChanges
			.pipe(debounceTime(400))
			.subscribe(res => {
				this.updatePredicate();
			});
	}

	updatePredicate() {
		if (this.predicates) {
			/* const i = this.getPredicateIndex(this.predicates, this.predicateForm.value.predicate_name);
			this.predicates[i] = this.predicateForm.value;
			this.validatePredicate();
			this.predicatesChange.emit(this.predicateForm.value); */
			const i = this.getPredicateIndex(this.predicates, this.pspElement?.predicateName!);
			if (i === -1) return;
			this.predicates[i] = this.predicateForm.value;
			this.validatePredicate();
			console.log('EMIT', this.predicates)
			this.predicatesChange.emit(this.predicates);
		}
	}

	initForm() {
		const predicate = this.getPredicate(this.pspElement?.predicateName);
		if (predicate) {
			this.predicateForm.patchValue(predicate);
			this.validatePredicate();
		}
	}

	getPredicate(predicateName?: string | null) {
		return this.predicates?.find(predicate => predicate.predicate_name === predicateName);
	}

	getPredicateIndex(predicates?: Predicate[], predicateName?: string) {
		if (!predicates) return -1;
		for (let i = 0; i < predicates.length; i++) {
			if (predicates[i].predicate_name === predicateName) {
				return i;
			}
		}
		return -1;
	}

	toggleEditForm() {
		this.editFormExpaneded = !this.editFormExpaneded;
		if (this.editFormExpaneded && !this.validationResponse) {
			this.validatePredicate();
		}
	}

	controlComparisonValueField() {
		if (requiresComparisonValue(this.logicOperator.value)) {
			this.comparisonValue.enable()
		} else {
			this.comparisonValue.setValue(null)
			this.comparisonValue.disable()
		}
	}

	validatePredicate() {
		if (this.dataset && this.predicateForm.valid) {
			const predicateSpecification = this.pspElement?.specification!;
			const predicate = this.predicateForm.value;
			this.validationSvc.validatePredicateDynamic(this.dataset, predicateSpecification, predicate).then(validationResponse => this.validationResponse = validationResponse);
			//this.eventChange.emit(this.event);
		}
	}


	async onClickRefinement() {
		const dialogRef = this.dialog.open(PredicateRefinementDynamicComponent, {
			data: {
				dataset: this.dataset,
				tbv: this.psp?.tbvTimed,
				predicates: this.predicates,
				predicateName: this.pspElement?.predicateName,
				measurementSource: this.pspElement?.measurementSource,
				predicateLogicOperator: this.predicateForm.value.predicate_logic,
			},
			width: '512px'
		});

		dialogRef.afterClosed().subscribe((comparisonValue: number | null) => {
			if (typeof comparisonValue === 'number' && comparisonValue !== null) {
				this.predicateForm.patchValue({ predicate_comparison_value: comparisonValue });
				this.updatePredicate();
			}
		});
	}

	mouseEnterEvent() {
		let plots = document.querySelectorAll<HTMLElement>(".plotMarker")
		// @ts-ignore
		for (const plot of plots) {
			plot.style.display = "inline";
		}
	}

	mouseLeaveEvent() {
		let plots = document.querySelectorAll<HTMLElement>(".plotMarker")
		// @ts-ignore
		for (const plot of plots) {
			plot.style.display = "none";
		}
	}

	mouseOverEvent(event: MouseEvent) {
		// @ts-ignore
		let offset = this.myPlot.nativeElement.getBoundingClientRect().left;
		let plots = document.querySelectorAll<HTMLElement>(".plotMarker")
		// @ts-ignore
		for (const plot of plots) {
			plot.style.left = (event.clientX - offset) + "px"
		}
	}

}


