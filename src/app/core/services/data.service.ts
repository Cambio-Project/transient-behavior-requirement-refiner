import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {Dataset} from '../../shared/models/dataset';
import {PrometheusService} from "./prometheus.service";


@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		private papa: Papa,
		private http: HttpClient,
		private prometheusService: PrometheusService,
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

  setCredentials(proxyUrl: string, username: string, password: string): void {
    this.prometheusService.setCredentials(proxyUrl, username, password);
  }

  clearCredentials(): void {
    this.prometheusService.clearCredentials();
  }

  setDbUrl(dbUrl: string): Promise<boolean> {
    return this.prometheusService.setDbUrl(dbUrl);
  }

  getAvailableMetrics(): Promise<string[]> {
    /**
     * Get available metrics from prometheus database.
     *
     * @param dbUrl - prometheus database url
     * @returns array of metric names
     */
    return this.prometheusService.getAvailableMetrics();
  }

  getMetrics(metrics: string[], start: Date, end: Date, step: string): Promise<any> {
    /**
     * Get metrics from prometheus database.
     *
     * @param dbUrl - prometheus database url
     * @param metrics - array of metric names
     * @param start - start date
     * @param end - end date
     * @param step - step size
     * @returns csv array
     */
    return this.prometheusService.getMetrics(metrics, start, end, step);
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
