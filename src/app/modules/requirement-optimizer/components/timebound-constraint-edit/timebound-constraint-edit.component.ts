import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Interval } from '../../../../shared/psp/constraints/interval';
import { LowerTimeBound } from '../../../../shared/psp/constraints/lower-time-bound';
import { UpperTimeBound } from '../../../../shared/psp/constraints/upper-time-bound';
import { Event } from '../../../../shared/psp/sel/event';
import { Property } from '../../../../shared/psp/sel/property';
import { TimeBound } from '../../../../shared/psp/constraints/time-bound';
import { Response } from '../../../../shared/psp/sel/patterns/order/response';
import { debounceTime } from 'rxjs';
import { Dataset } from '../../../../shared/models/dataset';
import { PSPConstants } from '../../../../shared/psp/engine/pspconstants';
import { TimeboundConstraintRefinementComponent } from '../timebound-constraint-refinement/timebound-constraint-refinement.component';
import { MatDialog } from '@angular/material/dialog';
import { Absence } from 'src/app/shared/psp/sel/patterns/occurence/absence';
import { Universality } from 'src/app/shared/psp/sel/patterns/occurence/universality';

@Component({
	selector: 'app-timebound-constraint-edit',
	templateUrl: './timebound-constraint-edit.component.html',
	styleUrls: ['./timebound-constraint-edit.component.scss']
})
export class TimeboundConstraintEditComponent implements OnInit {

	@Input() dataset: Dataset | null = null;
	@Input() property: Property | null = null;
	@Input() timebound: TimeBound | null = null;
	@Output() timeboundChange = new EventEmitter<TimeBound | null>();

	timeboundSEL: string = 'no timebound constraint';
	editFormExpaneded: boolean = false;
	private selectedType = '';
	PSPConstants = PSPConstants;

	timeboundForm: FormGroup = new FormGroup({
		type: new FormControl(),
		start: new FormControl(),
		end: new FormControl(),
		timeUnit: new FormControl(),
	});

	constructor(private dialog: MatDialog) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.timeboundForm.valueChanges
			.pipe(debounceTime(400))
			.subscribe(form => {
				if (this.selectedType !== form.type) {
					this.selectedType = form.type;
					this.timeboundForm.patchValue({ start: null, end: null });
					this.timebound = null;
				}
				if (form.timeUnit !== null && (form.timeUnit as string).trim() === '') {
					this.timeboundForm.patchValue({ timeUnit: null });
				}

				let timeUnit = form.timeUnit;
				if (timeUnit !== null && timeUnit.trim() === '') {
					timeUnit = 'time units';
				}

				const datasetLength = this.dataset?.data.length || 0;

				let performUpdate = false;
				switch (form.type) {
					case 'unconstrained': {
						//this.timebound = null;
						this.timeboundSEL = 'no timebound constraint';
						this.timebound = new Interval(new Event('Unconstrained Timebound'), 0, datasetLength, timeUnit);
						performUpdate = true;
						break;
					}
					case 'within': {
						if (form.end !== null) {
							//this.timebound = new UpperTimeBound(new Event('Upper Timebound'), form.end, timeUnit);
							const timeboundDef = new UpperTimeBound(new Event('Upper Timebound'), form.end, timeUnit);
							this.timeboundSEL = timeboundDef.getSpecificationAsSEL();
							this.timebound = new Interval(new Event('Upper Timebound'), 0, form.end, timeUnit);
							performUpdate = true;
						}
						break;
					}
					case 'after': {
						if (form.start !== null) {
							//this.timebound = new LowerTimeBound(new Event('Lower Timebound'), form.start, timeUnit);
							const timeboundDef = new LowerTimeBound(new Event('Lower Timebound'), form.start, timeUnit);;
							this.timeboundSEL = timeboundDef.getSpecificationAsSEL();
							this.timebound = new Interval(new Event('Lower Timebound'), form.start, datasetLength, timeUnit);
							performUpdate = true;
						}
						break;
					}
					case 'between': {
						if (form.start !== null && form.end !== null) {
							this.timebound = new Interval(new Event('Interval Timebound'), form.start, form.end, timeUnit);
							this.timeboundSEL = this.timebound.getSpecificationAsSEL();
							performUpdate = true;
						}
						break;
					}
				}

				const pattern = this.property?.getPattern();
				if (pattern instanceof Response) {
					pattern.setSTimeBound(this.timebound);
				}
				/*} else if (pattern instanceof Universality) {
					pattern.setPTimeBound(this.timebound);
				}
				else if (pattern instanceof Absence) {
					pattern.setPTimeBound(this.timebound);
				} */

				if (performUpdate) {
					this.timeboundChange.emit(this.timebound);
				}
			});
		this.timeboundForm.controls['type'].setValue('unconstrained');
	}

	async onClickRefinement() {
		const dialogRef = this.dialog.open(TimeboundConstraintRefinementComponent, {
			data: {
				dataset: this.dataset,
				property: this.property,
			}
		});

		dialogRef.afterClosed().subscribe((timebound: Interval | null) => {
			if (!timebound) {
				return;
			}
			console.log(`Dialog result: ${timebound?.getSpecificationAsSEL()}`);
			this.timeboundForm.patchValue({
				type: 'between',
			});
			console.log(timebound?.getLowerLimit())
			console.log(timebound?.getUpperLimit())

			this.timeboundForm.patchValue({
				start: timebound?.getLowerLimit(),
				end: timebound?.getUpperLimit(),
				timeUnit: 'time units',
			});

			console.log(this.timeboundForm.value)

		});

	}
}
