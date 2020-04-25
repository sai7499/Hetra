import { Injectable } from '@angular/core';
import {
  Dde, VehicleValuation, PslData, ApplicantDetails, CustomerProfile,
  LoanDetails, FleetDetails, TrackVehicle
} from '@model/dde.model';

@Injectable({
  providedIn: 'root'
})
export class DdeStoreService {

  public ddeStore: Dde;

  public trackvehicle: any;
  public fleetDetails: any;

  constructor() { }

  setDde(dde: Dde) {
    this.ddeStore = dde;
  }

  getDde() {
    return this.ddeStore;
  }

  setFleetDetails(fleetDetails: FleetDetails) {
    this.ddeStore.fleetDetails = fleetDetails
  }

  getFleetDetails() {
    return this.ddeStore ? this.ddeStore.fleetDetails : {};
  }

  setTrackVehicle(trackvehicle: TrackVehicle) {
    this.ddeStore.trackVehicle = trackvehicle
  }

  getTrackVehicle() {
    return this.ddeStore ? this.ddeStore.trackVehicle : {};
  }




}
