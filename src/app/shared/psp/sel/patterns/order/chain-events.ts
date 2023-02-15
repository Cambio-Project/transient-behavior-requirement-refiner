import { Event } from "../../event";
import { ChainEvent } from "./chain-event";

export class ChainEvents {

	private fTis: ChainEvent[];

	public getTis(): ChainEvent[] {
		return this.fTis;
	}

	public size(): number {
		return this.fTis.length;
	}

	public getTi(aIndex: number): ChainEvent {
		return this.fTis[aIndex];
	}

	/*
	TODO
	public Iterator<ChainEvent> iterator() {
		return fTis.iterator();
	}
	*/

	constructor(aTis?: ChainEvent[]) {
		this.fTis = aTis || [new ChainEvent()];
	}

	public getEvents(): Event[] {
		const Result: Event[] = [];

		for (let ce of this.fTis) {
			for (let e of ce.getEvents()) {
				if (!Result.some(val => val.getName() === e.getName()))
					Result.push(e);
			}
		}

		return Result;
	}

	public getSpecificationAsSEL(aConnector: string): string {
		let sb = '';

		for (let ce of this.fTis) {
			sb += aConnector;
			sb += ce.getSpecificationAsSEL();
		}

		return sb;
	}

}
