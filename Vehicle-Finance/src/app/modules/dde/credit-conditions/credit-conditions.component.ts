import { Component, OnInit } from '@angular/core';
import { LabelsService } from '../../../services/labels.service';
import { FormBuilder, FormArray, FormGroup ,Validators } from "@angular/forms";

@Component({
  selector: 'app-credit-conditions',
  templateUrl: './credit-conditions.component.html',
  styleUrls: ['./credit-conditions.component.css']
})
export class CreditConditionsComponent implements OnInit {
  labels: any = {};
  creditConditionForm: FormGroup;
  userType: string = "credit";
  constructor(
    public labelsService: LabelsService,
    private formBuilder: FormBuilder
  ) { }
  addOtherUnit() {
    const control = this.creditConditionForm.controls.creditConditionControls as FormArray;
    control.push(this.getcreditConditionControls());
  }
  removeOtherIndex(i?: any) {
    const control = this.creditConditionForm.controls.creditConditionControls as FormArray;
    console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert("Atleast One Row Required");
    }
  }
  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
      console.log(this.labels.creditCondition);
    })
  }
  getcreditConditionControls(){
    if(this.userType == 'credit'){
      return this.formBuilder.group({
        creditConditionResponce: [{value : "" , disabled: false }],
        salesResponse: [{value : "" , disabled: true }],
        salesResponseDoc: [""],
        action: [""],
        dateTimePicker: [""]
      });
    } else {
      return this.formBuilder.group({
        creditConditionResponce: [{value : "" , disabled: true }],
        salesResponse: [{value : "" , disabled: false }],
        salesResponseDoc: [""],
        action: [""],
        dateTimePicker: [""]
      });
    }
    
  }

  ngOnInit() {
    this.getLabelData();
    this.creditConditionForm =  this.formBuilder.group({
      creditConditionControls: this.formBuilder.array([this.getcreditConditionControls()])
    });
  }

}
