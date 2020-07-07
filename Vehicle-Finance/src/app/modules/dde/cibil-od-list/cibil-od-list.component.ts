import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-cibil-od-list',
  templateUrl: './cibil-od-list.component.html',
  styleUrls: ['./cibil-od-list.component.css']
})
export class CibilOdListComponent implements OnInit {
  labels: any;
  odDetailsForm: FormGroup;
  odDetailsList:FormGroup;
  loanEnquiryInThirtyDays:FormGroup;
  constructor(private labelService: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,

    ) { }

  ngOnInit() {
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.odDetailsForm = this.formBuilder.group({
      odDetailsList: this.formBuilder.array([this.getodListDetails()]),
      loanEnquiryInThirtyDays : this.formBuilder.array([this.getLoanEnquiryInThirtyDays()]),
      loanEnquiryInSixtyDays : this.formBuilder.array([this.getLoanEnquiryInSixtyDays()]),

    });
    this.getLov();
  }
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
console.log(value)

    });
  }
  private getodListDetails() {
    
      return this.formBuilder.group({
        odType : [""],
        odAmount:[""],
        typeOfLoan:[""],
        otherTypeOfloan:[""],
        odDpd:[""],
      });
    
     
  }
  addOdDetails() {
    const control = this.odDetailsForm.controls
      .odDetailsList as FormArray;
      control.push(this.getodListDetails());
   
  }
  removeOdDetails(i?: any) {
    const control = this.odDetailsForm.controls
      .odDetailsList as FormArray;
    const id = control.at(i).value.id;
    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
        control.removeAt(i);
      } 
     
     
  }
  private getLoanEnquiryInThirtyDays() {
    return this.formBuilder.group({
    member:[""],
    enquiryDate:[""],
    typeOfLoan:[""],
    enquiryAmount:[""],
    });
  }
  addLastThirtyDaysLoan() {
    const control = this.odDetailsForm.controls
      .loanEnquiryInThirtyDays as FormArray;
      control.push(this.getodListDetails());
  }
  removeLastThirtyDaysLoan(i?: any) {
    const control = this.odDetailsForm.controls
      .loanEnquiryInThirtyDays as FormArray;
    const id = control.at(i).value.id;
    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
        control.removeAt(i);
      } 
  }
  private getLoanEnquiryInSixtyDays() {
    return this.formBuilder.group({
    member:[""],
    enquiryDate:[""],
    typeOfLoan:[""],
    enquiryAmount:[""],
    });
  }
  addLastSixtyDaysLoan() {
    const control = this.odDetailsForm.controls
      .loanEnquiryInSixtyDays as FormArray;
      control.push(this.getodListDetails());
  }
  removeLastSixtyDaysLoan(i?: any) {
    const control = this.odDetailsForm.controls
      .loanEnquiryInSixtyDays as FormArray;
    const id = control.at(i).value.id;
    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
        control.removeAt(i);
      } 
  }
}
