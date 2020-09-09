import { Injectable } from '@angular/core';
import { CollateralList, AdditionalCollateralDetails } from '@model/lead.model';

@Injectable({
  providedIn: 'root'
})
export class CollateralDataStoreService {

  collateralList: any = [];
  IndividualColateralList: any = {};

  constructor() { }

  setCollateralDetails(collateralDetails: CollateralList) {
    this.collateralList.push(collateralDetails);
  }

  getCollateralDetails() {
    return this.collateralList
  }

  setAdditionalCollateralList(collateralList: AdditionalCollateralDetails) {
    this.IndividualColateralList = collateralList
  }
  
  getAdditionalCollateralList() {
    return this.IndividualColateralList
  }

}
