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
  formData: any;
  getBuisinessIncomeId: any;
  constructor(private route: Router, private labelsData: LabelsService, private formBuilder: FormBuilder, private incomeDetailsService: IncomeDetailsService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        // // console.log(this.labels)
      },
      error => {
        // // console.log(error);
      }
    );
    
    this.incomeDetailsForm = this.formBuilder.group({
      businessDetails: this.formBuilder.array([]),
      otherIncomeDetails: this.formBuilder.array([]),
      obligationDetails: this.formBuilder.array([]),
      leadId: 61,
      userId:1001

    });
    this.getResponse();
    // // console.log('getting form data resp',this.getResponse);
    
    
  }
  private getIncomeDetails(data?:any) {
    // // console.log('data in side  function', data);
    return this.formBuilder.group({
      // id: data.id ? data.id : 0,
      applicantName: [''],
      applicantType: [''], 
      businessEnterpriseName: data.businessEnterpriseName ? data.businessEnterpriseName : '',
      depreciation: data.depreciation ? data.depreciation : '',
      directorSalary: data.directorSalary ? data.directorSalary : '',
      grossDerivedIncome: data.grossDerivedIncome ? data.grossDerivedIncome : '',
      grossMonthlyIncome: data.grossMonthlyIncome ? data.grossMonthlyIncome : '',
      netProfit: data.netProfit ? data.netProfit : '',
      // id: [],
      // applicantName: ["" || "Arun"],
      // applicantType: ["" || "Applicant"],
      // businessEnterpriseName: ["" || "ABC Enterprises"],
      // depreciation: ["depreciation"],
      // directorSalary: [""],
      // grossDerivedIncome: [""],
      // grossMonthlyIncome: [""],
      // netProfit: ["" || "254000"],

    });
  }
  private getOtherIncomeDetails(data?:any) {
    //  // console.log('data in side  function', data);

    return this.formBuilder.group({

      applicantName: [""],
      applicantType: [""],
      incomeTypeValue: [""],
      grossIncome: data.grossIncome ? data.grossIncome : '',
      factoring: data.factoring ? data.factoring : '',
      factoredIncome: data.factoredIncome ? data.factoredIncome : '',

      // applicantName: ["" || "Kumar"],
      // applicantType: ["" || "Applicant"],
      // incomeTypeValue: ["" || "Salary"],
      // grossIncome: ["" || "254000"],
      // factoring: [""],
      // factoredIncome: [""]

    });
  }
  private getObligationDetails(data?:any) {
    return this.formBuilder.group({
      applicantName: ["" || "Kumar"],
      applicantTypeValue: ["" || "Applicant"],
      businessLoan: ["" || "Business Loan"],
      financier: ["" || "muthoot"],
      loanAmount: data.loanAmount ? data.loanAmount : '',
      tenure: data.tenure ? data.tenure : '',
      mob: data.mob ? data.mob : '',
      emi: data.emi ? data.emi : '',
      balanceTenure: data.balanceTenure ? data.balanceTenure : '',
      obligationAmount: data.obligationAmount ? data.obligationAmount : '',



    });
  }
  addIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls.businessDetails as FormArray;
    // // console.log(data.length,'income length');
    if(data.length > 0) {
      for(let i=0;i<data.length;i++){
        control.push(this.getIncomeDetails(data[i]));
      }
    } else {
control.push(this.getIncomeDetails());
    }
    
    
  }
  removeIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.businessDetails as FormArray;
    if (control.controls.length > 1) {
      this.incomeDetailsService.softDeleteIncomeDetails(control.value).subscribe((res: any, ) => {
        control.removeAt(i);
        // // console.log(res);

      })
    } else {
      alert("Atleast One Row Required");
    }
  }

  addOtherUnit(data?:any) {
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    // // console.log(data.length,'other length');
    if(data.length > 0) {
      for(let i=0;i<data.length;i++){
        control.push(this.getOtherIncomeDetails(data[i]));
      }
    } else {
control.push(this.getOtherIncomeDetails());
    }
  }
  removeOtherIndex(i?: any) {

    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    // // console.log(control.controls.length);
    if (control.controls.length > 1) {
      this.incomeDetailsService.softDeleteIncomeDetails(control.value).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);
      })
    } else {
      alert("Atleast One Row Required");
    }
  }
  addObligationUnit(data?:any) {
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    // console.log(data.length,'obligation length');
    if(data.length > 0) {
      for(let i=0;i<data.length;i++){
        control.push(this.getObligationDetails(data[i]));
      }
    } else {
control.push(this.getObligationDetails());
    }
  }
  removeObligationIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    // console.log(control.controls.length);
    if (control.controls.length > 1) {
      this.incomeDetailsService.softDeleteIncomeDetails(control.value).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);
      })
    }
    else {
      alert("Atleast One Row Required");
    }
  }
  getResponse() {
    this.incomeDetailsService.getAllIncomeDetails(this.incomeDetailsForm.value).subscribe((res: any ) => {
      // console.log(res);
      this.formData = res;
      this.addIncomeUnit(this.formData.ProcessVariables.businessIncomeList);
    this.addOtherUnit(this.formData.ProcessVariables.otherIncomeList);
      this.addObligationUnit(this.formData.ProcessVariables.obligationsList);

    })
  }
  

  onSubmit() {
    console.log(this.incomeDetailsForm.value,);
    // console.log(data)
    // if(this.)
    this.incomeDetailsService.getAllIncomeDetails(this.incomeDetailsForm.value).subscribe((res: any, ) => {
      // console.log(res);
      this.getBuisinessIncomeId = res.ProcessVariables.businessIncomeList.forEach(element => {
        // console.log(element.id);
        this.incomeDetailsService.setAllIncomeDetails(this.incomeDetailsForm.value).subscribe((res:any)=>{

// console.log(res);
// console.log(element.id);
 

        })
        
      });
      // console.log(this.getBuisinessIncomeId);
      

    })

  }
}
