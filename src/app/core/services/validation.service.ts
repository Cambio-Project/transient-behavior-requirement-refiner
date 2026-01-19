import { Injectable } from '@angular/core';
import {
    ValidationResponse,
    PredicateRefinementResponse,
} from '../../shared/models/validation-response';
import { Event } from '../../shared/psp/sel/event';
import { Dataset } from 'src/app/shared/models/dataset';
import { Property } from 'src/app/shared/psp/sel/property';
import { Response } from 'src/app/shared/psp/sel/patterns/order/response';
import { Interval } from 'src/app/shared/psp/constraints/interval';
import { Pattern } from 'src/app/shared/psp/sel/patterns/pattern';
import {
    LogicOperator,
    requiresComparisonValue,
} from 'src/app/shared/enums/logic-operator';
import { UpperTimeBound } from 'src/app/shared/psp/constraints/upper-time-bound';
import { Absence } from 'src/app/shared/psp/sel/patterns/occurence/absence';
import { Universality } from 'src/app/shared/psp/sel/patterns/occurence/universality';
import { TimeBound } from 'src/app/shared/psp/constraints/time-bound';
import { Predicate } from 'src/app/modules/requirement-optimizer/components/property-edit-dynamic/property-edit-dynamic.component';

//const VERIFIER_URL = "http://localhost:5000";  // local
const VERIFIER_URL = 'http://localhost:8083'; // docker

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    constructor() {}

    async validatePredicate(
        dataset: Dataset,
        predicate: Event
    ): Promise<ValidationResponse> {
        if (!predicate.predicateSpecification || !predicate.predicateInfo) {
            throw new Error('Invalid Predicate');
        }

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: predicate.predicateSpecification,
            specification_type: 'tbv',
            predicates_info: [predicate.predicateInfo],
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
            options: {
                create_plots: false,
            },
        });
        return this.sendRequest('monitor', request, predicate, dataset.file);
    }

    async validateProperty(dataset: Dataset, property: Property) {
        console.log('validateProperty');

        if (!property.propertySpecification || !property.predicateInfos) {
            throw new Error('Invalid Property');
        }

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: property.propertySpecification,
            specification_type: 'psp',
            predicates_info: property.predicateInfos,
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
            options: {
                create_plots: false,
            },
        });
        return this.sendRequest(
            'monitor',
            request,
            property,
            dataset.file
        ).then((validationResponse) => {
            return validationResponse;
        });
    }

    async validatePredicateDynamic(
        dataset: Dataset,
        predicateSpecification: string,
        predicate: Predicate,
        futureMtl: boolean
    ): Promise<ValidationResponse> {
        if (!predicateSpecification || !predicate) {
            throw new Error('Invalid Predicate');
        }

        const predicateFormatted = {
            ...predicate,
            predicate_comparison_value:
                '' + predicate.predicate_comparison_value,
        };

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: predicateSpecification,
            specification_type: 'tbv',
            future-mtl: futureMtl,
            predicates_info: [predicateFormatted],
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
            options: {
                create_plots: false,
            },
        });

        console.log('validatePredicate');
        console.log(request);

        return this.sendRequest('monitor', request, null as any, dataset.file);
    }

    async validatePropertyDynamic(
        dataset: Dataset,
        tbv: string,
        predicates: Predicate[],
        futureMtl: boolean
    ) {
        if (!tbv || !predicates) {
            throw new Error('Invalid Property');
        }

        const predicatesFormatted = predicates.map((predicate) => {
            return {
                ...predicate,
                predicate_comparison_value:
                    '' + predicate.predicate_comparison_value,
            };
        });

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: tbv,
            specification_type: 'tbv',
            predicates_info: predicatesFormatted,
            future-mtl: futureMtl,
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
            options: {
                create_plots: false,
            },
        });

        console.log('validateProperty');
        console.log(request);

        return this.sendRequest(
            'monitor',
            request,
            null as any,
            dataset.file
        ).then((validationResponse) => {
            return validationResponse;
        });
    }

    async refinePredicateRemoteDynamic(
        dataset: Dataset,
        tbv: string,
        predicates: Predicate[],
        predicateName: string,
        measurementSource: string,
        futureMtl: boolean
    ): Promise<PredicateRefinementResponse> {
        const predicatesFormatted = predicates.map((predicate) => {
            return {
                ...predicate,
                predicate_comparison_value:
                    '' + predicate.predicate_comparison_value,
            };
        });

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: tbv,
            specification_type: 'tbv',
            future-mtl: futureMtl,
            predicates_info: predicatesFormatted,
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
        });

        return this.sendPredicateRefinementRequest(
            request,
            dataset,
            predicateName,
            measurementSource
        );
    }

    async refineTimeboundRemote(
        dataset: Dataset,
        property: Property,
        futureMtl: boolean
    ): Promise<TimeBound | null> {
        if (!property.propertySpecification || !property.predicateInfos) {
            throw new Error('Invalid Property');
        }

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: property.propertySpecification,
            specification_type: 'psp',
            future-mtl: futureMtl,
            predicates_info: property.predicateInfos,
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
        });

        return this.sendRequest(
            'refine_timebound',
            request,
            property,
            dataset.file
        ).then((refinementResponse) => {
            if (refinementResponse.result === true) {
                return refinementResponse.timebound;
            }
            return null;
        });
    }

    async refineTimebound(
        dataset: Dataset,
        property: Property
    ): Promise<TimeBound | null> {
        const pattern = property.getPattern();

        let start = 0;
        let end = dataset.data.length - 1;

        if (pattern instanceof Response) {
            let lowerTimebound = start;
            let upperTimebound = end;

            let refinedlowerTimebound = -1;
            let refinedUpperTimebound = -1;
            let refinedInterval: Interval | null = null;
            while (lowerTimebound <= end && upperTimebound <= end) {
                const propertyCandidate = Object.assign(
                    Object.create(Object.getPrototypeOf(property)),
                    property
                );
                const patternCandidate = Object.assign(
                    Object.create(Object.getPrototypeOf(pattern)),
                    pattern
                );
                const evaluatedTimebound = new Interval(
                    new Event(
                        'Candidate' + lowerTimebound + ' to ' + upperTimebound
                    ),
                    lowerTimebound,
                    upperTimebound,
                    'time units'
                );
                patternCandidate.setSTimeBound(evaluatedTimebound);
                propertyCandidate.setPattern(patternCandidate);
                const validationResponse = await this.validateProperty(
                    dataset,
                    propertyCandidate
                );

                if (refinedlowerTimebound === -1) {
                    if (validationResponse.result === true) {
                        refinedInterval = evaluatedTimebound;
                        lowerTimebound++;
                    } else if (refinedInterval) {
                        refinedlowerTimebound =
                            lowerTimebound =
                            upperTimebound =
                                refinedInterval.getLowerLimit();
                    } else {
                        lowerTimebound++;
                    }
                } else if (refinedUpperTimebound === -1) {
                    if (validationResponse.result === true) {
                        refinedUpperTimebound = upperTimebound;
                        return evaluatedTimebound;
                    } else {
                        upperTimebound++;
                    }
                }
            }
        } else if (
            pattern instanceof Absence ||
            pattern instanceof Universality
        ) {
            let upperTimeboundValue = 0;
            let refinedTimebound: TimeBound | null = null;
            while (upperTimeboundValue <= end) {
                const propertyCandidate = Object.assign(
                    Object.create(Object.getPrototypeOf(property)),
                    property
                );
                const patternCandidate = Object.assign(
                    Object.create(Object.getPrototypeOf(pattern)),
                    pattern
                );
                const evaluatedTimebound = new UpperTimeBound(
                    new Event('Candidate' + upperTimeboundValue),
                    upperTimeboundValue,
                    'time units'
                );
                patternCandidate.setPTimeBound(evaluatedTimebound);
                propertyCandidate.setPattern(patternCandidate);
                const validationResponse = await this.validateProperty(
                    dataset,
                    propertyCandidate
                );
                if (validationResponse.result === true) {
                    refinedTimebound = evaluatedTimebound;
                } else if (refinedTimebound !== null) {
                    return refinedTimebound;
                }
                upperTimeboundValue++;
            }
        }
        return null;
    }

    async refinePredicateRemote(
        dataset: Dataset,
        predicateName: string,
        property: Property,
        futureMtl: boolean
    ): Promise<PredicateRefinementResponse> {
        if (!property.propertySpecification || !property.predicateInfos) {
            throw new Error('Invalid Property');
        }
        const pattern = property.getPattern();
        if (!pattern) {
            throw new Error('Invalid Pattern');
        }
        const event = pattern!
            .getEvents()
            .find((event) => event.getSpecification() === predicateName);
        if (!event) {
            throw new Error('Invalid Event');
        }

        console.log(event);

        const request = JSON.stringify({
            behavior_description: 'description',
            specification: property.propertySpecification,
            specification_type: 'psp',
            future-mtl: futureMtl,
            predicates_info: property.predicateInfos,
            measurement_source: 'csv',
            measurement_points: dataset.measurementPoints,
        });

        return this.sendPredicateRefinementRequest(
            request,
            dataset,
            event.getName(),
            event.getMeasurementSource()!
        );
    }

    async refinePredicate(
        dataset: Dataset,
        predicateName: string,
        logicOperator: LogicOperator,
        property: Property
    ) {
        if (!requiresComparisonValue(logicOperator)) {
            throw new Error(
                'No refinement available for logic operators that do not require a comparison value'
            );
        }

        const pattern = property.getPattern();
        const event = pattern
            ?.getEvents()
            .find((event) => event.getSpecification() === predicateName);
        const promises: Promise<ValidationResponse>[] = [];

        if (event && event.fMeasurementSource) {
            const max = dataset.metricMax(event.fMeasurementSource) + 2;
            for (let i = 0; i < max; i++) {
                const propertyCandidate: Property = Object.assign(
                    Object.create(Object.getPrototypeOf(property)),
                    property
                );
                const patternCandidate: Pattern = Object.assign(
                    Object.create(
                        Object.getPrototypeOf(propertyCandidate.getPattern())
                    ),
                    propertyCandidate.getPattern()
                );
                const eventCandidate = patternCandidate
                    ?.getEvents()
                    .find(
                        (event) => event.getSpecification() === predicateName
                    );
                if (eventCandidate) {
                    eventCandidate.setComparisonValue(i);
                    eventCandidate.setLogicOperator(logicOperator);
                    promises.push(
                        this.validateProperty(dataset, propertyCandidate)
                    );
                }
            }
        } else if (
            property.getScope().getQ().getSpecification() === predicateName
        ) {
            const scopeEvent = property.getScope().getQ();
            if (scopeEvent && scopeEvent.fMeasurementSource) {
                const max =
                    dataset.metricMax(scopeEvent.fMeasurementSource) + 2;
                for (let i = 0; i < max; i++) {
                    const propertyCandidate: Property = Object.assign(
                        Object.create(Object.getPrototypeOf(property)),
                        property
                    );
                    const scopeEcentCandidate = propertyCandidate
                        .getScope()
                        .getQ();
                    if (scopeEcentCandidate) {
                        scopeEcentCandidate.setComparisonValue(i);
                        scopeEcentCandidate.setLogicOperator(logicOperator);
                        promises.push(
                            this.validateProperty(dataset, propertyCandidate)
                        );
                    }
                }
            }
        }
        return Promise.all(promises);
    }

    private sendPredicateRefinementRequest(
        request: string,
        dataset: Dataset,
        predicateName: string,
        measurementName: string
    ): Promise<PredicateRefinementResponse> {
        return new Promise((resolve, reject) => {
            var formdata = new FormData();
            formdata.append('formula_json', request);
            formdata.append('file', dataset.file, dataset.file.name);

            var requestOptions: RequestInit = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            let url = VERIFIER_URL + '/refine_predicate';
            url += `?predicate=${predicateName}&metric=${measurementName}`;

            fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const response = JSON.parse(result);
                    const refinementResponse = new PredicateRefinementResponse(
                        response
                    );
                    console.log(refinementResponse);
                    resolve(refinementResponse);
                })
                .catch((error) => {
                    console.log('error', error);
                    reject(error);
                });
        });
    }

    private sendRequest(
        endpoint: string,
        request: string,
        validatedItem: Property | Event,
        file: File
    ): Promise<ValidationResponse> {
        return new Promise((resolve, reject) => {
            var formdata = new FormData();
            formdata.append('formula_json', request);
            formdata.append('file', file, file.name);

            var requestOptions: RequestInit = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            let url = VERIFIER_URL + '/' + endpoint;

            fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const response = JSON.parse(result);
                    const validationResponse = new ValidationResponse(
                        response,
                        validatedItem
                    );
                    console.log(validationResponse);
                    resolve(validationResponse);
                })
                .catch((error) => {
                    console.log('error', error);
                    reject(error);
                });
        });
    }
}
