import { PSPConstants } from "../engine/pspconstants";
import { Event } from "../sel/event";
import { TimeBound } from "./time-bound";

export class UpperTimeBound extends TimeBound {

	private fUpperLimit: number;

	public getUpperLimit(): number {
		return this.fUpperLimit;
	}

	constructor(aTimedEvent: Event, aUpperLimit: number, aTimeUnit: string) {
		super(aTimedEvent, aTimeUnit);
		this.fUpperLimit = aUpperLimit;
	}

	public override getType(): number {
		return PSPConstants.CT_Upper;
	}

	public override getSpecificationAsSEL(): string {
		let sb = '';

		sb += "within ";
		if (this.fUpperLimit == Number.MAX_VALUE) {
			sb += "∞";
		} else {
			sb += this.fUpperLimit;
		}
		sb += " ";
		sb += this.getTimeUnit();

		return sb;
	}

}
