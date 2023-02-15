import { PSPConstants } from "../../engine/pspconstants";
import { Event } from "../event";
import { Scope } from "./scope";

export class AfterQ extends Scope {

	constructor(aQ: Event | null = null) {
		super(aQ, null);
	}

	getSpecificationAsSEL(): string {
		let sb: string = '';
		sb += "After ";
		sb += this.getQ().getAsSELEvent();
		return sb;
	}

	getType(): number {
		return PSPConstants.S_AfterQ;
	}

}
