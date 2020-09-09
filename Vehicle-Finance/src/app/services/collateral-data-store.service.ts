import { Injectable } from '@angular/core';
import { CollateralList } from '@model/lead.model';

@Injectable({
  providedIn: 'root'
})
export class CollateralDataStoreService {

  collateralList: any = [];

  constructor() { }

  setCollateralDetails(collateralDetails: CollateralList) {
    this.collateralList.push(collateralDetails);
  }
}
