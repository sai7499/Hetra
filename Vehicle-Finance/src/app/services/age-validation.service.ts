import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ageValidationUrl from '../../assets/jsonData/age-validation.json';

@Injectable({
    providedIn: 'root'
})

export class AgeValidationService {

    getAgeValidationData(): Observable<any> {
        return this.createObservableObj(ageValidationUrl);
    }

    createObservableObj(ageValidationurl: string) {
        const ageData = new Observable(observer => {
            observer.next(ageValidationurl);
            observer.complete();
        });
        return ageData;
    }
}
