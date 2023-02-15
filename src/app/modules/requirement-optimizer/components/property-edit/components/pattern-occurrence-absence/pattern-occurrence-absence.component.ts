import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dataset } from 'src/app/shared/models/dataset';
import { Absence } from 'src/app/shared/psp/sel/patterns/occurence/absence';
import { Property } from 'src/app/shared/psp/sel/property';

@Component({
	selector: 'app-pattern-occurrence-absence',
	templateUrl: './pattern-occurrence-absence.component.html',
	styleUrls: ['./pattern-occurrence-absence.component.scss']
})
export class PatternOccurrenceAbsenceComponent implements OnInit {

	@Input() dataset: Dataset | null = null;
	@Input() property: Property | null = null;
	@Output() propertyChange = new EventEmitter<Property>();

	absence?: Absence;

	constructor() { }

	ngOnInit(): void {
		if (this.property?.getPattern() instanceof Absence) {
			this.absence = this.property?.getPattern() as Absence;
		}
	}

	onPropertyChange() {
		if (this.property) {
			this.propertyChange.emit(this.property);
		}
	}

}
