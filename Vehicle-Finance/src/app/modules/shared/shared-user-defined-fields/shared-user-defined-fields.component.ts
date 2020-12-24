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
  udfArray: any
  screenId: any;
  groupId: any;
  @Input() set udfScreenId(value) {
    this.screenId = value;
    this.getOnInit();
    this.getLOV();
  }
  @Input() set udfGroupId(value) {
    this.groupId = value;
    this.getOnInit();
    this.getLOV();
  }
  @Input() set udfDetails(value) {
    this.udfArray = value;
    this.getOnInit();
    this.getLOV();
  }

  @Input() isDirty: boolean;

  screenUdfMapping: any;
  labels: any = {};
  dynamicForm: FormGroup;

  @Output() saveUserdefined = new EventEmitter();
  LOV: any;

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private collateralDataStoreService: CollateralDataStoreService,
    private commomLovService: CommomLovService) { }

  ngOnInit() {

  }

  getOnInit() {
    this.screenUdfMapping = this.collateralDataStoreService.findScreenField(this.screenId);

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
      udfScreenId: this.screenId
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
    //this.getLOV()
    // this.getOnInit();
    // this.getUserDefinedForm()
  }

  getUserDefinedForm() {
    let udfDetails = {
      groupScreenID: this.groupId,
      udfData: this.dynamicForm
    }
    this.saveUserdefined.emit(udfDetails);
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));

    if (this.udfArray && this.udfArray.length > 0 && this.screenUdfMapping) {

      this.groupId = this.udfArray[0].groupScreenID;

      if (this.udfArray[0].udfData) {
        let patchJsonValue = JSON.parse(this.udfArray[0].udfData)
        let keys = Object.keys(patchJsonValue);
        let values = Object.values(patchJsonValue);

        for (let i = 0; i < keys.length; i++) {
          if (keys[i]) {
            if (this.dynamicForm.get(keys[i])) {
              this.dynamicForm.get(keys[i]).setValue(values[i])
            } else {
              let fc = this._fb.control(values[i])
              this.dynamicForm.addControl(keys[i], fc)
            }
          }
        }
      }
    }
  }

}