import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable, Subject, take } from 'rxjs';
import { Dataset } from 'src/app/shared/models/dataset';
import { ValidationResponse } from 'src/app/shared/models/validation-response';
import { Property } from 'src/app/shared/psp/sel/property';
import { DataService } from './data.service';
import { ValidationService } from './validation.service';

@Injectable({
	providedIn: 'root'
})
export class PropertyService {

	property$: Observable<Property | null>;
	private _property$ = new BehaviorSubject<Property | null>(null);
	validationResponse$ = new Subject<ValidationResponse>();

	constructor(
		private validationSvc: ValidationService,
		private dataSvc: DataService,
	) {
		this.property$ = this._property$.asObservable();
	}

	setProperty(property: Property) {
		this._property$.next(property);
		//this.validateProperty();
	}



}
