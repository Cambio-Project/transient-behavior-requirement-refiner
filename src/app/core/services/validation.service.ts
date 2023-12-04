import { Injectable } from '@angular/core';
import { ValidationResponse } from '../../shared/models/validation-response';
import { Event } from '../../shared/psp/sel/event';
import { Dataset } from 'src/app/shared/models/dataset';
import { Property } from 'src/app/shared/psp/sel/property';
import { Response } from 'src/app/shared/psp/sel/patterns/order/response';
import { Interval } from 'src/app/shared/psp/constraints/interval';
import { Pattern } from 'src/app/shared/psp/sel/patterns/pattern';
import { LogicOperator, requiresComparisonValue } from 'src/app/shared/enums/logic-operator';
import { TimeBound } from 'src/app/shared/psp/constraints/time-bound';
import { UpperTimeBound } from 'src/app/shared/psp/constraints/upper-time-bound';
import { LowerTimeBound } from 'src/app/shared/psp/constraints/lower-time-bound';

//const VERIFIER_URL = "http://localhost:5000/monitor";
const VERIFIER_URL = "https://transient-behavior-verifier-abngcvp24a-uc.a.run.app/monitor";

@Injectable({
	providedIn: 'root'
})
export class ValidationService {

	constructor() { }

	async validatePredicate(dataset: Dataset, predicate: Event): Promise<ValidationResponse> {
		if (!predicate.predicateSpecification || !predicate.predicateInfo) {
			throw new Error('Invalid Predicate');
		}

		const request = JSON.stringify({
			"behavior_description": "description",
			"specification": predicate.predicateSpecification,
			"specification_type": "mtl",
			"predicates_info": [
				predicate.predicateInfo
			],
			"measurement_source": "csv",
			"measurement_points": dataset.measurementPoints
		});
		return this.sendRequest(request, predicate, dataset.file);
	}

	async validateProperty(dataset: Dataset, property: Property) {
		console.log('validateProperty');

		if (!property.propertySpecification || !property.predicateInfos) {
			throw new Error('Invalid Property');
		}

		const request = JSON.stringify({
			"behavior_description": "description",
			"specification": property.propertySpecification,
			"specification_type": "psp",
			"predicates_info": property.predicateInfos,
			"measurement_source": "csv",
			"measurement_points": dataset.measurementPoints
		});
		return this.sendRequest(request, property, dataset.file).then(validationResponse => {
			return validationResponse;
		});
	}


	async refineTimebound(dataset: Dataset, property: Property): Promise<ValidationResponse | null> {
		const pattern = property.getPattern();
		if (pattern instanceof Response) {
			let start = 0;
			let end = dataset.data.length - 1;
			const validationResponses: ValidationResponse[] = [];
			while (start <= end) {

				let mid = Math.floor((start + end) / 2);
				const propertyCandidate = Object.assign(Object.create(Object.getPrototypeOf(property)), property);
				const patternCandidate = Object.assign(Object.create(Object.getPrototypeOf(pattern)), pattern);
				patternCandidate.setSTimeBound(new Interval(new Event('Candidate' + end), 0, end, 'time units'));
				propertyCandidate.setPattern(patternCandidate);
				const validationResponse = await this.validateProperty(dataset, propertyCandidate);
				validationResponses.push(validationResponse);
				if (validationResponse.result === true) {
					end = mid - 1;
				} else {
					start = mid + 1;
				}


				/* let mid = Math.floor((start + end) / 2);
				const propertyCandidate = Object.assign(Object.create(Object.getPrototypeOf(property)), property);
				const patternCandidate = Object.assign(Object.create(Object.getPrototypeOf(pattern)), pattern);
				patternCandidate.setSTimeBound(new Interval(new Event('Candidate' + mid), 0, mid, 'time units'));
				propertyCandidate.setPattern(patternCandidate);
				const validationResponse = await this.validateProperty(dataset, propertyCandidate);
				validationResponses.push(validationResponse);
				if (validationResponse.result === true) {
					end = mid - 1;
				} else {
					start = mid + 1;
				} */
			}
			const minimumValidationResponse = validationResponses.reverse().find(validationResponse => validationResponse.result === true);
			return minimumValidationResponse || null;
		}
		return null;
	}

