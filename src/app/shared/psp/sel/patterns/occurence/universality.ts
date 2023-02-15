import { ProbabilityBound } from "../../../constraints/probability-bound";
import { TimeBound } from "../../../constraints/time-bound";
import { PSPConstants } from "../../../engine/pspconstants";
import { Event } from "../../event";
import { Occurrence } from "../occurrence";

export class Universality extends Occurrence {

	constructor(aEventP: Event, aPTimeBound: TimeBound | null = null, aProbBound: ProbabilityBound | null = null) {
		super(aEventP, aPTimeBound, aProbBound);
	}

	override getType(): number {
		return PSPConstants.P_Universality;
	}

	override getSpecificationAsSEL(): string {
		let sb = '';

		sb += "it is always the case that ";
		sb += this.getP().getAsSELEvent();
		sb += " [holds]";

		if (this.getPTimeBound() != null) {
			sb += " ";
			sb += this.getPTimeBound()!.getSpecificationAsSEL();
		}

		if (this.getProbabilityBound() != null) {
			sb += " ";
			sb += this.getProbabilityBound()!.getSpecificationAsSEL();
		}

		return sb;
	}
}
