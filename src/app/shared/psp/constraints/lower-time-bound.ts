import { PSPConstants } from "../engine/pspconstants";
import { Event } from "../sel/event";
import { TimeBound } from "./time-bound";

export class LowerTimeBound extends TimeBound {

	private fLowerLimit: number;

	public getLowerLimit(): number {
		return this.fLowerLimit;
	}

	constructor(aTimedEvent: Event, aLowerLimit: number, aTimeUnit: string) {
		super(aTimedEvent, aTimeUnit);
		this.fLowerLimit = aLowerLimit;
	}

	public override getType(): number {
		return PSPConstants.CT_Lower;
	}

	public override getSpecificationAsSEL(): string {
		let sb = '';

		sb += "after ";
		sb += this.fLowerLimit;
		sb += " ";
		sb += this.getTimeUnit();

		return sb.toString();
	}

}
