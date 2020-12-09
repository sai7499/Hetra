import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-common-fields',
  templateUrl: './common-fields.component.html',
  styleUrls: ['./common-fields.component.css']
})
export class CommonFieldsComponent implements OnInit {

  dynamicFormGroup: FormGroup;
  commonFieldJson: any;
  arrayItems: any = [];

  constructor(private labelsData: LabelsService, private _fb: FormBuilder) { }

  ngOnInit() {

    this.dynamicFormGroup = this._fb.group({
      dynamicFormArray: this._fb.array([])
    })

    this.labelsData.getCommonFieldDate().subscribe((commonField: any) => {
      console.log(commonField, 'commonField')
      this.commonFieldJson = commonField;
      this.arrayItems = commonField.udfFields ? commonField.udfFields : [];

      const formArray = (this.dynamicFormGroup.get('dynamicFormArray') as FormArray);
      let details = formArray.at(0) as FormGroup;

      this.arrayItems.map((control: any) => {
        let fc = control.mandatory && control.mandatory === true ? this._fb.control('', Validators.required)
          : this._fb.control('');

          this.dynamicFormGroup.addControl(control.name, fc)
      })
    })


  }

}