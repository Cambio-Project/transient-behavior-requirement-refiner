import { EventConstraint } from "../../../constraints/event-constraint";
import { ProbabilityBound } from "../../../constraints/probability-bound";
import { TimeBound } from "../../../constraints/time-bound";
import { PSPConstants } from "../../../engine/pspconstants";
import { Event } from "../../event";
import { Order } from "../order";

export class Response extends Order {

	private fSTimeBound: TimeBound | null;
	private fSConstraint: EventConstraint | null;

	public getSTimeBound(): TimeBound | null {
		return this.fSTimeBound;
	}

	public setSTimeBound(aSTimeBound: TimeBound | null): void {
		this.fSTimeBound = aSTimeBound;
	}

	public getSConstraint(): EventConstraint | null {
		return this.fSConstraint;
	}

	public setSConstraint(aSConstraint: EventConstraint): void {
		this.fSConstraint = aSConstraint;
	}

	/*
	constructor() {
		this(Event.getDefault(), Event.getDefault(), null, null, null);
	}
	*/

	constructor(aP: Event = Event.getDefault(), aS: Event = Event.getDefault(), aSTimeBound: TimeBound | null = null, aSConstraint: Event | null = null, aProbBound: ProbabilityBound | null = null) {
		super(aP, aS, null, aProbBound);

		this.fSTimeBound = aSTimeBound;

		if (aSConstraint != null) {
			this.fSConstraint = new EventConstraint(aSConstraint);
		} else {
			this.fSConstraint = null;
		}
	}

	public getType(): number {
		return PSPConstants.P_Response;
	}

	public override getEvents(): Event[] {
		const Result: Event[] = super.getEvents();

		if (this.fSConstraint != null) {
			if (!Result.some(val => val.getName() === this.fSConstraint?.getEvent().getName()))
				Result.push(this.fSConstraint.getEvent());
		}

		return Result;
	}

	public getSpecificationAsSEL(): string {
		let sb = '';

		sb += "if ";
		sb += this.getP().getAsSELEvent();
		sb += " [has occurred]";

		sb += " then in response ";
		sb += this.getS().getAsSELEvent();
		sb += " [eventually holds]";

		if (this.fSTimeBound != null) {
			sb += " ";
			sb += this.fSTimeBound.getSpecificationAsSEL();
		}

		if (this.fSConstraint != null) {
			sb += " ";
			sb += this.fSConstraint.getSpecificationAsSEL();
		}

		if (this.getProbabilityBound() != null) {
			sb += " ";
			sb += this.getProbabilityBound()?.getSpecificationAsSEL();
		}

		return sb;
	}

}
