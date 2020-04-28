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
  public vehicleValuation: any;
  public pslData: any;

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

  setApplicantDetails(applicantDetails: ApplicantDetails) {
    this.ddeStore.applicantDetails = applicantDetails;
  }

  getApplicantDetails() {
    return this.ddeStore ? this.ddeStore.applicantDetails : {};
  }

  setCustomerProfile(customerProfile: CustomerProfile) {
    this.ddeStore.customerProfile = customerProfile;
  }

  getCustomerProfile() {
    return this.ddeStore ? this.ddeStore.customerProfile : {};
  }

  setLoanDetails(loanDetails: LoanDetails) {
    this.ddeStore.loanDetails = loanDetails;
  }

  getLoanDetails() {
    return this.ddeStore ? this.ddeStore.loanDetails : {};
  }

}
