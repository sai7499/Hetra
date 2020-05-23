import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

Injectable({
    providedIn: 'root'
})
export class CommomLovService {
    lovData: any;

    setLovData(LOVsData) {
        this.lovData = LOVsData;
    }

    getLovData(): Observable<any>{
        return of(this.lovData);
    }
}