import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequirementOptimizerComponent } from './requirement-optimizer.component';
import { PropertyEditComponent } from "./components/property-edit/property-edit.component";
import { PropertyEditDynamicComponent } from './components/property-edit-dynamic/property-edit-dynamic.component';
import {PropertyPlotDynamicComponent} from "./components/property-plot-dynamic/property-plot-dynamic.component";

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: RequirementOptimizerComponent,
	},
	{
		path: 'shortcut',
		component: PropertyEditComponent,
	},

	{
		path: 'dynamic',
		component: PropertyEditDynamicComponent,
	},
    {
        path: 'plot',
        component: PropertyPlotDynamicComponent,
    },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RequirementOptimizerRoutingModule { }
