import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollateralDataStoreService } from '@services/collateral-data-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-shared-user-defined-fields',
  templateUrl: './shared-user-defined-fields.component.html',
  styleUrls: ['./shared-user-defined-fields.component.css']
})
export class SharedUserDefinedFieldsComponent implements OnInit {

  @Input() screenId: any;
  @Input() groupScreenId: any;
  @Input() udfDetails: any;

  screenUdfMapping: any;
  labels: any = {};
  dynamicForm: FormGroup;

  @Output() saveUserdefined = new EventEmitter();

  LOV: any;

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private collateralDataStoreService: CollateralDataStoreService,
    private commomLovService: CommomLovService) { }

  ngOnInit() {
    this.screenUdfMapping = this.collateralDataStoreService.findScreenField(this.screenId)

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log('error', error)
      });
    this.initForm();
    this.getLOV()
  }

  initForm() {

    this.dynamicForm = this._fb.group({
      screenId: this.screenId
    })

    if (this.screenUdfMapping && this.screenUdfMapping.fields.length > 0) {
      this.screenUdfMapping.fields.map((control: any) => {
        let fc = control.mandatory && control.mandatory === true ? this._fb.control('', Validators.required)
          : this._fb.control('');

        this.dynamicForm.addControl(control.name, fc)
      })
    }

    let udfDetails = {
      groupScreenID: 5000,
      udfData: JSON.stringify(this.dynamicForm.getRawValue())
    }
    this.saveUserdefined.emit(udfDetails);

  }

  testValue() {
    console.log('testValue')
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log(this.LOV, 'Lov')
    if (this.udfDetails && this.udfDetails.length > 0) {

      this.groupScreenId = this.udfDetails[0].groupScreenID;
      let patchJsonValue = JSON.parse(this.udfDetails[0].udfData)
      let keys = Object.keys(patchJsonValue);
      let values = Object.values(patchJsonValue);

      let combineArray = [];

      let arrayOfObj = {
      }

      combineArray = keys.map((control, i) => {
        values.map((val, j) => {
          if (i === j) {
            arrayOfObj = {
              key: control,
              value: val
            }
          }
        })
        return arrayOfObj;
      })

      combineArray.map((map: any,) => {
        if (map.key && this.dynamicForm.get(map.key)) {
          this.dynamicForm.get(map.key).setValue(map.value)
        }
      })
    }
  }

}
