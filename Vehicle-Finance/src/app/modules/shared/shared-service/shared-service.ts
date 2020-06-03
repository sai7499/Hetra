import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {

    leadData$: BehaviorSubject<string> = new BehaviorSubject(null);

    leadDataToHeader(data) {
        console.log('prd',data)
        this.leadData$.next(data);
    }



}