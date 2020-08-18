import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {

    leadData$: BehaviorSubject<string> = new BehaviorSubject(null);

    leadDataToHeader(data) {
        this.leadData$.next(data);
    }

    loanAmount$: BehaviorSubject<number> = new BehaviorSubject(0);
    changeLoanAmount(amount: number) {
        this.loanAmount$.next(amount)
    }

    vaildateForm$: BehaviorSubject<any> = new BehaviorSubject([]);
    getFormValidation(form) {
        this.vaildateForm$.next(form)
    }

    updateDev$: BehaviorSubject<any> = new BehaviorSubject([]);
    getUpdatedDeviation(data) {
        this.updateDev$.next(data)
    }

    pdStatus$: BehaviorSubject<any> = new BehaviorSubject([]);
    getPdStatus(data) {
        this.pdStatus$.next(data)
    }

    taskId$: BehaviorSubject<any> = new BehaviorSubject('');
    getTaskID(data) {
        this.taskId$.next(data)
    }

    vehicleValuationNext$: BehaviorSubject<any> = new BehaviorSubject(false);
    getVehicleValuationNext(data) {
        this.vehicleValuationNext$.next(data);
    }

    tvrDetailsPrevious$: BehaviorSubject<any> = new BehaviorSubject(false);
    getTvrDetailsPrevious(data) {
        this.tvrDetailsPrevious$.next(data);
    }
    roleAndActivityList$: BehaviorSubject<any> = new BehaviorSubject([]);
    getRolesActivityList(data) {
        this.roleAndActivityList$.next(data);
    }

    private searchbarRoleActivityList$: BehaviorSubject<any> = new BehaviorSubject(null);
    setSearchBarActivity(data) {
        this.searchbarRoleActivityList$.next(data);
    }

    loanNumber$: BehaviorSubject<any> = new BehaviorSubject(0);
    getLoanNumber(data) {
        this.loanNumber$.next(data);
    }

    getSearchBarActivity() {
        return this.searchbarRoleActivityList$;
    }
}