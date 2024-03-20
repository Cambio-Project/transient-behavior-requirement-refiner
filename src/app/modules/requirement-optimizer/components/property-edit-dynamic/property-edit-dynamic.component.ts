import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DataService } from 'src/app/core/services/data.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { LogicOperator } from 'src/app/shared/enums/logic-operator';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';

@Component({
	selector: 'app-property-edit-dynamic',
	templateUrl: './property-edit-dynamic.component.html',
	styleUrls: ['./property-edit-dynamic.component.scss']
})
export class PropertyEditDynamicComponent implements OnInit {

	@Input() dataset: Dataset | null = null;

	psp?: PSP;
	pspElements?: PSPElement[];
	predicates?: Predicate[];

	simId?: string;
	scenarioId?: string;
	responseIndex?: number;

	propertyValidationResponse: ValidationResponse | null = null;

	constructor(
		private dataSvc: DataService,
		private validationSvc: ValidationService,
		private dashboardSvc: DashboardService,
	) { }

	ngOnInit(): void {
		this.initHardCodedData();
	}

	async initHardCodedData() {
		// CSV
		await this.loadCsvFileFromAssets('chaos-exp-1-trace.csv');

		// Scenario
		this.scenarioId = '678';
		this.simId = '12345';
		this.responseIndex = 0;

		// PSP
		this.psp = {
			sel: 'Globally, if {EventA(resp_time)} [has occurred] then in response {EventB(instances)} [eventually holds].',
			tbvTimed: 'always(((EventA(resp_time) and (EventA(resp_time)) ) since[0,30] EventB(instances)))',
		}
		this.pspElements = getPSPElementsFromSEL(this.psp.sel);

		// Predicatess
		this.predicates = [
			{
				measurement_source: 'resp_time',
				predicate_comparison_value: 100,
				predicate_logic: LogicOperator.BIGGER,
				predicate_name: 'EventA',
			},
			{
				measurement_source: 'instances',
				predicate_comparison_value: 1,
				predicate_logic: LogicOperator.BIGGER,
				predicate_name: 'EventB',
			}
		];
		this.validateProperty();
	}

	async loadCsvFileFromAssets(fileName: string) {
		this.dataset = await this.dataSvc.parseCsvFileFromAssets(fileName);
	}

	predicatesValid(predicates?: Predicate[]) {
		return !predicates?.find(predicate => hasNullOrEmptyProperty(predicate));
	}

	async validateProperty() {
		if (this.dataset && this.psp && this.predicates && this.predicatesValid(this.predicates)) {
			this.validationSvc.validatePropertyDynamic(this.dataset, this.psp?.tbvTimed, this.predicates).then(validationResponse => {
				this.propertyValidationResponse = validationResponse;
			});
		}
	}

	onPredicateChange(predicate: Predicate) {
		this.validateProperty();
	}

	onConfirmRefinement() {
		if (this.scenarioId == null || this.responseIndex == null || this.predicates == null) return;
		this.dashboardSvc.updateScenarioResponse(this.scenarioId, this.responseIndex, this.predicates).subscribe(res => {
			console.log(res);
		})
	}

}

export interface PSP {
	sel: string;
	tbvTimed: string;
}

export interface PSPElement {
	predicateName: string | null;
	text: string;
	type: 'predicate' | 'text';
}

export interface Predicate {
	predicate_name?: string;
	predicate_logic?: LogicOperator;
	measurement_source?: string;
	predicate_comparison_value?: number;
}

export const getPSPElementsFromSEL = (sel: string): PSPElement[] => {
	const SEL_TO_PSP_REGEX = /(?=\{[^{}]+\}|\[[^\[\]]+\])/g;

	const elements = sel.split(SEL_TO_PSP_REGEX)
		.map(s => s.trim())
		.filter(s => s);

	return elements.map(s => {
		if (s.charAt(0) === '{') {
			return {
				predicateName: extractPredicateName(s),
				text: s,
				type: 'predicate',
			}
		} else {
			return {
				predicateName: null,
				text: s,
				type: 'text',
			}
		}
	});
}

const extractPredicateName = (str: string) => {
	let regex = /{([A-Za-z0-9]+)\(/;
	let match = str.match(regex);
	return match ? match[1] : null;
}

function hasNullOrEmptyProperty(obj: any) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			let value = obj[key];
			if (value === null || value === undefined || value === '') {
				return true; // Found a property that is null, undefined, or an empty string
			}
		}
	}
	return false; // No such property found
}