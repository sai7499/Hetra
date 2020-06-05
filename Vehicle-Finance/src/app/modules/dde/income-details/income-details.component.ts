import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { LabelsService } from 'src/app/services/labels.service';
import { IncomeDetailsService } from '@services/income-details.service';

@Component({
  selector: 'app-income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.css']
})
export class IncomeDetailsComponent implements OnInit {

  labels: any = {};
  incomeDetailsForm: FormGroup;
  otherDetailsForm: FormGroup;
  formData: any;
  getBuisinessIncomeId: any;
  applicantType = [];
  leadId: 61;
  userId: '1002';
  applicantDetails: any;
  ngApplicantId: any;
  patchPath = false;
  setPath = true;
  // applicantId: any;
  constructor(private route: Router, private labelsData: LabelsService,
    private formBuilder: FormBuilder, private incomeDetailsService: IncomeDetailsService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        // console.log(error);
      }
    );
    // this.getApplicantDetails();
    const body = {
      name: 'S',
      leadId: 606
    };
    this.incomeDetailsService.getAllAplicantDetails(body).subscribe((res: any) => {
      console.log(res);
      this.applicantDetails = res.ProcessVariables.applicantInfoObj;
      console.log(this.applicantDetails, 'getting form data resp');
    });
    this.incomeDetailsForm = this.formBuilder.group({
      // // businessIncomeDetails: this.formBuilder.array([this.getBusinessIncomeDetails()]),
      businessIncomeDetails: this.formBuilder.array([]),
      otherIncomeDetails: this.formBuilder.array([]),
      obligationDetails: this.formBuilder.array([]),
      leadId: 601,
      userId: '1002'

    });

    // this.getResponse();
    // console.log('getting form data resp',this.getResponse);
    this.getAllIncome();
    console.log(this.applicantDetails);

  }
  private getBusinessIncomeDetails(data?: any) {
    // console.log('data in side  function', data);
    if (data === undefined) {
      return this.formBuilder.group({

        applicantId: [],
        businessEnterpriseName: ['' || 'ABC Enterprises'],
        depreciation: Number(12),
        directorSalary: Number(3534),
        grossDerivedIncome: Number(33535),
        grossMonthlyIncome: Number(4543),
        netProfit: Number(45435),

      });

    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : null,
        applicantId: data.applicantId ? data.applicantId : null,
        businessEnterpriseName: data.businessEnterpriseName ? data.businessEnterpriseName : 'Abc Enterprises',
        depreciation: Number(data.depreciation ? data.depreciation : ''),
        directorSalary: Number(data.directorSalary ? data.directorSalary : ''),
        grossDerivedIncome: Number(data.grossDerivedIncome ? data.grossDerivedIncome : ''),
        grossMonthlyIncome: Number(data.grossMonthlyIncome ? data.grossMonthlyIncome : ''),
        netProfit: Number(data.netProfit ? data.netProfit : ''),
      });
    }

  }
  private getOtherIncomeDetails(data?: any) {
    //  // console.log('data in side  function', data);

    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: 902,
        incomeType: ['' || 'salary'],
        grossIncome: Number(52000),
        factoring: Number(25),
        factoredIncome: Number(25000)

      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : null,
        applicantId: Number(data.applicantId ? data.applicantId : ''),
        incomeType: data.incomeType ? data.incomeType : 'salaryType',
        grossIncome: Number(data.grossIncome ? data.grossIncome : ''),
        factoring: Number(data.factoring ? data.factoring : ''),
        factoredIncome: Number(data.factoredIncome ? data.factoredIncome : ''),

      });
      // }

    }
    //  parseNumber(data?: any) {
    //      console.log(typeof(data), ' inside parse number function');
    //      if (typeof(data) === 'string') {
    //       // tslint:disable-next-line: variable-name
    //       const number = parseInt(data);
    //       console.log(typeof(number), 'number parsing');
    //       return number;
    //      } else {
    //       return data;
    //      }
  }
  private getObligationDetails(data?: any) {

    if (data === undefined) {
      return this.formBuilder.group({

        applicantId: 901,
        // applicantTypeValue: ["" || "Applicant"],
        loanType: ['' || 'Business Loan'],
        financier: ['' || 'muthoot'],
        loanAmount: Number(25000),
        tenure: Number(12),
        mob: Number(32434),
        emi: Number(2344),
        balanceTenure: Number(234343),
        obligationAmount: Number(23456),


      });


    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : null,
        applicantId: 901,
        // applicantTypeValue: ["" || "Applicant"],
        loanType: data.loanType ? data.loanType : 'salary',
        financier: data.financier ? data.financier : 'financiar',
        loanAmount: Number(data.loanAmount ? data.loanAmount : ''),
        tenure: Number(data.tenure ? data.tenure : ''),
        mob: Number(data.mob ? data.mob : ''),
        emi: Number(data.emi ? data.emi : ''),
        balanceTenure: Number(data.balanceTenure ? data.balanceTenure : ''),
        obligationAmount: Number(data.obligationAmount ? data.obligationAmount : ''),

      });
    }
  }
  addIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    // console.log(data?.length,'income length');
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        control.push(this.getBusinessIncomeDetails(data[i]));
      }
    } else {
      control.push(this.getBusinessIncomeDetails());
    }
    // control.push(this.getBusinessIncomeDetails());


  }
  removeIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    if (control.controls.length > 1) {
      this.incomeDetailsService.softDeleteIncomeDetails(control.value).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);


      });
    } else {
      alert('Atleast One Row Required');
    }
  }

  addOtherUnit(data?: any) {
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    // console.log(data.length,'other length');
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getOtherIncomeDetails(data[i]));

      }
    } else {
      control.push(this.getOtherIncomeDetails());
    }
    //  control.push(this.getOtherIncomeDetails());
  }
  removeOtherIndex(i?: any) {

    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    // console.log(control.controls.length);
    if (control.controls.length > 1) {
      this.incomeDetailsService.softDeleteIncomeDetails(control.value).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);
      });
    } else {
      alert('Atleast One Row Required');
    }
  }
  addObligationUnit(data?: any) {
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getObligationDetails(data[i]));
      }
    } else {
      control.push(this.getObligationDetails());
    }
    // control.push(this.getObligationDetails());
  }
  removeObligationIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    // console.log(control.controls.length);
    if (control.controls.length > 1) {
      this.incomeDetailsService.softDeleteIncomeDetails(control.value).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);
      });
    } else {
      alert('Atleast One Row Required');
    }
  }
  // getResponse() {
  //   this.incomeDetailsService.setAllIncomeDetails(this.incomeDetailsForm.value).subscribe((res: any) => {
  //     // console.log(res);
  //     this.formData = res;
  //     console.log(this.formData , 'form daata');
  //     // this.addIncomeUnit(this.formData.ProcessVariables.businessIncomeList);
  //     // this.addOtherUnit(this.formData.ProcessVariables.otherIncomeList);
  //     this.addObligationUnit(this.formData.ProcessVariables.obligationsList);

  //   });
  // }

  getAllIncome() {
    const body = {
      leadId: 601
    };
    this.incomeDetailsService.getAllIncomeDetails(body).subscribe((res: any, ) => {
      // console.log(res.ProcessVariables.otherIncomeList, 'get other income details');
      this.addIncomeUnit(res.ProcessVariables.businessIncomeList);
      this.addOtherUnit(res.ProcessVariables.otherIncomeList);
      this.addObligationUnit(res.ProcessVariables.obligationsList);

    });

  }
  // onApplicantChange(i?: number) {
  //   console.log(this.ngApplicantId, ' ng applicant id');
  //   console.log(this.applicantDetails);
  //   console.log(this.applicantDetails.find(res => res.applicantId === this.ngApplicantId).applicantType);
  //   // tslint:disable-next-line: prefer-const
  //   let applicantId = this.applicantDetails.find(res => res.applicantId === this.ngApplicantId).applicantType;
  //   if (this.applicantType && this.applicantType[i] !== null || 'undefined') {
  //     this.applicantType[i] = applicantId;
  //     console.log(this.applicantType[i]);
  //   } else {
  //     this.applicantType.push(applicantId);
  //   }
  //   // console.log(applicantId);

  //   // console.log(this.applicantType, ' applicant array')

  // }
  onApplicantChange(event, i?: number){
    console.log(this.ngApplicantId ,' ng applicant type id')
    console.log(event)
    console.log(this.applicantDetails)
    let applicantId = this.applicantDetails.find(res=>res.applicantId == event.target[i].value).applicantType
    console.log(applicantId ,"applicant Id");
    
    if (this.applicantType && this.applicantType[i] !== null || 'undefined') {
      this.applicantType[i] = applicantId;
      console.log(this.applicantType[i]);
    } else {
      this.applicantType.push(applicantId);
    }
    console.log(applicantId);
    
    console.log(this.applicantType, ' applicant array')
     
      }
  // onApplicantChange(event, i ? : number); {
  //     console.log(this.ngApplicantId , ' ng applicant type id');
  //     console.log(event);
  //     console.log(this.applicantDetails);
  //     const applicantId = this.applicantDetails.find(res => res.applicantId === event.target[i].value).applicantType;
  //     console.log(applicantId , 'applicant Id');

  //     if (this.applicantType && this.applicantType[i] !== null || 'undefined') {
  //       this.applicantType[i] = applicantId;
  //       console.log(this.applicantType[i]);
  //     } else {
  //       this.applicantType.push(applicantId);
  //     }
  //     console.log(applicantId);

  //     console.log(this.applicantType, ' applicant array');

  //       }
  

  onSubmit() {

    console.log(this.incomeDetailsForm.value);
    // console.log(this.formData)
    // console.log(this.incomeDetailsForm.value.businessIncomeDetails.length);
    // this.incomeDetailsService.setAllIncomeDetails(this.incomeDetailsForm.value).subscribe((res: any, ) => {
    //   // console.log(res.ProcessVariables.businessIncomeIds, 'businessIncomeIds');
    //   console.log(res);
    // });

  }
}
