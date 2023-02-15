import { Event } from "../event";
import { PSPConstants } from "../../engine/pspconstants";
import { Pattern } from "./pattern";
import { ProbabilityBound } from "../../constraints/probability-bound";
import { ChainEvents } from "./order/chain-events";

export abstract class Order extends Pattern {
	private fP: Event;
	private fS: Event;
	private fTis: ChainEvents | null;

	private fProbBound: ProbabilityBound | null;

	public getP(): Event {
		return this.fP;
	}

	public setP(aP: Event): void {
		this.fP = aP;
	}

	public getS(): Event {
		return this.fS;
	}

	public setS(aS: Event): void {
		this.fS = aS;
	}

	public getTis(): ChainEvents | null {
		return this.fTis;
	}

	public setTis(aTis: ChainEvents): void {
		this.fTis = aTis;
	}

	public getProbabilityBound(): ProbabilityBound | null {
		return this.fProbBound;
	}

	public setProbabilityBound(aProbBound: ProbabilityBound): void {
		this.fProbBound = aProbBound;
	}

	constructor(aP: Event, aS: Event, aTis: ChainEvents | null, aProbBound: ProbabilityBound | null) {
		super();
		this.fP = aP;
		this.fS = aS;
		this.fTis = aTis;
		this.fProbBound = aProbBound;
	}

	public getPatternCategory(): number {
		return PSPConstants.PC_Order;
	}

	public getEvents(): Event[] {
		const Result: Event[] = [];

		Result.push(this.getP());
		if (!Result.some(val => this.getS().getName() === val.getName()))
			Result.push(this.getS());

		return Result;
	}

	/*
	TODO
	public getEvents(): Event[] {
		const Result: Event[] = [];

		Result.push(this.getP());
		if (!Result.contains(this.getS()))
			Result.push(this.getS());

		return Result;
	}
	*/
}
