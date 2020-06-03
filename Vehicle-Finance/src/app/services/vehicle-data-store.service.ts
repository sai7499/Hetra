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

  constructor() { }

  setVehicleDetails(vehicleDetails: VehicleList) {
    this.vehicleList.push(vehicleDetails);
  }

  getVehicleDetails() {
    // return this.leadCreation ? this.leadCreation.vehicleDetails : {};
    return this.vehicleList;
  }

  setIndividualVehicleDetails(vehiceList: IndivVehicleInfoDetails) {
    this.vehicleData = vehiceList;
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
