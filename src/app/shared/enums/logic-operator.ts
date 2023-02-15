export enum LogicOperator {
	EQUAL = 'equal',
	SMALLER_EQUAL = 'smallerEqual',
	SMALLER = 'smaller',
	BIGGER_EQUAL = 'biggerEqual',
	BIGGER = 'bigger',
	//BIGGER_EQUAL = 'greaterEquals',
	//BIGGER = 'greater',
}

export const LOGIC_OPERATOR_OPTIONS = Object.values(LogicOperator);