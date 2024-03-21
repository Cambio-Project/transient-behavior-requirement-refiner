import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Predicate } from 'src/app/modules/requirement-optimizer/components/property-edit-dynamic/property-edit-dynamic.component';

// TODO add support for docker network
const DASBOARD_SCENARIO_REFINEMENT_URL = 'http://localhost:3000/api/updateScenarioPredicates';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	constructor(private http: HttpClient) { }

	updateScenarioResponse(simId: string, responseIndex: number, predicates: Predicate[]) {
		const formattedPredicates = predicates.map(predicate => {
			return {
				...predicate,
				predicate_comparison_value: '' + predicate.predicate_comparison_value,
			}
		})
		return this.http.post(DASBOARD_SCENARIO_REFINEMENT_URL,
			{
				sim_id: simId,
				response_index: responseIndex,
				predicates: formattedPredicates,
			})

	}

}
