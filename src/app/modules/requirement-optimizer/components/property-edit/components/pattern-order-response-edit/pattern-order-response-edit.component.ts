import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dataset } from '../../../../../../shared/models/dataset';
import { Response } from '../../../../../../shared/psp/sel/patterns/order/response';
import { Property } from '../../../../../../shared/psp/sel/property';

@Component({
	selector: 'app-pattern-order-response-edit',
	templateUrl: './pattern-order-response-edit.component.html',
	styleUrls: ['./pattern-order-response-edit.component.scss']
})
export class PatternOrderResponseEditComponent implements OnInit {

	@Input() dataset: Dataset | null = null;
	@Input() property: Property | null = null;
	@Output() propertyChange = new EventEmitter<Property>();

	response?: Response;

	constructor() { }

	ngOnInit(): void {
		if (this.property?.getPattern() instanceof Response) {
			this.response = this.property?.getPattern() as Response;
		}
	}

	onPropertyChange() {
		if (this.property) {
			this.propertyChange.emit(this.property);
		}
	}

}
