import { Component, Input, OnInit } from '@angular/core';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
import { AfterQ } from 'src/app/shared/psp/sel/scopes/after-q';
import { Dataset } from '../../../../shared/models/dataset';
import { Property } from '../../../../shared/psp/sel/property';

@Component({
	selector: 'app-property-validator',
	templateUrl: './property-validator.component.html',
	styleUrls: ['./property-validator.component.scss']
})
export class PropertyValidatorComponent implements OnInit {

	private _dataset: Dataset | null = null;
	@Input() set dataset(dataset: Dataset | null) {
		this._dataset = dataset;
		this.propertyValidationResponse = null;
	}
	get dataset() {
		return this._dataset;
	}

	private _property: Property | null = null;
	@Input() set property(property: Property | null) {
		this._property = property;
		this.propertyValidationResponse = null;
	}
	get property() {
		return this._property;
	}

	//@Input() dataset: Dataset | null = null;
	//@Input() property: Property | null = null;


	@Input() propertyValidationResponse: ValidationResponse | null = null;

	constructor() { }

	ngOnInit(): void { }

	get displayedMetrics() {
		if (this.property) {
			const measuerementSources = this.property.getPattern()?.getEvents().map(event => event.fMeasurementSource as string);
			const scope = this.property.getScope()
			if (scope instanceof AfterQ) {
				measuerementSources?.push(scope.getQ().fMeasurementSource as string);
			}
			return [...new Set(measuerementSources)];
		} else {
			return [];
		}
	}
}
