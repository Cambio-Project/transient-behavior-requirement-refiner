import { Pipe, PipeTransform } from '@angular/core';
import { LogicOperator } from '../enums/logic-operator';

@Pipe({
	name: 'logicOperator'
})
export class LogicOperatorPipe implements PipeTransform {

	transform(logicOperator: LogicOperator, ...args: unknown[]): string {
		switch (logicOperator) {
			case LogicOperator.BIGGER:
				return 'greater';
			case LogicOperator.BIGGER_EQUAL:
				return 'greaterEqual';
			case LogicOperator.SMALLER:
				return 'less';
			case LogicOperator.SMALLER_EQUAL:
				return 'lessEqual';
			default:
				return logicOperator;
		}
	}

}
