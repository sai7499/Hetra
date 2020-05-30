import { Injectable } from '@angular/core';
import { VehicleDetails, BasicVehicleDetails } from '@model/lead.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleDataService {

  // basicVehicleDetails: BasicVehicleDetails;
  vehicleList = [];
  vehicleData: any = [];
  basicVehicleDetails = {};

  constructor() { }


  setVehicleDetails(vehicleDetails: VehicleDetails) {

    // this.vehicleData = vehicleDetails;
    // this.basicVehicleDetails['assetMake'] = this.vehicleData[0].assetMake;
    // this.basicVehicleDetails['assetModel'] = this.vehicleData[0].assetModel;
    // this.basicVehicleDetails['assetBodyType'] = this.vehicleData[0].assetBodyType;
    // this.basicVehicleDetails['assetVariant'] = this.vehicleData[0].assetVariant;
    // this.basicVehicleDetails['assetSubVariant'] = this.vehicleData[0].assetSubVariant;
    // this.basicVehicleDetails['vehicleType'] = this.vehicleData[0].vehicleType;
    // this.basicVehicleDetails['yearAndMonthManufacturing'] = this.vehicleData[0].yearAndMonthManufacturing;
    // this.basicVehicleDetails['finalAssetCost'] = this.vehicleData[0].finalAssetCost;
    // this.basicVehicleDetails['vechicleUsage'] = this.vehicleData[0].vechicleUsage;
    // this.basicVehicleDetails['region'] = this.vehicleData[0].region;
    // this.basicVehicleDetails['noOfVehicles'] = this.vehicleData[0].noOfVehicles;
    // // vehicleDetails['assetMake'] = vehicleDetails.assetMake;
    this.vehicleList.push(vehicleDetails);

    console.log("in service vehicle detail", this.vehicleList)
  }

  getVehicleDetails() {
    // return this.leadCreation ? this.leadCreation.vehicleDetails : {};
    return this.vehicleList;
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
