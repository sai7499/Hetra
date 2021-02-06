import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {

    popStateActivity$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    leadItem: any;
    
    browserPopState(data) {
        this.popStateActivity$.next(data)
    }

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

    userDefined$: BehaviorSubject<any> = new BehaviorSubject([]);
    getUserDefinedFields(value) {
        this.userDefined$.next(value)
    }

    apiValue$: BehaviorSubject<any>= new BehaviorSubject([]);
    getApiValue(value) {
        this.apiValue$.next(value)
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

    pslDataNext$: BehaviorSubject<any> = new BehaviorSubject(false);
    getPslDataNext(data) {
        this.pslDataNext$.next(data);
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
   
    productCatCode$: BehaviorSubject<string> = new BehaviorSubject(null);
    setProductCatCode(data){
        this.productCatCode$.next(data);
    }
  
    productCatName$:BehaviorSubject<string> = new BehaviorSubject(null);
    setProductCatName(data){
        this.productCatName$.next(data);
    }
   
    userName$: BehaviorSubject<any> = new BehaviorSubject(null);
    isSUpervisorUserName = this.userName$.asObservable();
    getUserName(data) {
        this.userName$.next(data);
    }
    
    userRoleId$: BehaviorSubject<any> = new BehaviorSubject(null);
    isSupervisorRoleId = this.userRoleId$.asObservable();
    getUserRoleId(data) {
        this.userRoleId$.next(data);
    }
   
    supervisorName$: BehaviorSubject<any> = new BehaviorSubject(null);
    isSupervisorName = this.supervisorName$.asObservable();
    getSupervisorName(data) {
        this.supervisorName$.next(data)
    }
   
    declinedFlow$: BehaviorSubject<any> = new BehaviorSubject(null);
    isDeclinedFlow = this.declinedFlow$.asObservable();
    getDeclinedFlow(data) {
        this.declinedFlow$.next(data);
    }

    bureauDetail$: BehaviorSubject<any> = new BehaviorSubject(null);
    getBureauDetail(data) {
        this.bureauDetail$.next(data);
    }

    isdedupdeStatus$: BehaviorSubject<any> = new BehaviorSubject(null);
    getDedupdeStatus(data) {
        this.isdedupdeStatus$.next(data);
    }

    setTabName(data){
       this.leadItem = data
    }

    getTabName(){
        return this.leadItem
    }


}