import { Pipe, PipeTransform } from '@angular/core';
import { CategoryOption, PatternDefinition } from 'src/app/modules/requirement-optimizer/components/pattern-selector/pattern-selector.component';
import { Scope } from '../psp/sel/scopes/scope';

@Pipe({
	name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

	transform(categoryOptions: CategoryOption[], patterns: PatternDefinition[], scope?: Scope | null): CategoryOption[] {
		const filteredPatterns = patterns.filter(pattern => pattern.property.getScope().getType() === scope?.getType());
		return categoryOptions.filter(categoryOption => filteredPatterns.find(pattern => pattern.property.getPattern()?.getPatternCategory() === categoryOption.type));
	}

}
