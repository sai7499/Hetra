import { Injectable, OnDestroy } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { QueryModelService } from './query-model.service';

@Injectable({
    providedIn: 'root'
})

export class PollingService implements OnDestroy {

    private allCountAcrossLeads$: Observable<any[]>;

    private stopPolling;

    constructor(private quermodalService: QueryModelService) { }

    getPollingCount() {
        let stopPolling = interval(10000).pipe(
            startWith(0),
            switchMap(
                () => this.quermodalService.getCountAcrossLeads(localStorage.getItem('userId')))
        ).
            subscribe((res: any) => {
                console.log(res, 'count')
                return res
            })
        return stopPolling
    }

    stopPollingLead() {
        clearInterval(this.stopPolling)
    }

    ngOnDestroy() {
        clearInterval(this.stopPolling)
        // this.stopPolling.next()
    }

}