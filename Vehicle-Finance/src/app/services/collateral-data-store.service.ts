import { Injectable } from '@angular/core';
import { CollateralList, AdditionalCollateralDetails } from '@model/lead.model';
import { LabelsService } from './labels.service';

@Injectable({
  providedIn: 'root'
})
export class CollateralDataStoreService {

  collateralList: any = [];
  IndividualColateralList: any = {};
  commonFieldJson: any;

  constructor(private labelsData: LabelsService) { }

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

  async getCommonFieldJson() {

    return new Promise((resolve, reject) => {
      this.labelsData.getCommonFieldDate().subscribe((commonField: any) => {
        this.commonFieldJson = commonField;
        resolve()
      }, error => {
        reject()
      })
    })

  }

  findScreenField(screenId) {
    this.getCommonFieldJson();
    return this.returnUdfFields(screenId, this.commonFieldJson)
  }

  returnUdfFields(id, json) {

    let findFieldArray = [];

    if (json) {

      let groupId = json.screenIds.find((group) => {
        return group.groupId
      })

      let patchFieldDetails: any = [];
      let fieldData = json.screenUdfMapping[id];

      if (fieldData.fields && fieldData.fields.length > 0) {
        findFieldArray =  fieldData.fields.filter((field) => {
          json.udfFields.filter((res) => {
            if (res.id === field.name) {
              patchFieldDetails.push(Object.assign(res, field));
              return res
            }
          })
          return patchFieldDetails;
        })
      }

      let udfFields = {
        layout: fieldData.layout,
        groupId: groupId,
        fields: patchFieldDetails
      }
      return udfFields
    }
  }

}
