import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Dataset} from "../../shared/models/dataset";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";


interface MetricType {
    metric: {
        __name__: string;
        [key: string]: string; // Other properties of the metric
    };
    values: TupleType[];
}

type TupleType = [number, any]; // Adjust as per your data structure


interface PrometheusResponse {
    status: string;
    data: any;
    error: string;
}


@Injectable({
    providedIn: 'root'
})
export class PrometheusService {

    private currentUrl: string = '';
    private proxyUrl: string = '';
    private useCredentials: boolean = false;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {
    }

    private getAuthHeaders(x_target_url: string): HttpHeaders {
        const credentials = this.authService.getCredentials();
        return new HttpHeaders({
            'Authorization': 'Basic ' + credentials,
            'x-target-url': x_target_url
        });
    }

    private get(url: string): Observable<PrometheusResponse> {
        /**
         * Prepare request to prometheus database.
         *
         * If credentials are used, add authorization header to the request.
         *
         * @param url - prometheus database url
         * @returns prometheus response
         **/

        if (this.useCredentials) {
            return this.http.get<PrometheusResponse>(this.proxyUrl, {headers: this.getAuthHeaders(url)});
        } else {
            return this.http.get<PrometheusResponse>(url);
        }
    }

    setCredentials(proxyUrl: string, username: string, password: string): void {
        this.useCredentials = true;
        this.proxyUrl = proxyUrl;
        this.authService.cacheCredentials(username, password);
    }

    clearCredentials(): void {
        this.useCredentials = false;
        this.proxyUrl = '';
        this.authService.clearCredentials();
    }

    setDbUrl(dbUrl: string): Promise<{ success: boolean, msg: string }> {
        const url = dbUrl + '/api/v1/query?query=up';

        return new Promise((resolve) => {
            this.get(url).subscribe(
                data => {
                    this.currentUrl = dbUrl;
                    resolve({success: true, msg: 'Successfully connected to the database!'});
                },
                error => {
                    let msg = 'Failed connection: ' + error.status + ' (' + error.statusText + ') ';
                    resolve({success: false, msg: msg});
                }
            );
        });
    }

    getAvailableMetrics(): Promise<string[]> {
        /**
         * Get available metrics from prometheus database.
         *
         * @param dbUrl - prometheus database url
         * @returns array of metric names
         */
        const url = this.currentUrl + '/api/v1/label/__name__/values';

        return new Promise((resolve, reject) => {
            this.get(url).subscribe(
                data => {
                    resolve(data['data']);
                },
                _ => {
                    resolve([]);
                }
            );
        });
    }

    private metricToDataset(metricData: any): Dataset {
        /**
         * Convert prometheus response to csv array
         *
         * @param metricData - prometheus metric data
         * @returns csv array
         */
        const [metricNames, metricValues] = this.extractMetricNamesAndValues(metricData);
        this.attachMetricProperties(metricNames, metricData);
        const csvArray = this.aggregateTimestamps(metricValues, metricNames);
        const blob_data = csvArray.map(row => row.join(',')).join('\n');
        return new Dataset(
            csvArray,
            new File([blob_data], 'metrics.csv')
        );
    }

    private isRangeVector(query: string): boolean {
        // Regular expression to match range vector syntax outside of labels
        // Look for a series of characters that are not closing braces (to exclude labels),
        // followed by the range vector syntax, ensuring it's not part of a label value.
        const rangeVectorRegex = /[^}]*\[\s*\d+[smhdwy]\s*]/;
        return rangeVectorRegex.test(query)
    }

    private dispatchMetricQuery(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<PrometheusResponse>(url).subscribe(
                data => {
                    const metricData: MetricType[] = data['data']['result'];
                    if (!metricData.length) {
                        reject({error: 'No metrics found!'});
                    }
                    resolve(this.metricToDataset(metricData));
                },
                error => {
                    reject(error.error);
                }
            );
        });
    }

    getMetrics(query: string, start: Date, end: Date, step: string): {
        queryType: string,
        query: string,
        data: Promise<any>
    } {
        /**
         * Get query from prometheus database.
         *
         * @param dbUrl - prometheus database url query
         * @param query - array of metric names
         * @param start - start date
         * @param end - end date
         * @param step - step size
         * @returns query type, query, and data promise
         */
        let url: string;
        const queryType: string = this.isRangeVector(query) ? 'range' : 'instant';

        if (queryType === 'range') {
            url = this.currentUrl + '/api/v1/query?query=' + encodeURIComponent(query);
        } else {
            url = this.currentUrl
                + '/api/v1/query_range'
                + '?query=' + encodeURIComponent(query)
                + '&start=' + encodeURIComponent(start.toISOString())
                + '&end=' + encodeURIComponent(end.toISOString())
                + '&step=' + encodeURIComponent(step);
        }
        return {
            queryType: queryType,
            query: query,
            data: this.dispatchMetricQuery(url)
        };
    }

    private extractMetricNamesAndValues(data: MetricType[]): [string[], TupleType[][]] {
        /**
         * Extract metric names and values from the response
         *
         * @param data - array of metric objects
         * @returns array of metric names and array of metric values
         */
        const metricNames = data.map(metric => metric.metric['__name__'] as string);
        const metricValues: TupleType[][] = data.map(metric => metric.values as TupleType[]);
        return [metricNames, metricValues];
    }

    private attachMetricProperties(metricNames: string[], data: MetricType[]): void {
        /**
         * Attach prometheus metric properties to metric names.
         *
         * @param metricNames - array of metric names
         * @param data - array of metric objects
         */
        for (let i = 0; i < metricNames.length; i++) {
            const metricLabelNames: string[] = Object.keys(data[i]['metric']).filter(key => key !== '__name__');
            const metricLabelValues: string[] = Object.values(data[i]['metric']).filter(key => key !== metricNames[i]);
            metricNames[i] += '_' + this.createMetricLabelPairs(metricLabelNames, metricLabelValues).join('_');
        }
    }

    private createMetricLabelPairs(labelNames: string[], labelValues: string[]): string[] {
        /**
         * Create metric label pairs
         *
         * @param labelNames - array of label names
         * @param labelValues - array of label values
         * @returns array of label pairs as strings
         */
        return labelNames.map((name, index) => {
            const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
            const cleanValue = labelValues[index].replace(/[^a-zA-Z0-9]/g, '_');
            return cleanName + "_" + cleanValue;
        });
    }

    private aggregateTimestamps(metricValues: TupleType[][], metricNames: string[]): any[] {
        /**
         * Aggregate timestamps and values into a single array
         * [
         *  [metric1, metric2, metric3],
         *  t1 - [value1, value2, value3],
         *  t2 - [value1, value2, value3],
         *  t3 - [value1, value2, value3]
         *  ...
         *  tn - [value1, value2, value3]
         *  ]
         *
         *  If a metric does not have a value at a given timestamp, the value is set to 0.0.
         *
         *  @param metricValues - array of metric values
         *  @param metricNames - array of metric names
         *  @returns csv array
         */
        const timestamps = Array.from(new Set(metricValues.flat().map(v => v[0]))).sort();
        const result = [metricNames];  // First row is metric names, CSV header

        for (const timestamp of timestamps) {
            const row = metricValues.map(values => {
                const metricValue = values.find(value => value[0] === timestamp);
                return metricValue ? metricValue[1] : 0.0;
            });
            result.push(row);
        }

        return result;
    }

}
