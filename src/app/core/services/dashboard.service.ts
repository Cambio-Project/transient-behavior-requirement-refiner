import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Predicate } from 'src/app/modules/requirement-optimizer/components/property-edit-dynamic/property-edit-dynamic.component';

// TODO change URL to dashboard endpoint
const DASBOARD_SCENARIO_REFINEMENT_URL = 'http://localhost:4200/requirement-refinement/home';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	constructor(private http: HttpClient) { }

	updateScenarioResponse(scenarioId: string, responseIndex: number, predicates: Predicate[]) {
		console.log(JSON.stringify(predicates))
		return this.http.get(DASBOARD_SCENARIO_REFINEMENT_URL, {
			params: {
				scenario_id: scenarioId,
				response_index: responseIndex,
				predicates: JSON.stringify(predicates),
			}
		})
	}

}
