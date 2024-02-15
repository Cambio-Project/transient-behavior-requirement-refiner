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
export class RequirementOptimizerComponent implements OnInit, AfterViewInit{

    @ViewChild("stepper") stepper: MatStepper | undefined;

	dataset: Dataset | null = null;
	property: Property | null = null;

	constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, private dataSvc: DataService) {
        this.router = router;
    }

    async ngAfterViewInit(): Promise<void> {
        if (this.router.url.includes("shortcut")) {
            await this.skipToSpecification();
        }
    }

	ngOnInit(): void { }

	onDatasetChange(dataset: Dataset) {
		this.dataset = dataset;
		this.property = null;
	}

	onPropertyChange(property: Property) {
		this.property = property;
	}

    async skipToSpecification() {
        this.dataset = await this.dataSvc.parseCsvFileFromAssets("chaos-exp-1-trace.csv") //TODO Change with request content
        this.property = this.getAbsencePSP()
        this.changeDetectorRef.detectChanges()
        this.stepper!!.next()
        this.stepper!!.next()
    }

    //TODO Remove this, just for temp
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
}
