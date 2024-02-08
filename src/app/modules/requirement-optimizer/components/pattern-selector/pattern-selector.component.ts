import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pairwise } from 'rxjs';
import { Interval } from 'src/app/shared/psp/constraints/interval';
import { PSPConstants } from 'src/app/shared/psp/engine/pspconstants';
import { Event } from 'src/app/shared/psp/sel/event';
import { Absence } from 'src/app/shared/psp/sel/patterns/occurence/absence';
import { Universality } from 'src/app/shared/psp/sel/patterns/occurence/universality';
import { Response } from 'src/app/shared/psp/sel/patterns/order/response';
import { Property } from 'src/app/shared/psp/sel/property';
import { AfterQ } from 'src/app/shared/psp/sel/scopes/after-q';
import { Globally } from 'src/app/shared/psp/sel/scopes/globally';
import { Scope } from 'src/app/shared/psp/sel/scopes/scope';

@Component({
	selector: 'app-pattern-selector',
	templateUrl: './pattern-selector.component.html',
	styleUrls: ['./pattern-selector.component.scss']
})
export class PatternSelectorComponent implements OnInit {

	private _property?: Property | null;
	@Input() set property(property: Property | undefined | null) {
		if (!property) {
			this.patternSelectForm.reset();
		}
		this._property = property;
	}

	get property() {
		return this._property;
	}

	@Output() propertyChange = new EventEmitter<Property>();

	SCOPE_OPTIONS = SCOPE_OPTIONS;
	CATEGORY_OPTIONS = CATEGORY_OPTIONS;
	patterns: PatternDefinition[] = [];
	targetLogics: string[] = ['MTL'];

	patternSelectForm = new FormGroup({
		scope: new FormControl(),
		category: new FormControl(),
		pattern: new FormControl(),
	});


	constructor() { }

	ngOnInit(): void {
		this.patterns = [
			{
				name: 'response',
				seg: 'Globally, if {N/A} [has occurred] then in response {N/A} [eventually holds].',
				formula: '☐((N/A) → ◇ (N/A))',
				property: this.getResponsePSP(),
			},
			{
				name: 'absence',
				seg: 'After {N/A}, it is newer the case that {N/A} [holds].',
				formula: '☐((N/A) → ☐ ¬(N/A))',
				property: this.getAbsencePSP(),
			},
			{
				name: 'universality',
				seg: 'After {N/A}, it is always the case that {N/A} [holds].',
				formula: '☐((N/A) → ☐ (N/A))',
				property: this.getUniversalityPSP(),
			},
		];

		this.patternSelectForm.valueChanges.pipe(pairwise()).subscribe(([oldValue, newValue]) => {
			if (newValue.pattern?.property) {
				this.propertyChange.emit(newValue.pattern?.property);
			}
		});
	}

	getResponsePSP() {
		const pattern = new Response();
		pattern.setP(new Event('Event1'));
		pattern.setS(new Event('Event2'));
		pattern.setSTimeBound(new Interval(new Event('TimeConstraint'), 0, 0, 'time units'));
		const property = new Property('ResponsePSP');
		property.setPattern(pattern);
		return property;
	}

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

	getUniversalityPSP() {
		const evQ = new Event('Q');
		const ev1 = new Event('Event1');
		const pattern = new Universality(evQ);
		pattern.setP(ev1);
		const property = new Property('UniversalityPSP');
		property.setPattern(pattern);
		const scope = new AfterQ(evQ);
		property.setScope(scope);
		return property;
	}

	compareScope(s1?: Scope, s2?: Scope) {
		return s1?.getType() === s2?.getType();
	}

	compareCategory(c1?: CategoryOption, c2?: CategoryOption) {
		return c1?.type === c2?.type;
	}

}

export interface PatternDefinition {
	name: string;
	seg: string;
	formula: string;
	property: Property
}

const SCOPE_OPTIONS: Scope[] = [
	new Globally(),
	new AfterQ(new Event('Q')),
];

export interface CategoryOption {
	name: string,
	type: number,
}

const CATEGORY_OPTIONS: CategoryOption[] = [
	{
		name: 'Occurrence',
		type: PSPConstants.PC_Occurrence,
	},
	{
		name: 'Order',
		type: PSPConstants.PC_Order,
	},
];
