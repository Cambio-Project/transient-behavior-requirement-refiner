import { Event } from '../event';

export abstract class Pattern {

	public abstract getPatternCategory(): number;

	public abstract getType(): number;

	public abstract getEvents(): Event[];

	public abstract getSpecificationAsSEL(): string;

	//    public abstract ArrayList<Event> getEvents();

	private static fNames: string[] = [
		"",
		// Occurrence
		"Universality",
		"Absence",
		"Existence",
		"BoundedExistence",
		"TransientState",
		"SteadyState",
		"MinimumDuration",
		"MaximumDuration",
		"Recurrence",
		// Order
		"Precedence",
		"PrecedenceChain1N",
		"PrecedenceChainN1",
		"Until",
		"Response",
		"ResponseChain1N",
		"ResponseChainN1",
		"ResponseInvariance"
	];

	public toString(): string {
		return Pattern.fNames[this.getType()];
	}

}
