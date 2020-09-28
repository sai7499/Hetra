import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as ageValidationUrl from '../../assets/jsonData/age-validation.json';

@Injectable({
    providedIn: 'root'
})

export class AgeValidationService {

    getAgeValidationData(): Observable<any> {
        return this.createObservableObj(ageValidationUrl);
    }

    createObservableObj(ageValidationurl: object) {
        const ageData = new Observable(observer => {
            observer.next(ageValidationurl);
            observer.complete();
        });
        return ageData;
    }
}
