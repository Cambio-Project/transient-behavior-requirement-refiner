import { Event } from "./event";
import { Absence } from "./patterns/occurence/absence";
import { Pattern } from "./patterns/pattern";
import { AfterQ } from "./scopes/after-q";
import { Globally } from "./scopes/globally";
import { Scope } from "./scopes/scope";

export class Property {

	private fDescriptor: string;
	private fScope: Scope;
	private fPattern: Pattern | null;
	private fEvents: Event[];

	public getDescriptor(): string {
		return this.fDescriptor;
	}

	public getScope(): Scope {
		return this.fScope;
	}

	public setScope(aScope: Scope): void {
		this.fScope = aScope;
	}

	public getPattern(): Pattern | null {
		return this.fPattern;
	}

	public setPattern(aPattern: Pattern): void {
		this.fPattern = aPattern;

		// TBA: update event usages

	}

	public getEvents(): Event[] {
		return this.fEvents;
	}

	constructor(aDescriptor: string) {
		this.fDescriptor = aDescriptor;
		this.fScope = new Globally();
		this.fPattern = null;
		this.fEvents = [];
	}

	public getSpecification(): string {
		let sb: string = '';

		sb += this.fScope.getSpecificationAsSEL();
		sb += ", ";
		if (this.fPattern != null) {
			sb += this.fPattern.getSpecificationAsSEL();
			sb += ".";
		}
		return sb;
	}

	/* public  compareTo( aOtherProperty: Property): number {
		return this.fDescriptor.compareTo(aOtherProperty.fDescriptor);
	}

	public  hashCode(): number {
		return this.fDescriptor.hashCode();
	}

	public  equals( aOtherProperty: Object): boolean {
		if (aOtherProperty instanceof Property) {
			return ((Property)aOtherProperty).fDescriptor.equals(fDescriptor);
		}
		return false;
	} */

	public toString(): string {
		// used in ui
		return this.fDescriptor;
	}

	/*
		CUSTOM
	*/
	get propertySpecification() {
		if (this.fPattern) {
			let s = this.getSpecification();
			this.fPattern.getEvents().forEach(event => {
				s = s.replace(`{${event.getName()}}`, `{${event.predicateSpecification}}`);
			});
			if (this.fScope instanceof AfterQ) {
				s = s.replace(`{${this.fScope.getQ()}}`, `{${this.fScope.getQ().predicateSpecification}}`);
			}
			return s;
		}
		return null;
	}

	get predicateInfos() {
		if (this.fPattern) {
			const predicateInfo = this.fPattern.getEvents().map(event => event.predicateInfo);
			if (this.fScope instanceof AfterQ) {
				predicateInfo.push(this.fScope.getQ().predicateInfo);
			}
			return predicateInfo;
		}
		return null;
	}

	get valid() {
		return !this.predicateInfos?.includes(null);
	}

}
