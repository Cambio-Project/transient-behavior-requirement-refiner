import { PSPConstants } from "../engine/pspconstants";
import { PSPConstraint } from "./pspconstraint";

export class ProbabilityBound extends PSPConstraint {

	private fProbability: number;

	public getProbability(): number {
		return this.fProbability;
	}

	constructor(aProbability: number) {
		super();
		this.fProbability = aProbability;
	}

	public getConstraintCategory(): number {
		return PSPConstants.C_Probability;
	}

	public getSpecificationAsSEL(): string {
		return "with a probability ";
	}

	public override toString(): string {
		return "with";
	}

	/*
		TODO
	*/
	public getType(): number {
		throw new Error("Method not implemented.");
	}

}
