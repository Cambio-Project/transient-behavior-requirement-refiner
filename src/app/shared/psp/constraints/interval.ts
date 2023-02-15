import { PSPConstants } from "../engine/pspconstants";
import { Event } from "../sel/event";
import { TimeBound } from "./time-bound";

export class Interval extends TimeBound {

	private fUpperLimit: number;
	private fLowerLimit: number;

	public getUpperLimit(): number {
		return this.fUpperLimit;
	}

	public getLowerLimit(): number {
		return this.fLowerLimit;
	}

	constructor(aTimedEvent: Event, aLowerLimit: number, aUpperLimit: number, aTimeUnit: string) {
		super(aTimedEvent, aTimeUnit);
		this.fLowerLimit = aLowerLimit;
		this.fUpperLimit = aUpperLimit;
	}

	public override getType(): number {
		return PSPConstants.CT_Interval;
	}

	public override getSpecificationAsSEL(): string {
		let sb = '';

		sb += "between ";
		sb += this.fLowerLimit;
		sb += " and ";
		if (this.fUpperLimit == Number.MAX_VALUE) {
			sb += "∞";
		} else {
			sb += this.fUpperLimit;
		}
		sb += " ";
		sb += this.getTimeUnit();

		return sb.toString();
	}

}
