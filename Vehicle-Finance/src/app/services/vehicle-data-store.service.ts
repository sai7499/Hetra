import { Injectable } from '@angular/core';
import { VehicleList, IndivVehicleInfoDetails } from '@model/lead.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleDataStoreService {

  // basicVehicleDetails: BasicVehicleDetails;
  vehicleList = [];
  vehicleData: any = {};
  basicVehicleDetails = {};
  collateralId: number;
  CreditTaskID: number;
  SalesLeadId: number;

  constructor() { }

  setVehicleDetails(vehicleDetails: VehicleList) {
    this.vehicleList.push(vehicleDetails);
  }

  setCreditTaskId(id) {
    this.CreditTaskID = id;
  }

  setSalesLeadID(id: number) {
    this.SalesLeadId = id;
  }

  getSalesLeadId() {
    return this.SalesLeadId;
  }

  getCreditTaskId() {
    return this.CreditTaskID;
  }

  getVehicleDetails() {
    // return this.leadCreation ? this.leadCreation.vehicleDetails : {};
    return this.vehicleList;
  }

  setIndividualVehicleDetail(vehiceList: IndivVehicleInfoDetails) {
    this.vehicleData = vehiceList;
  }

  getIndividualVehicleDetail() {
    return this.vehicleData
  }

  setCollateralId(Id) {
    this.collateralId = Id;
  }

  getSelectedVehicle(index: number) {
    return this.vehicleList[index];
  }

  updateVehicle(index: number, vehicleDetails) {
    this.vehicleList[index] = vehicleDetails;
  }

  deleteVehicle(index: number) {
    this.vehicleList.splice(index, 1);
  }
}
