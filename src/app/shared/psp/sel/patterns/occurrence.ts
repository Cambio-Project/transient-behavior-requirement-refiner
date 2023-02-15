import { ProbabilityBound } from "../../constraints/probability-bound";
import { TimeBound } from "../../constraints/time-bound";
import { PSPConstants } from "../../engine/pspconstants";
import { Event } from "../event";
import { Pattern } from "./pattern";

export class Occurrence extends Pattern {

	fP: Event;
	fPTimeBound: TimeBound | null;
	fProbBound: ProbabilityBound | null;

	getP(): Event {
		return this.fP;
	}

	setP(aP: Event) {
		this.fP = aP;
	}

	getPTimeBound(): TimeBound | null {
		return this.fPTimeBound;
	}

	setPTimeBound(aPTimeBound: TimeBound | null) {
		this.fPTimeBound = aPTimeBound;
	}

	getProbabilityBound(): ProbabilityBound | null {
		return this.fProbBound;
	}

	setProbabilityBound(aProbBound: ProbabilityBound) {
		this.fProbBound = aProbBound;
	}

	constructor(aP: Event, aPTimeBound: TimeBound | null, aProbBound: ProbabilityBound | null) {
		super();
		this.fP = aP;
		this.fPTimeBound = aPTimeBound;
		this.fProbBound = aProbBound;
	}

	getPatternCategory(): number {
		return PSPConstants.PC_Occurrence;
	}

	getEvents(): Event[] {
		const Result: Event[] = [];

		Result.push(this.getP());

		return Result;
	}

	public getType(): number {
		throw new Error("Method not implemented.");
	}
	public getSpecificationAsSEL(): string {
		throw new Error("Method not implemented.");
	}

}
