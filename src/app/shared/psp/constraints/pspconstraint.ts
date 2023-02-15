export abstract class PSPConstraint {

	public abstract getConstraintCategory(): number;

	public abstract getType(): number;

	public abstract getSpecificationAsSEL(): string;

	public toString(): string {
		return this.getSpecificationAsSEL();
	}

}
