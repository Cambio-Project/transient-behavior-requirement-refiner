import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from 'src/app/core/services/data.service';
import {LogicOperator} from 'src/app/shared/enums/logic-operator';
import {Dataset} from 'src/app/shared/models/dataset';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-property-plot-dynamic',
    templateUrl: './property-plot-dynamic.component.html',
    styleUrls: ['./property-plot-dynamic.component.scss'],
})
export class PropertyPlotDynamicComponent implements OnInit {
    @Input() dataset: Dataset | null = null;
    predicate?: Predicate;

    predicateForm: FormGroup = new FormGroup({
        //predicate_name: new FormControl({value: null, disabled: false}, [Validators.required]),
        measurement_source: new FormControl(null, [Validators.required]),
        //predicate_logic: new FormControl(null, [Validators.required]),
        predicate_comparison_value: new FormControl(null, [Validators.required]),
    });

    constructor(
        private route: ActivatedRoute,
        private dataSvc: DataService
    ) {
    }

    ngOnInit(): void {
        this.getParameters();
        this.initForm();
    }

    initForm() {
        if (this.predicate) {
            this.predicateForm.patchValue(this.predicate);
        }
    }

    getParameters() {
        this.route.queryParams.subscribe(async (params) => {
            let address = params['file-address'] || 'assets/csv';
            let filename = params['file'];

            this.predicate = {
                ...JSON.parse(params['predicates']),
                predicate_comparison_value: +JSON.parse(params['predicates']).predicate_comparison_value!,
            };

            this.dataSvc.parseCsvFileFromAddress(
                address,
                filename
            ).then(dataset => this.dataset = dataset);
        });
    }
}

export interface Predicate {
    predicate_name?: string;
    predicate_logic?: LogicOperator;
    measurement_source?: string;
    predicate_comparison_value?: number;
}

