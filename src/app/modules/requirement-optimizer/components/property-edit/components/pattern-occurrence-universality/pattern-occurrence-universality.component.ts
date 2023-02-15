import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dataset } from 'src/app/shared/models/dataset';
import { Universality } from 'src/app/shared/psp/sel/patterns/occurence/universality';
import { Property } from 'src/app/shared/psp/sel/property';

@Component({
	selector: 'app-pattern-occurrence-universality',
	templateUrl: './pattern-occurrence-universality.component.html',
	styleUrls: ['./pattern-occurrence-universality.component.scss']
})
export class PatternOccurrenceUniversalityComponent implements OnInit {

	@Input() dataset: Dataset | null = null;
	@Input() property: Property | null = null;
	@Output() propertyChange = new EventEmitter<Property>();

	universality?: Universality;

	constructor() { }

	ngOnInit(): void {
		if (this.property?.getPattern() instanceof Universality) {
			this.universality = this.property?.getPattern() as Universality;
		}
	}

	onPropertyChange() {
		if (this.property) {
			this.propertyChange.emit(this.property);
		}
	}

}
