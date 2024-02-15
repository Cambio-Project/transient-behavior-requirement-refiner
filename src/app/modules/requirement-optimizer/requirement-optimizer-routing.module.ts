import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequirementOptimizerComponent } from './requirement-optimizer.component';

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
        component: RequirementOptimizerComponent,
    },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RequirementOptimizerRoutingModule { }
