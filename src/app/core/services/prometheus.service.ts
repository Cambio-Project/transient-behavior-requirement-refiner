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
  data: string[];
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
      'x-target-url': x_target_url,
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

  setDbUrl(dbUrl: string): Promise<boolean> {
    const url = dbUrl + '/api/v1/query?query=up';

    return new Promise((resolve) => {
      this.get(url).subscribe(
        data => {
          this.currentUrl = dbUrl;
          resolve(data['status'] === 'success');
        },
        _ => {
          resolve(false);
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
      // query format: {__name__=~"metric1|metric2|metric3"}
    const url = this.currentUrl
        + '/api/v1/query_range?query=' + encodeURIComponent('{__name__=~"' + metrics.join('|') + '"}')
        + '&start=' + encodeURIComponent(start.toISOString())
        + '&end=' + encodeURIComponent(end.toISOString())
        + '&step=' + encodeURIComponent(step);

    // raise error if status is not success
    return new Promise((resolve, reject) => {
      this.get(url).subscribe(
        data => {
          const parsed_data = this.responseToArray(data);
          const blob_data = parsed_data.map(row => row.join(',')).join('\n');

          if (!parsed_data.length) {
            const error = new HttpErrorResponse(
              {error: {message: 'No metrics found!'}}
            );
            reject(error);
          }

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

}
