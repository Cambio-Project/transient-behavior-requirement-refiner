import { ProbabilityBound } from "../../../constraints/probability-bound";
import { TimeBound } from "../../../constraints/time-bound";
import { PSPConstants } from "../../../engine/pspconstants";
import { Event } from "../../event";
import { Occurrence } from "../occurrence";

export class Absence extends Occurrence {

	constructor(aEventP: Event = Event.getDefault(), aTimeBound: TimeBound | null = null, aProbBound: ProbabilityBound | null = null) {
		super(aEventP, aTimeBound, aProbBound);
	}

	override getType(): number {
		return PSPConstants.P_Absence;
	}

	override getSpecificationAsSEL(): string {
		let sb = '';

		sb += "it is never the case that ";
		sb += this.getP().getAsSELEvent();
		sb += " [holds]";

		if (this.getPTimeBound() != null) {
			sb += " ";
			sb += this.getPTimeBound()?.getSpecificationAsSEL();
		}

		if (this.getProbabilityBound() != null) {
			sb += " ";
			sb += this.getProbabilityBound()?.getSpecificationAsSEL();
		}

		return sb.toString();
	}
}
