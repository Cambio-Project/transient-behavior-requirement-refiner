import { Component, OnInit } from '@angular/core';
import { Dataset } from 'src/app/shared/models/dataset';
import { Property } from 'src/app/shared/psp/sel/property';

@Component({
	selector: 'app-requirement-optimizer',
	templateUrl: './requirement-optimizer.component.html',
	styleUrls: ['./requirement-optimizer.component.scss']
})
export class RequirementOptimizerComponent implements OnInit {

	dataset: Dataset | null = null;
	property: Property | null = null;

	constructor() { }

	ngOnInit(): void { }

	onDatasetChange(dataset: Dataset) {
		this.dataset = dataset;
	}

	onPropertyChange(property: Property) {
		this.property = property;
	}
}
