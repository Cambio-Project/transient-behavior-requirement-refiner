import { PSPConstants } from "../engine/pspconstants";
import { Event } from "../sel/event";
import { PSPConstraint } from "./pspconstraint";

export class TimeBound extends PSPConstraint {


	private fTimedEvent: Event;
	private fTimeUnit: string;

	public getTimedEvent(): Event {
		return this.fTimedEvent;
	}

	public getTimeUnit(): string {
		return this.fTimeUnit;
	}

	public setTimeUnit(aTimeUnit: string): void {
		this.fTimeUnit = aTimeUnit;
	}

	/* 	constructor(aTimedEvent: Event) {
			this(aTimedEvent, null);
		} */

	constructor(aTimedEvent: Event, aTimeUnit?: string | null) {
		super();

		this.fTimedEvent = aTimedEvent;
		if (aTimeUnit == null) {
			this.fTimeUnit = "time units";
		} else {
			this.fTimeUnit = aTimeUnit;
		}
	}

	public getConstraintCategory(): number {
		return PSPConstants.C_Time;
	}

	/*
		TODO
	*/
	public getType(): number {
		throw new Error("Method not implemented.");
	}

	/*
		TODO
	*/
	public getSpecificationAsSEL(): string {
		throw new Error("Method not implemented.");
	}

}
