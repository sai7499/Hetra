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
}
