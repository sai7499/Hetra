import { Injectable } from '@angular/core';
import { VehicleDetails, BasicVehicleDetails } from '@model/lead.model';
import { VehicleList } from '@model/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleDataStoreService {

  // basicVehicleDetails: BasicVehicleDetails;
  vehicleList = [];
  vehicleData: any = [];
  basicVehicleDetails = {};

  constructor() { }

  setVehicleDetails(vehicleDetails: VehicleList) {
    this.vehicleList.push(vehicleDetails);
  }

  getVehicleDetails() {
    // return this.leadCreation ? this.leadCreation.vehicleDetails : {};
    return this.vehicleList;
  }

  setIndividualVehicleDetails(vehiceList: VehicleDetails) {

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
