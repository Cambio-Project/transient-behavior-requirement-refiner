import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementOptimizerRoutingModule } from './requirement-optimizer-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PatternSelectorComponent } from './components/pattern-selector/pattern-selector.component';
import { PredicateEditComponent } from './components/predicate-edit/predicate-edit.component';
import { PropertyEditComponent } from './components/property-edit/property-edit.component';
import { PatternOrderResponseEditComponent } from './components/property-edit/components/pattern-order-response-edit/pattern-order-response-edit.component';
import { TimeboundConstraintEditComponent } from './components/timebound-constraint-edit/timebound-constraint-edit.component';
import { PropertyValidatorComponent } from './components/property-validator/property-validator.component';
import { TimeboundConstraintRefinementComponent } from './components/timebound-constraint-refinement/timebound-constraint-refinement.component';

import { RequirementOptimizerComponent } from './requirement-optimizer.component';
import { PredicateRefinementComponent } from './components/predicate-refinement/predicate-refinement.component';
import { PatternOccurrenceAbsenceComponent } from './components/property-edit/components/pattern-occurrence-absence/pattern-occurrence-absence.component';
import { PatternOccurrenceUniversalityComponent } from './components/property-edit/components/pattern-occurrence-universality/pattern-occurrence-universality.component';
import { PropertyEditDynamicComponent } from './components/property-edit-dynamic/property-edit-dynamic.component';
import { PredicateEditDynamicComponent } from './components/predicate-edit-dynamic/predicate-edit-dynamic.component';
import { PredicateRefinementDynamicComponent } from './components/predicate-refinement-dynamic/predicate-refinement-dynamic.component';
import {PropertyPlotDynamicComponent} from "./components/property-plot-dynamic/property-plot-dynamic.component";


@NgModule({
	declarations: [
		PatternSelectorComponent,
		PredicateEditComponent,
		PropertyEditComponent,
		PatternOrderResponseEditComponent,
		TimeboundConstraintEditComponent,
		PropertyValidatorComponent,
		TimeboundConstraintRefinementComponent,
		RequirementOptimizerComponent,
		PredicateRefinementComponent,
		PatternOccurrenceAbsenceComponent,
		PatternOccurrenceUniversalityComponent,
		PropertyEditDynamicComponent,
		PredicateEditDynamicComponent,
		PredicateRefinementDynamicComponent,
        PropertyPlotDynamicComponent,
	],
	imports: [
		CommonModule,
		RequirementOptimizerRoutingModule,

		// Shared
		SharedModule,
	]
})
export class RequirementOptimizerModule { }
