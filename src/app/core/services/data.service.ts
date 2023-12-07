import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {Dataset} from '../../shared/models/dataset';
import {Observable, Subscription} from "rxjs";


interface PrometheusResponse {
    status: string;
    data: string[];
	error: string;
}


@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		private papa: Papa,
		private http: HttpClient,
	) { }

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
			this.http.get(`assets/csv/${fileName}`, { responseType: 'arraybuffer' })
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

    getMetrics(dbUrl: string, metrics: string[], start: Date, end: Date, step: string): Promise<any> {
        // query format: {__name__=~"metric1|metric2|metric3"}
        const url = dbUrl
            + '/api/v1/query_range?query=' + encodeURIComponent('{__name__=~"' + metrics.join('|') + '"}')
            + '&start=' + encodeURIComponent(start.toISOString())
            + '&end=' + encodeURIComponent(end.toISOString())
            + '&step=' + encodeURIComponent(step);

		// raise error if status is not success
        return new Promise((resolve, reject) => {
            this.http.get<Dataset>(url).subscribe(
                data => {
                    const parsed_data = this.responseToArray(data);
                    const blob_data = parsed_data.map(row => row.join(',')).join('\n');
                    const dataset = new Dataset(
                        parsed_data,
                        new File([blob_data], 'metrics.csv')
                    );
                    resolve(dataset);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    private responseToArray(response: any): any[] {
        type TupleType = [number, any];

        const data = response['data']['result'];
        const metricNames = data.map((metric: any) => metric['metric']['__name__']);
        const metricValues: TupleType[][] = data.map((metric: any) => metric['values']);

        const numMetrics = metricValues.length;
        const numValues = metricValues[0].length;

        if (metricValues.length === 0) {
            return [];
        }

        // attach metric properties to names
        for (let i = 0; i < metricNames.length; i++) {
            if (metricValues[i].length !== numValues) {
                throw new Error('Metric values have different lengths and can not be aligned!');
            }
            const metricName = metricNames[i];
            const metricLabelNames = Object.keys(data[i]['metric']).filter(key => key !== '__name__');
            const metricLabelValues = Object.values(data[i]['metric']).filter(key => key !== metricName);
            const metricLabelPairs = metricLabelNames.map((name: string, index: number) => {
                return name + "'" + metricLabelValues[index] + "'";
            });
            metricNames[i] += '{' + metricLabelPairs.join(', ') + '}';
            metricNames[i] = '"' + metricNames[i] + '"';  // wrap in quotes to avoid issues with commas
        }

        let result = [metricNames];

        // get all timestamps
        const timestamps = Array.from(new Set(metricValues.flat().map(v => v[0]))).sort();

        // create row for each timestamp
        for (let i = 0; i < timestamps.length; i++) {
            const row = [timestamps[i]];
            for (let j = 0; j < numMetrics; j++) {
                const metricValue = metricValues[j].find((v: any) => v[0] === timestamps[i]);
                // add metric value if it exists for timestamp, otherwise add 0.0
                if (metricValue) {
                    row.push(metricValue[1]);
                } else {
                    row.push(0.0);
                }
            }
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
