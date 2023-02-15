import { Event } from "../psp/sel/event";
import { Property } from "../psp/sel/property";

export class ValidationResponse {

	result: boolean;
	intervals: { start: number, end: number, result: boolean }[];

	constructor(response: any, public validatedItem: Property | Event) {
		this.result = (new String(response.result)).toLowerCase() === 'true';
		this.intervals = response.intervals.map((interval: any[]) => {
			return {
				start: interval[0],
				end: interval[1],
				result: interval[2],
			}
		});
	}

}
