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
      this.labelsData.getCommonFieldData().subscribe((commonField: any) => {
        this.commonFieldJson = commonField;
        resolve(commonField)
      }, error => {
        reject()
      })
    })

  }

  findScreenField(udfScreenId) {
    this.getCommonFieldJson();
    return this.returnUdfFields(udfScreenId, this.commonFieldJson)
  }

  returnUdfFields(id, json) {

    let findFieldArray = [];

    if (json) {

      let groupId = json.screenIds ? json.screenIds.find((group) =>
        group.id === id
      ) : {}
      let patchFieldDetails: any = [];
      let fieldData = json.screenUdfMapping ? json.screenUdfMapping[id] : {};

      if (fieldData && fieldData.fields && fieldData.fields.length > 0) {
        findFieldArray = fieldData.fields.filter((field) => {
          json.udfFields.filter((res) => {
            if (res.id === field.name) {
              patchFieldDetails.push(Object.assign(res, field));
              return res
            }
          })
          return patchFieldDetails;
        })

        let udfFields = {
          layout: fieldData.layout,
          groupId: groupId,
          fields: patchFieldDetails
        }
        return udfFields
      }
    }
  }

}
