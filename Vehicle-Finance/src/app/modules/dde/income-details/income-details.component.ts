import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";

import { LabelsService } from "src/app/services/labels.service";
import { IncomeDetailsService } from '@services/income-details.service';

@Component({
  selector: "app-income-details",
  templateUrl: "./income-details.component.html",
  styleUrls: ["./income-details.component.css"]
})
export class IncomeDetailsComponent implements OnInit {
  labels: any = {};
  incomeDetailsForm: FormGroup;
  otherDetailsForm: FormGroup;

  constructor(private route: Router, private labelsData: LabelsService, private formBuilder: FormBuilder, private incomeDetailsService: IncomeDetailsService ) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );
    this.incomeDetailsForm = this.formBuilder.group({
      businessDetails: this.formBuilder.array([this.getIncomeDetails()]),
      otherIncomeDetails: this.formBuilder.array([this.getOtherIncomeDetails()]),
      obligationDetails: this.formBuilder.array([this.getObligationDetails()]),
      leadId : 61,

    });
  }
  private getIncomeDetails() {
    return this.formBuilder.group({
      applicantName: ["" || "Arun"],
      applicantType: ["" || "Applicant"],
      businessEnterpriseName: ["" || "ABC Enterprises"],
      depreciation: [""],
      directorSalary: [""],
      grossDerivedIncome: [""],
      grossMonthlyIncome: [""],
      netProfit: ["" || "254000"],


    });
  }
  private getOtherIncomeDetails() {
    return this.formBuilder.group({
      applicantName: ["" || "Arun"],
      applicantType: ["" || "Applicant"],
      incomeTypeValue: ["" || "Salary"],
      grossIncome: ["" || "254000"],
      factoring: [""],
      factoredIncome: [""]

    });
  }
  private getObligationDetails() {
    return this.formBuilder.group({
      applicantName: ["" || "Kumar"],
      applicantTypeValue: ["" || "Applicant"],
      businessLoan: ["" || "Business Loan"],
      financier: ["" || "muthoot"],
      loanAmount: ["" || "150000"],
      tenure: ["" || "24"],
      mob: ["" || "10"],
      emi: ["" || "7931"],
      balanceTenure: ["" || "14"],
      obligationAmount: ["" || "7931"]
    
    

    });
  }
  addIncomeUnit() {
    const control = this.incomeDetailsForm.controls.businessDetails as FormArray;
    control.push(this.getIncomeDetails());
  }
  removeIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.businessDetails as FormArray;
    console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert("Atleast One Row Required");
    }
  }

  addOtherUnit() {
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    control.push(this.getOtherIncomeDetails());
  }
  removeOtherIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert("Atleast One Row Required");
    }
  }
  addObligationUnit() {
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    control.push(this.getObligationDetails());
  }
  removeObligationIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert("Atleast One Row Required");
    }
  }
  onSubmit() {
    console.log(this.incomeDetailsForm.value);
  //   this.incomeDetailsService.setIncomeDetails(this.incomeDetailsForm.value).subscribe((res: any) => {
  //     console.log(res);
  //     alert(JSON.stringify(res));
  // });
  this.incomeDetailsService.setTransactionDetails(this.incomeDetailsForm.value).subscribe((res:any)=>{
    console.log(res);

  })
  }
}
