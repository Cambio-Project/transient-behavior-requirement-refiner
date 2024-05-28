import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DataService } from 'src/app/core/services/data.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { LogicOperator } from 'src/app/shared/enums/logic-operator';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';

@Component({
    selector: 'app-property-edit-dynamic',
    templateUrl: './property-edit-dynamic.component.html',
    styleUrls: ['./property-edit-dynamic.component.scss'],
})
export class PropertyEditDynamicComponent implements OnInit {
    @Input() dataset: Dataset | null = null;

    psp?: PSP;
    pspElements?: PSPElement[];
    predicates?: Predicate[];

    simId?: string;
    responseIndex?: number;

    propertyValidationResponse: ValidationResponse | null = null;

    constructor(
        private route: ActivatedRoute,
        private dataSvc: DataService,
        private validationSvc: ValidationService,
        private dashboardSvc: DashboardService
    ) {}

    ngOnInit(): void {
        this.getParameters();
        //this.initHardCodedData();
    }

    async getParameters() {
        this.route.queryParams.subscribe(async (params) => {
            let address = params['file-address'] || 'assets/csv';
            let filename = params['file'];

            this.simId = params['sim_id'];
            this.responseIndex = params['response_index'];
            this.psp = {
                sel: params['sel'],
                tbvTimed: params['tbv_timed'],
            };
            this.predicates = JSON.parse(params['predicates']).map(
                (predicate: Predicate) => {
                    return {
                        ...predicate,
                        predicate_comparison_value:
                            +predicate.predicate_comparison_value!,
                    };
                }
            );

            this.pspElements = getPSPElementsFromSEL(this.psp.sel);

            this.dataset = await this.dataSvc.parseCsvFileFromAddress(
                address,
                filename
            );
            this.validateProperty();
        });
    }

    /* async initHardCodedData() {
		// CSV
		this.dataset = await this.dataSvc.parseCsvFileFromAddress('assets/csv', 'chaos-exp-1-trace.csv');

		// Scenario
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
	} */

    predicatesValid(predicates?: Predicate[]) {
        return !predicates?.find((predicate) =>
            hasNullOrEmptyProperty(predicate)
        );
    }

    async validateProperty() {
        if (
            this.dataset &&
            this.psp &&
            this.predicates &&
            this.predicatesValid(this.predicates)
        ) {
            this.validationSvc
                .validatePropertyDynamic(
                    this.dataset,
                    this.psp?.tbvTimed,
                    this.predicates
                )
                .then((validationResponse) => {
                    this.propertyValidationResponse = validationResponse;
                });
        }
    }

    onPredicateChange(predicates: Predicate[]) {
        this.validateProperty();
    }

    onConfirmRefinement() {
        if (
            this.simId == null ||
            this.responseIndex == null ||
            this.predicates == null
        )
            return;
        this.dashboardSvc
            .updateScenarioResponse(
                this.simId,
                this.responseIndex,
                this.predicates
            )
            .subscribe((res) => {
                console.log(res);
            });
    }
}

export interface PSP {
    sel: string;
    tbvTimed: string;
}

export interface PSPElement {
    predicateName: string | null;
    measurementSource: string | null;
    specification: string | null;
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

    const elements = sel
        .split(SEL_TO_PSP_REGEX)
        .map((s) => s.trim())
        .filter((s) => s);

    return elements.map((s) => {
        if (s.charAt(0) === '{') {
            const predicateName = extractPredicateName(s);
            const measurementSource = extractMeasurementSource(s);
            const specification = `${predicateName}(${measurementSource})`;
            return {
                predicateName,
                measurementSource,
                specification,
                text: s,
                type: 'predicate',
            };
        } else {
            return {
                predicateName: null,
                measurementSource: null,
                specification: null,
                text: s,
                type: 'text',
            };
        }
    });
};

const extractPredicateName = (str: string) => {
    let regex = /{([A-Za-z0-9]+)\(/;
    let match = str.match(regex);
    return match ? match[1] : null;
};

const extractMeasurementSource = (str: string) => {
    let regex = /\(([^)]+)\)/;
    let match = str.match(regex);
    return match ? match[1] : null;
};

function hasNullOrEmptyProperty(obj: any) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let value = obj[key];
            if (value === null || value === undefined || value === '') {
                return true;
            }
        }
    }
    return false;
}
