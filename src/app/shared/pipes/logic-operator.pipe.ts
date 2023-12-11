import { Pipe, PipeTransform } from '@angular/core';
import { LogicOperator } from '../enums/logic-operator';

@Pipe({
	name: 'logicOperator'
})
export class LogicOperatorPipe implements PipeTransform {

	transform(logicOperator: LogicOperator, ...args: unknown[]): string {
		switch (logicOperator) {
			case LogicOperator.BIGGER:
				return 'greater than (>)';
			case LogicOperator.BIGGER_EQUAL:
				return 'greater than or equal to (>=)';
			case LogicOperator.SMALLER:
				return 'less (<)';
			case LogicOperator.SMALLER_EQUAL:
				return 'less than or equal to (<=)';
			case LogicOperator.DOWN:
				return 'trend downward';
			case LogicOperator.DOWN_STRICT:
				return 'trend downward strict';
			case LogicOperator.EQUAL:
				return 'equal to (=)';
			case LogicOperator.UP:
				return 'trend upward';
			case LogicOperator.UP_STRICT:
				return 'trend upward strict';
			default:
				return 'unknown operator';
		}
	}

}
