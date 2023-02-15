import { TimeBound } from "../../../constraints/time-bound";
import { EventConstraint } from "../../../constraints/event-constraint";
import { Event } from "../../event";

export class ChainEvent {

	public static readonly PrecedenceChain: number = 1;
	public static readonly ResponseChain: number = 2;

	private fEvent: Event;
	private fConstraint: EventConstraint | null;
	private fTimeBound: TimeBound | null;

	public getEvent(): Event {
		return this.fEvent;
	}

	public setEvent(aEvent: Event): void {
		this.fEvent = aEvent;
	}

	public getConstraint(): EventConstraint | null {
		return this.fConstraint;
	}

	public setConstraint(aConstraintEvent: Event): void {
		this.fConstraint = null;

		if (aConstraintEvent != null) {
			if (!aConstraintEvent.isDefault())
				this.fConstraint = new EventConstraint(aConstraintEvent);
		}
	}

	/* TODO
	public ArrayList<Event> getEvents()
		{
				ArrayList<Event> Result = new ArrayList<Event>();
			  
				if ( fEvent != null )
						Result.add( fEvent );

				if ( fConstraint != null )
				{
						if ( !Result.contains( fConstraint.getEvent() ) )
							 Result.add( fConstraint.getEvent() );
				}

				return Result;   
		}
		*/

	public getEvents(): Event[] {
		const Result: Event[] = [];

		if (this.fEvent != null)
			Result.push(this.fEvent);

		if (this.fConstraint != null) {
			if (!Result.some((val => val.getName() === this.fConstraint?.getEvent().getName()))) {
				Result.push(this.fConstraint.getEvent());
			}
		}

		return Result;
	}

	public getTimeBound(): TimeBound | null {
		return this.fTimeBound;
	}

	public setTimeBound(aTimeBound: TimeBound): void {
		this.fTimeBound = aTimeBound;
	}



	constructor(aEvent?: Event, aConstraintEvent: Event | null = null, aTimeBound: TimeBound | null = null) {
		/* this.setEvent(aEvent);
		this.setConstraint(aConstraintEvent);
		this.setTimeBound(aTimeBound); */

		this.fEvent = aEvent || Event.getDefault();

		this.fConstraint = null;
		if (aConstraintEvent != null) {
			if (!aConstraintEvent.isDefault())
				this.fConstraint = new EventConstraint(aConstraintEvent);
		}

		this.fTimeBound = aTimeBound;
	}

	public getSpecificationAsSEL(): string {
		let sb: string = '';

		sb += this.fEvent.getAsSELEvent();

		if (this.fTimeBound != null) {
			sb += " ";
			sb += this.fTimeBound.getSpecificationAsSEL();
		}

		if (this.fConstraint != null) {
			sb += " ";
			sb += this.fConstraint.getSpecificationAsSEL();
		}

		return sb;
	}

}
