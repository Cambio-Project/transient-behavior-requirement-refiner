import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LogicOperator, LOGIC_OPERATOR_OPTIONS, requiresComparisonValue} from '../../../../shared/enums/logic-operator';
import {ValidationResponse} from '../../../../shared/models/validation-response';
import {Event} from '../../../../shared/psp/sel/event';
import {Dataset} from '../../../../shared/models/dataset';
import {debounceTime, firstValueFrom} from 'rxjs';
import {ValidationService} from 'src/app/core/services/validation.service';
import {PropertyService} from 'src/app/core/services/property.service';
import {MatDialog} from '@angular/material/dialog';
import {PredicateRefinementComponent} from '../predicate-refinement/predicate-refinement.component';
import {DataService} from 'src/app/core/services/data.service';

@Component({
  selector: 'app-predicate-edit',
  templateUrl: './predicate-edit.component.html',
  styleUrls: ['./predicate-edit.component.scss']
})
export class PredicateEditComponent implements OnInit {

  @Input() dataset?: Dataset | null;
  @Input() event!: Event;
  @Output() eventChange = new EventEmitter<Event>();

  validationResponse?: ValidationResponse;
  editFormExpaneded: boolean = false;

  comparisonValue: FormControl = new FormControl(null, [Validators.required])
  logicOperator: FormControl = new FormControl(null, [Validators.required])

  predicateForm: FormGroup = new FormGroup({
    fName: new FormControl(null, [Validators.required]),
    fMeasurementSource: new FormControl(null, [Validators.required]),
    fLogicOperator: this.logicOperator,
    fComparisonValue: this.comparisonValue,
  });

  LOGIC_OPERATOR_OPTIONS = LOGIC_OPERATOR_OPTIONS;

  constructor(
    private dialog: MatDialog,
    private validationSvc: ValidationService,
    private propertySvc: PropertyService,
    private dataSvc: DataService,
  ) {
  }

  ngOnInit(): void {
    if (!this.event.isDefault()) {
      this.predicateForm.patchValue(this.event);
      this.validatePredicate();
    }

    this.logicOperator.valueChanges
      .pipe(debounceTime(400))
      .subscribe(res => {
        this.controlComparisonValueField()
      });

    this.predicateForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(res => {
        //this.event.setName(this.predicateForm.value.fName);
        this.event.setName(this.dataSvc.generateUUID());
        this.event.setLogicOperator(this.predicateForm.value.fLogicOperator);
        this.event.setComparisonValue(this.predicateForm.value.fComparisonValue);
        this.event.setMeasurementSource(this.predicateForm.value.fMeasurementSource);
        this.validatePredicate();
      });
  }

  controlComparisonValueField() {
    if (requiresComparisonValue(this.logicOperator.value)) {
      this.comparisonValue.enable()
    } else {
      this.comparisonValue.setValue(null)
      this.comparisonValue.disable()
    }
  }

  validatePredicate() {
    if (this.dataset && this.predicateForm.valid) {
      this.validationSvc.validatePredicate(this.dataset, this.event).then(validationResponse => this.validationResponse = validationResponse);
      this.eventChange.emit(this.event);
    }
  }

  async onClickRefinement() {
    const property = await firstValueFrom(this.propertySvc.property$)
    const dialogRef = this.dialog.open(PredicateRefinementComponent, {
      data: {
        dataset: this.dataset,
        predicateName: this.predicateForm.value.fName,
        property: property,
      }
    });

    dialogRef.afterClosed().subscribe((index: number | null) => {
      if (!Number.isNaN(index)) {
        console.log(index);
        this.predicateForm.patchValue({fComparisonValue: index, fLogicOperator: LogicOperator.EQUAL});
      }
      /* 	if (!timebound) {
          return;
        }
        console.log(`Dialog result: ${timebound?.getSpecificationAsSEL()}`);
        this.timeboundForm.patchValue({
          type: 'between',
        });
        this.timeboundForm.patchValue({
          start: timebound?.getLowerLimit(),
          end: timebound?.getUpperLimit(),
          timeUnit: 'time units',
        }); */
    });
  }

}
