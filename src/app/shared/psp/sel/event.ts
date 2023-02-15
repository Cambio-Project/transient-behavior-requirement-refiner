import { LogicOperator } from "../../enums/logic-operator";

export class Event {

	protected fName: string;
	private fSpecification: string;

	private static Default: Event = new Event("N/A");
	private static Constraint: Event = new Event("Constraint");

	public static readonly E_Name: number = 1;
	public static readonly E_Spec: number = 2;
	public static readonly E_NameAndSpec: number = this.E_Name | this.E_Spec;

	// can be set globally
	public static EventStringMethod: number = this.E_Name;

	private static fEventCounter: number = 1;

	public static reset(): void {
		this.fEventCounter = 1;
	}

	/* 	public static getFreshEventName(): string {
			return String.format("SF%04d", this.fEventCounter++);
		} */

	public static getDefault(): Event {
		return this.Default;
	}

	public static getConstraintDefault(): Event {
		return this.Constraint;
	}

	public isDefault(): boolean {
		return this.fName === "N/A" || this.fName === "Constraint";
	}

	public getName(): string {
		return this.fName;
	}

	public getSpecification(): string {
		return this.fSpecification;
	}

	public setSpecification(aSpecification: string): void {
		this.fSpecification = aSpecification;
	}

	constructor(aName: string, aSpecification?: string) {
		this.fName = aName;
		this.fSpecification = aSpecification || aName;
	}


	/* 	public compareTo(aOtherEvent: Event): number {
			return this.fName.compareTo(aOtherEvent.fName);
		}
	
		public int hashCode() {
			return fName.hashCode();
		}
	
		public boolean equals(Object aOtherEvent) {
			if (aOtherEvent instanceof Event) {
				return ((Event)aOtherEvent).fName.equals(fName);
			}
	
			return false;
		} */

	private getEventString(): string {
		let sb: string = '';

		if (this.isDefault()) {
			sb += this.fName;
		} else {
			switch (Event.EventStringMethod) {
				case Event.E_Name:
					sb += this.fName;
					break;
				case Event.E_Spec:
					sb += this.fSpecification;
					break;
				default:
					sb += this.fName;
					sb += "::";
					sb += this.fSpecification;
					break;
			}
		}

		return sb;
	}

	public getAsEvent(): string {
		let sb: string = '';

		sb += "(";
		sb += this.getEventString();
		sb += ")";

		return sb;
	}

	public getAsSELEvent(): string {
		let sb: string = '';

		sb += "{";
		sb += this.getEventString();
		sb += "}";

		return sb.toString();
	}

	public toString(): string {
		return this.getEventString();
	}

	/*
		CUSTOM
	*/
	fLogicOperator: LogicOperator | null = null;
	fMeasurementSource: string | null = null;
	fComparisonValue: number | null = null;

	public setName(name: string): void {
		this.fName = name;
	}

	public setLogicOperator(logicOperator: LogicOperator): void {
		this.fLogicOperator = logicOperator;
	}

	public getLogicOperator(): LogicOperator | null {
		return this.fLogicOperator;
	}

	public setMeasurementSource(measurementSource: string): void {
		this.fMeasurementSource = measurementSource;
	}

	public getMeasurementSource(): string | null {
		return this.fMeasurementSource;
	}

	public setComparisonValue(comparisonValue: number): void {
		this.fComparisonValue = comparisonValue;
	}

	public getComparisonValue(): number | null {
		return this.fComparisonValue;
	}

	get predicateInfo() {
		if (this.fName && !!this.fLogicOperator && this.fComparisonValue !== null) {
			return {
				predicate_name: this.fName,
				predicate_logic: this.fLogicOperator,
				predicate_comparison_value: this.fComparisonValue.toString(),
			}
		}
		return null;
	}

	get predicateSpecification() {
		if (this.fName && !!this.fLogicOperator && this.fComparisonValue !== null) {
			return `${this.fName}(${this.fMeasurementSource})`;
		}
		return null;
	}

}
