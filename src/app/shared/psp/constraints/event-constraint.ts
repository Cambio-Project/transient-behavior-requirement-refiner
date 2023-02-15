import { PSPConstants } from "../engine/pspconstants";
import { Event } from "../sel/event";
import { PSPConstraint } from "./pspconstraint";

export class EventConstraint extends PSPConstraint {

	private fEvent: Event;

	public static newEventConstraint(aEvent: Event): EventConstraint | null {
		let Result: EventConstraint | null = null;

		if (aEvent != null) {
			if (!aEvent.isDefault())
				Result = new EventConstraint(aEvent);
		}

		return Result;
	}

	public getEvent(): Event {
		return this.fEvent;
	}

	public setEvent(aEvent: Event): void {
		this.fEvent = aEvent;
	}

	constructor(aEvent: Event) {
		super();
		this.fEvent = aEvent;
	}

	public getConstraintCategory(): number {
		return PSPConstants.C_Event;
	}

	public getType(): number {
		return PSPConstants.C_Event;
	}

	public getSpecificationAsSEL(): string {
		let sb = '';

		sb += "without ";
		sb += this.fEvent.getAsSELEvent();

		sb += " [holding]";
		sb += " in between";

		return sb;
	}
}