	/* async refineTimebound(dataset: Dataset, property: Property) {
		const pattern = property.getPattern();
		if (pattern instanceof Response) {
			//const propertyCandidates = dataset.data.map((_, i) => {
			const propertyCandidates = Array.from({ length: 20 }, (_, i) => i * 10).map(i => {
				const propertyCandidate = Object.assign(Object.create(Object.getPrototypeOf(property)), property);
				const patternCandidate = Object.assign(Object.create(Object.getPrototypeOf(pattern)), pattern);
				patternCandidate.setSTimeBound(new Interval(new Event('Candidate' + i), 0, i, 'time units'));
				propertyCandidate.setPattern(patternCandidate);
				return propertyCandidate as Property;
			});

			return Promise.all(propertyCandidates.map(propertyValidate => this.validateProperty(dataset, propertyValidate)));
		}
		return null;
	} */

	async refinePredicate(dataset: Dataset, predicateName: string, logicOperator: LogicOperator, property: Property) {
		if (!requiresComparisonValue(logicOperator)) {
			throw new Error('No refinement available for logic operators that do not require a comparison value');
		}

		const pattern = property.getPattern();
		const event = pattern?.getEvents().find(event => event.getSpecification() === predicateName);
		const promises: Promise<ValidationResponse>[] = [];

		if (event && event.fMeasurementSource) {
			const max = dataset.metricMax(event.fMeasurementSource) + 2;
			for (let i = 0; i < max; i++) {
				const propertyCandidate: Property = Object.assign(Object.create(Object.getPrototypeOf(property)), property);
				const patternCandidate: Pattern = Object.assign(Object.create(Object.getPrototypeOf(propertyCandidate.getPattern())), propertyCandidate.getPattern());
				const eventCandidate = patternCandidate?.getEvents().find(event => event.getSpecification() === predicateName);
				if (eventCandidate) {
					eventCandidate.setComparisonValue(i);
					eventCandidate.setLogicOperator(logicOperator);
					promises.push(this.validateProperty(dataset, propertyCandidate));
				}
			}
		} else if (property.getScope().getQ().getSpecification() === predicateName) {
			const scopeEvent = property.getScope().getQ();
			if (scopeEvent && scopeEvent.fMeasurementSource) {
				const max = dataset.metricMax(scopeEvent.fMeasurementSource) + 2;
				for (let i = 0; i < max; i++) {
					const propertyCandidate: Property = Object.assign(Object.create(Object.getPrototypeOf(property)), property);
					const scopeEcentCandidate = propertyCandidate.getScope().getQ();
					if (scopeEcentCandidate) {
						scopeEcentCandidate.setComparisonValue(i);
						scopeEcentCandidate.setLogicOperator(logicOperator);
						promises.push(this.validateProperty(dataset, propertyCandidate));
					}
				}
			}
		}
		return Promise.all(promises);
	}

	private sendRequest(request: string, validatedItem: Property | Event, file: File): Promise<ValidationResponse> {
		console.log(request);
		return new Promise((resolve, reject) => {
			var formdata = new FormData();
			formdata.append("formula_json", request);
			formdata.append("file", file, file.name);

			var requestOptions: RequestInit = {
				method: 'POST',
				body: formdata,
				redirect: 'follow'
			};

			fetch(VERIFIER_URL, requestOptions)
				.then(response => response.text())
				.then(result => {
					const response = JSON.parse(result);
					const validationRespone = new ValidationResponse(response, validatedItem);
					console.log(validationRespone);
					resolve(validationRespone);
				})
				.catch(error => {
					console.log('error', error);
					reject(error);
				});
		});
	}
}



const fixPropertyTimeContraint = (dataset: Dataset, property: Property) => {
	const pattern = property.getPattern();
	if (pattern instanceof Response) {
		let timeBound = getTimeConstraint(dataset, pattern.getSTimeBound());
		pattern.setSTimeBound(timeBound);
	}
}


const getTimeConstraint = (dataset: Dataset, timeBound: TimeBound | null) => {
	const timeUnit = 'time units';
	const datasetLength = dataset.data.length;

	if (!timeBound) {
		return new Interval(new Event('Unconstrained Timebound'), 0, datasetLength, timeUnit);
	} else if (timeBound instanceof UpperTimeBound) {
		return new Interval(new Event('Upper Timebound'), 0, timeBound.getUpperLimit(), timeUnit);
	} else if (timeBound instanceof LowerTimeBound) {
		return new Interval(new Event('Lower Timebound'), timeBound.getLowerLimit(), datasetLength, timeUnit);
	} else {
		return timeBound;
	}
}