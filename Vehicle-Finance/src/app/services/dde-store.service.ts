import { Injectable } from '@angular/core';

import { Dde, VehicleValuation, PslData } from '@model/dde.model';

@Injectable({
    providedIn: 'root'
})
export class DdeStoreService {

    public ddeStore: Dde;

    public vehicleValuation: any;
    public pslData: any;

    constructor() {}

    setDde(dde: Dde) {
        this.ddeStore = dde;
    }

    getDde() {
        return this.ddeStore;
    }

    setVehicleValuation(vehicleValuation: VehicleValuation) {
        this.ddeStore.vehicleValuation = vehicleValuation;
    }

    getVehicleValuation() {
        return this.ddeStore ? this.ddeStore.vehicleValuation : {};
    }

    setPslData(pslData: PslData) {
        this.ddeStore.pslData = pslData;
    }

    getPslData() {
        return this.ddeStore ? this.ddeStore.pslData : {};
    }
}
