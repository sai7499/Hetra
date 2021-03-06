import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class CommonDataService {
    constructor() { }

    cdsStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public cdsStatus = this.cdsStatus$.asObservable();
    changeCdsStatus(value: boolean) {
        this.cdsStatus$.next(value);
    }
    leadDataStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public leadDataStatus = this.leadDataStatus$.asObservable();
    changeleadDataStatus(value: boolean) {
        this.leadDataStatus$.next(value);
    }

    applicantDeleted$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public applicantDeleted = this.applicantDeleted$.asObservable();
    applicantListEdited(value: any) {
        this.applicantDeleted$.next(value);
    }

    leadHistoryData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public leadHistoryData = this.leadHistoryData$.asObservable();
    shareLeadHistoryData(value: any) {
        this.leadHistoryData$.next(value);
    }

    selectedCustomerData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public selectedCustomerData = this.selectedCustomerData$.asObservable();
    shareChildLoanData(value: any){
        this.selectedCustomerData$.next(value);
    }
}
