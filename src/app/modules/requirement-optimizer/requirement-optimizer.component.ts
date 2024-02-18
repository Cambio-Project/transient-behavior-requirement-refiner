import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { Dataset } from 'src/app/shared/models/dataset';
import { Property } from 'src/app/shared/psp/sel/property';
import {MatStepper} from "@angular/material/stepper";
import {Router} from "@angular/router";
import { DataService } from '../../core/services/data.service';
import {Event} from "../../shared/psp/sel/event";
import {Absence} from "../../shared/psp/sel/patterns/occurence/absence";
import {AfterQ} from "../../shared/psp/sel/scopes/after-q";

@Component({
	selector: 'app-requirement-optimizer',
	templateUrl: './requirement-optimizer.component.html',
	styleUrls: ['./requirement-optimizer.component.scss']
})
export class RequirementOptimizerComponent implements OnInit{

    @ViewChild("stepper") stepper: MatStepper | undefined;

	dataset: Dataset | null = null;
	property: Property | null = null;

	constructor() {

    }

	ngOnInit(): void { }

	onDatasetChange(dataset: Dataset) {
		this.dataset = dataset;
		this.property = null;
	}

	onPropertyChange(property: Property) {
		this.property = property;
	}
}
