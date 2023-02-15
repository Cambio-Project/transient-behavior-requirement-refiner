import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'requirement-refinement',
		pathMatch: 'full'
	},
	{
		path: 'requirement-refinement',
		loadChildren: () => import('./modules/requirement-optimizer/requirement-optimizer.module').then(m => m.RequirementOptimizerModule)
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
