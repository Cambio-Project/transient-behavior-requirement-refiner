import {Event} from "../psp/sel/event";
import {Property} from "../psp/sel/property";
import {TimeBound} from "../psp/constraints/time-bound";
import {UpperTimeBound} from "../psp/constraints/upper-time-bound";
import {Interval} from "../psp/constraints/interval";

export class ValidationResponse {

    result: boolean;
    intervals: { start: number, end: number, result: boolean }[];
    timebound: TimeBound | null;

    constructor(response: any, public validatedItem: Property | Event) {
        this.result = (new String(response.result)).toLowerCase() === 'true';
        this.intervals = response.intervals.map((interval: any[]) => {
            return {
                start: interval[0],
                end: interval[1],
                result: interval[2],
            }
        });

        this.timebound = this.determineTimeBound(response);
    }

    private determineTimeBound(response: any): TimeBound | null {
        const {lower_bound, upper_bound} = response;
        if (lower_bound && upper_bound) {
            return new Interval(new Event(`Candidate ${lower_bound} to ${upper_bound}`), lower_bound, upper_bound, 'time units');
        } else if (upper_bound) {
            return new UpperTimeBound(new Event(`Candidate ${upper_bound}`), upper_bound, 'time units');
        }
        return null;
    }
}

export class PredicateRefinementResponse {
    result: string[];

    constructor(response: any) {
        this.result = response.result;
    }
}
