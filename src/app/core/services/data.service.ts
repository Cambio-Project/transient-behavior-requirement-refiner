import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {Dataset} from '../../shared/models/dataset';
import {Observable, Subscription} from "rxjs";


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
export class DataService {

    constructor(
        private papa: Papa,
        private http: HttpClient,
    ) {
    }

    parseCsvFile(file: File) {
        return new Promise<Dataset>((resolve, reject) => {
            this.papa.parse(file, {
                delimiter: ',',
                complete: result => {
                    const dataset = new Dataset(result.data, file);
                    resolve(dataset);
                },
                error: (err, file) => {
                    reject(err);
                },
            });
        });
    }

    parseCsvFileFromAssets(fileName: string) {
        return new Promise<Dataset>((resolve, reject) => {
            this.http.get(`assets/csv/${fileName}`, {responseType: 'arraybuffer'})
                .subscribe(async data => {
                    const file = this.blobToFile(data, fileName);
                    try {
                        const dataset = await this.parseCsvFile(file);
                        resolve(dataset);
                    } catch (err) {
                        reject(err);
                    }
                });
        });
    }

    blobToFile = (data: ArrayBuffer, fileName: string): File => {
        const blob: any = new Blob([data]);
        var b: any = blob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>blob;
    }

    setDbUrl(dbUrl: string): Promise<boolean> {
        const url = dbUrl + '/api/v1/query?query=up';
        return new Promise((resolve, reject) => {
            this.http.get<PrometheusResponse>(url).subscribe(
                data => {
                    resolve(true);
                },
                error => {
                    resolve(false);
                }
            );
        });
    }

    getAvailableMetrics(dbUrl: string): Promise<string[]> {
        /**
         * Get available metrics from prometheus database.
         *
         * @param dbUrl - prometheus database url
         * @returns array of metric names
         */
        const url = dbUrl + '/api/v1/label/__name__/values';
        return new Promise((resolve, reject) => {
            this.http.get<PrometheusResponse>(url).subscribe(
                data => {
                    resolve(data['data']);
                },
                error => {
                    resolve([]);
                }
            );
        });
    }

    getMetrics(dbUrl: string, query: string, start: Date, end: Date, step: string): Promise<any> {
        /**
         * Get query from prometheus database.
         *
         * @param dbUrl - prometheus database url query
         * @param query - array of metric names
         * @param start - start date
         * @param end - end date
         * @param step - step size
         * @returns csv array
         */
            // query format: {__name__=~"metric1|metric2|metric3"}
        const url = dbUrl
                + '/api/v1/query_range'
                + '?query=' + encodeURIComponent(query)
                + '&start=' + encodeURIComponent(start.toISOString())
                + '&end=' + encodeURIComponent(end.toISOString())
                + '&step=' + encodeURIComponent(step);

        // raise error if status is not success
        return this.dispatchMetricQuery(url);
    }

    getMetricsCustomQuery(dbUrl: string, customQuery: string): Promise<any> {
        /**
         * Get metrics from prometheus database.
         *
         * @param dbUrl - prometheus database url
         * @param customQuery - prometheus query
         * @returns csv array
         */
            // query format: {__name__=~"metric1|metric2|metric3"}
        const url = dbUrl
                + '/api/v1/query?query=' + encodeURIComponent(customQuery);

        // raise error if status is not success
        return this.dispatchMetricQuery(url);
    }

    private dispatchMetricQuery(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<PrometheusResponse>(url).subscribe(
                data => {
                    const metricData: MetricType[] = data['data']['result'];
                    if (!metricData.length) {
                        reject('No metrics found!');
                    }
                    console.log(data);
                    resolve(this.metricToDataset(metricData));
                },
                error => {
                    reject(error);
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

    private responseToArray(response: any): any[] {
        /**
         * Convert prometheus response to csv array
         *
         * @param response - prometheus response
         * @returns csv array
         */
        const data: MetricType[] = response['data']['result'];
        if (!data.length) {
            return [];
        }

        const [metricNames, metricValues] = this.extractMetricNamesAndValues(data);
        this.attachMetricProperties(metricNames, data);
        return this.aggregateTimestamps(metricValues, metricNames);
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


    generateUUID() {
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'p' + 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

}
