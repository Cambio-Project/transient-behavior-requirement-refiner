import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
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
import {Absence} from "../../../../shared/psp/sel/patterns/occurence/absence";
import {AfterQ} from "../../../../shared/psp/sel/scopes/after-q";
import {DataService} from "../../../../core/services/data.service";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-property-edit',
	templateUrl: './property-edit.component.html',
	styleUrls: ['./property-edit.component.scss']
})
export class PropertyEditComponent implements OnInit, AfterViewInit {

	@Input() dataset: Dataset | null = null;
	@Input() property: Property | null = null;

	propertyValidationResponse: ValidationResponse | null = null;

	PSPConstants = PSPConstants;

	constructor(
        private validationSvc: ValidationService, private dataSvc: DataService, private route: ActivatedRoute
    ) {}

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

    async ngAfterViewInit(): Promise<void> {
        await this.skipToSpecification()
    }

    async skipToSpecification() {
        try {
            this.route.queryParams.subscribe(async params => {
                let address = params["file-address"] || "assets/csv"
                let filename = params["file"]
                let sim_id = params["sim_id"]

                if (!!filename == !!sim_id) {
                    throw new Error("Either provide sim_id or file name, not both or none.")
                }
                if (sim_id) {
                    address = `${address}/${sim_id}`
                    filename = "_combined.csv"
                }
                this.dataset = await this.dataSvc.parseCsvFileFromAddress(address, filename)

                if (params["pattern"] === "Absence"){
                    this.property = this.getAbsencePSP()
                }
            })
        } catch (e) {
            console.log(e)
        }

    }

    //TODO Remove this, just for temp
    getAbsencePSP() {
        const evQ = new Event('Q');
        const ev1 = new Event('Event1');
        const pattern = new Absence();
        pattern.setP(ev1);
        const property = new Property('AbsencePSP');
        property.setPattern(pattern);
        const scope = new AfterQ(evQ);
        property.setScope(scope);
        return property;
    }

}
