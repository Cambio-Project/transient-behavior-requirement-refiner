import { Event } from "../event";

export abstract class Scope {

	private fQ: Event;
	private fR: Event;

	public getQ(): Event {
		return this.fQ;
	}

	public setQ(aQ: Event) {
		this.fQ = aQ == null ? Event.getDefault() : aQ;
	}

	public getR(): Event {
		return this.fR;
	}

	public setR(aR: Event): void {
		this.fR = aR == null ? Event.getDefault() : aR;
	}

	constructor(aQ: Event | null, aR: Event | null) {
		//this.setQ(aQ);
		//this.setR(aR);
		this.fQ = aQ == null ? Event.getDefault() : aQ;
		this.fR = aR == null ? Event.getDefault() : aR;
	}

	public abstract getSpecificationAsSEL(): string;

	private static fNames: string[] = [
		"",
		"Globally",
		"Before R",
		"After Q",
		"Between Q and R",
		"After Q until R"
	];

	public toString(): string {
		return Scope.fNames[this.getType()];
	}

	public abstract getType(): number;

}
