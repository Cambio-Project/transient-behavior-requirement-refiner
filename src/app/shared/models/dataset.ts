export class Dataset {

	readonly metricDefinitions: string[];
	readonly data: any[];

	constructor(dataset: any[], public file: File) {
		if (dataset.length > 0) {
			this.metricDefinitions = dataset[0];
			this.data = dataset.splice(1, dataset.length).map((el: any, i: number) => {
				const obj: any = {};
				obj.time = i + 1;
				for (let i = 0; i < this.metricDefinitions.length; i++) {
					let val = el[i];
					if (!Number.isNaN(val)) {
						val = Number.parseFloat(val);
					}
					obj[this.metricDefinitions[i]] = val;
				}
				return obj;
			});
			//this.metricDefinitions = ['time', ...this.metricDefinitions];
		} else {
			throw new Error('Invalid Dataset');
		}
	}

	get measurementPoints() {
		return this.metricDefinitions.map(metricDefinition => {
			return {
				measurement_name: metricDefinition,
				measurement_column: metricDefinition
			}
		});
	}

	metricMin(metric?: string) {
		if (!metric) {
			return 0;
		}
		return Math.floor(Math.min(...this.data.map(val => val[metric]).filter(val => !Number.isNaN(val))));
	}

	metricMax(metric?: string) {
		if (!metric) {
			return 0;
		}
		return Math.ceil(Math.max(...this.data.map(val => val[metric]).filter(val => !Number.isNaN(val)))) * 1.5;
	}

}
