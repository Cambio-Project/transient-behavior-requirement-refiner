import { PSPConstants } from "../../engine/pspconstants";
import { Scope } from "./scope";

export class Globally extends Scope {

	constructor() {
		super(null, null);
	}

	public getSpecificationAsSEL(): string {
		return "Globally";
	}

	public getType(): number {
		return PSPConstants.S_Globally;
	}
}
