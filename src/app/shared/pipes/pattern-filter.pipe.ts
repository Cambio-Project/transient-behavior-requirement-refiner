import { Pipe, PipeTransform } from '@angular/core';
import { CategoryOption, PatternDefinition } from 'src/app/modules/requirement-optimizer/components/pattern-selector/pattern-selector.component';
import { Scope } from '../psp/sel/scopes/scope';

@Pipe({
	name: 'patternFilter'
})
export class PatternFilterPipe implements PipeTransform {

	transform(patterns: PatternDefinition[], scope?: Scope | null, category?: CategoryOption | null): PatternDefinition[] {
		return patterns.filter(pattern => pattern.property.getScope().getType() === scope?.getType() && category?.type === pattern.property.getPattern()?.getPatternCategory());
	}

}
