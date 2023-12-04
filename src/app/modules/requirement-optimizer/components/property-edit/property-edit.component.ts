import { Component, Input, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
import { Interval } from 'src/app/shared/psp/constraints/interval';
import { LowerTimeBound } from 'src/app/shared/psp/constraints/lower-time-bound';
import { TimeBound } from 'src/app/shared/psp/constraints/time-bound';
import { UpperTimeBound } from 'src/app/shared/psp/constraints/upper-time-bound';
import { Event } from 'src/app/shared/psp/sel/event';
import { Response } from 'src/app/shared/psp/sel/patterns/order/response';
import { Dataset } from '../../../../shared/models/dataset';
import { PSPConstants } from '../../../../shared/psp/engine/pspconstants';
import { Property } from '../../../../shared/psp/sel/property';

@Component({
	selector: 'app-property-edit',
	templateUrl: './property-edit.component.html',
	styleUrls: ['./property-edit.component.scss']
})
export class PropertyEditComponent implements OnInit {

	@Input() dataset: Dataset | null = null;
	@Input() property: Property | null = null;

	propertyValidationResponse: ValidationResponse | null = null;

	PSPConstants = PSPConstants;

	constructor(
		private validationSvc: ValidationService,
	) { }

	ngOnInit(): void { }

	onPropertyChange(property: Property) {
		this.property = property;
		this.propertyValidationResponse = null;
		this.validateProperty();
	}

	async validateProperty() {
		const dataset = this.dataset;
		const property = this.property;
		if (dataset && property?.valid) {
			this.validationSvc.validateProperty(dataset, property).then(validationResponse => {
				this.propertyValidationResponse = validationResponse;
			});
		}
	}

}
