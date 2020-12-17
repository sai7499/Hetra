import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollateralDataStoreService } from '@services/collateral-data-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-shared-user-defined-fields',
  templateUrl: './shared-user-defined-fields.component.html',
  styleUrls: ['./shared-user-defined-fields.component.css']
})
export class SharedUserDefinedFieldsComponent implements OnInit, OnChanges {

  @Input() udfScreenId: any;
  @Input() udfGroupId: any;
  @Input() udfDetails: any;
  @Input() isDirty: boolean;

  screenUdfMapping: any;
  labels: any = {};
  dynamicForm: FormGroup;

  @Output() saveUserdefined = new EventEmitter();
  LOV: any;

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private collateralDataStoreService: CollateralDataStoreService,
    private commomLovService: CommomLovService) { }

  ngOnInit() {
    this.screenUdfMapping = this.collateralDataStoreService.findScreenField(this.udfScreenId)

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log('error', error)
      });
    this.initForm();
  }

  initForm() {

    this.dynamicForm = this._fb.group({
      udfScreenId: this.udfScreenId
    })

    if (this.screenUdfMapping && this.screenUdfMapping.fields.length > 0) {
      this.screenUdfMapping.fields.map((control: any) => {
        let fc = control.mandatory && control.mandatory === true ? this._fb.control('', Validators.required)
          : this._fb.control('');

        this.dynamicForm.addControl(control.name, fc)
      })
    }
    this.getUserDefinedForm()

  }

  ngOnChanges() {
    this.getLOV()
  }

  getUserDefinedForm() {
    let udfDetails = {
      groupScreenID: this.udfGroupId,
      udfData: this.dynamicForm
    }
    this.saveUserdefined.emit(udfDetails);
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));

    if (this.udfDetails && this.udfDetails.length > 0 && this.screenUdfMapping) {

      this.udfGroupId = this.udfDetails[0].groupScreenID;

      if (this.udfDetails[0].udfData) {
        let patchJsonValue = JSON.parse(this.udfDetails[0].udfData)
        let keys = Object.keys(patchJsonValue);
        let values = Object.values(patchJsonValue);

        for (let i = 0; i < keys.length; i++) {
          if (keys[i]) {
            if (this.dynamicForm.get(keys[i])) {
              this.dynamicForm.get(keys[i]).setValue(values[i])
            } else{
              let fc = this._fb.control(values[i])
              this.dynamicForm.addControl(keys[i], fc)
            }
          }
        }
      }
    }
  }

}
