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
  applicantResponse: any;
  applicantBusinessType = [];
  applicantObligayionType = [];
  businessApplicantId: number;
  otherId:number;
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

  }
  private getBusinessIncomeDetails(data?: any) {
    // console.log('data in side  function', data);
    if (data === undefined) {
      return this.formBuilder.group({

        applicantId: 1557,
        businessEnterpriseName: ['' || 'ABC Enterprises'],
        depreciation: Number(12),
        directorSalary: Number(3534),
        grossDerivedIncome: Number(33535),
        grossMonthlyIncome: Number(4543),
        netProfit: Number(45435),

      });

    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : 0,
        applicantId: data.applicantId ? data.applicantId : null,
        applicantType: data.applicantType ? data.applicantType : '',
        applicantTypeValue: data.applicantTypeValue ? data.applicantTypeValue : '',
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
        id: data.id ? data.id : 0,
        applicantId: Number(data.applicantId ? data.applicantId : ''),
        applicantType: data.applicantType ? data.applicantType : '',
        incomeType: data.incomeType ? data.incomeType : 'salaryType',
        grossIncome: Number(data.grossIncome ? data.grossIncome : ''),
        factoring: Number(data.factoring ? data.factoring : ''),
        factoredIncome: Number(data.factoredIncome ? data.factoredIncome : ''),

      });
    }
  }
  private getObligationDetails(data?: any) {

    if (data === undefined) {
      return this.formBuilder.group({

        applicantId: 1557,
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
        applicantId: Number(data.applicantId ? data.applicantId : ''),
        applicantType: data.applicantType ? data.applicantType : '',
        applicantTypeValue: data.applicantTypeValue ? data.applicantTypeValue : '',
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
        this.onBusinessChange(data[i].applicantType, i)


      }
    } else {
      control.push(this.getBusinessIncomeDetails());
    }
    // control.push(this.getBusinessIncomeDetails());


  }
  removeIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    if (control.controls.length > 1) {
      const body = {
        userId:"1001",
        aBusinessIncomeDetail:{"id":30763}
      };
      this.incomeDetailsService.softDeleteIncomeDetails(body).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);


      });
    } else {
      alert('Atleast One Row Required');
    }
  }

  addOtherUnit(data?: any) {
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    console.log(data);
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getOtherIncomeDetails(data[i]));
        this.onApplicantChange(data[i].applicantType, i)
      }
    } else {
      control.push(this.getOtherIncomeDetails());
    }
    //  control.push(this.getOtherIncomeDetails());
  }
  removeOtherIndex(i?: any) 
  {
 

    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    console.log(control);
    
    console.log(control.value.length);
    if (control.value.length > 1) {
      for (let i = control.value.length; i < control.value.length; --i) {
        this.otherId = control.value[i].id
        const body = {
          userId:"1001",
          
          otherIncomeDetail:{"id":this.otherId}
        };
        control.removeAt(i)

        this.incomeDetailsService.softDeleteIncomeDetails(body).subscribe((res: any, ) => {
          console.log(res);
  
        });
      }
     
      // this.incomeDetailsService.softDeleteIncomeDetails(body).subscribe((res: any, ) => {
      //   console.log(res);

      //   control.removeAt(i);
      // });
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
        this.onObligationChange(data[i].applicantType, i)

      }
    } else {
      control.push(this.getObligationDetails());
    }
    // control.push(this.getObligationDetails());
  }
  removeObligationIndex(i?: any,data?: any) {
    console.log(data);
    console.log(this.applicantResponse.obligationsList);
    
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    // console.log(control.controls.length);
    if (control.controls.length > 1) {
      const body = {
        userId:"1001",
        obligationDetail:{"id":this.applicantResponse.obligationsList.applicantId}
      };
      this.incomeDetailsService.softDeleteIncomeDetails(body).subscribe((res: any, ) => {
        control.removeAt(i);
        // console.log(res);
      });
    } else {
      alert('Atleast One Row Required');
    }
  }

  getAllIncome() {
    const body = {
      leadId: 601
    };
    this.incomeDetailsService.getAllIncomeDetails(body).subscribe((res: any, ) => {
      this.applicantResponse = res.ProcessVariables;
      // console.log(res.ProcessVariables.otherIncomeList, 'get other income details');
      this.addIncomeUnit(res.ProcessVariables.businessIncomeList);
      this.addOtherUnit(res.ProcessVariables.otherIncomeList);
      this.addObligationUnit(res.ProcessVariables.obligationsList);
      this.removeIncomeIndex( res.ProcessVariables.businessIncomeList);  
this.removeObligationIndex(res.ProcessVariables.obligationsList);
this.removeOtherIndex(res.ProcessVariables.otherIncomeList);


    });

  }
  onBusinessChange(event, i?: number) {
    console.log(event);
    console.log(this.applicantResponse.businessIncomeList);
    // let businessApplicanList = this.applicantResponse.businessIncomeList;
    // let applicantType = this.applicantDetails.filter((res) => res.applicantId == event)[0]['applicantTypeValue'];
    // console.log(applicantType, "applicant Id");
    // const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    // console.log("getting value for control ",control );
    // control.at(i).get("applicantType").setValue(applicantType)
    console.log(event);
    console.log(this.applicantResponse.businessIncomeList);

    let applicantId = this.applicantResponse.businessIncomeList.find((res) => res.applicantType === event).applicantTypeValue
    console.log(applicantId, "applicant Id");


    if (this.applicantBusinessType && this.applicantBusinessType[i] !== null || 'undefined') {
      this.applicantBusinessType[i] = applicantId;
      console.log(this.applicantBusinessType[i]);
    } else {
      this.applicantBusinessType.push(applicantId);
    }
    console.log(applicantId);

    console.log(this.applicantType, ' applicant array')
  }

  onApplicantChange(event, i?: number) {

    console.log(event)
    console.log(this.applicantDetails)
    let applicantId = this.applicantResponse.otherIncomeList.find((res) => res.applicantType === event).applicantTypeValue
    console.log(applicantId, "applicant Id");

    if (this.applicantType && this.applicantType[i] !== null || 'undefined') {
      this.applicantType[i] = applicantId;
      console.log(this.applicantType[i]);
    } else {
      this.applicantType.push(applicantId);
    }
    // console.log(applicantId);

    // console.log(this.applicantType, ' applicant array')

  }

  onObligationChange(event, i?: number) {
    console.log(event);
    console.log(this.applicantResponse.businessIncomeList);

    let applicantId = this.applicantResponse.otherIncomeList.find((res) => res.applicantType === event).applicantTypeValue
    console.log(applicantId, "applicant Id");


    if (this.applicantObligayionType && this.applicantObligayionType[i] !== null || 'undefined') {
      this.applicantObligayionType[i] = applicantId;
      console.log(this.applicantObligayionType[i]);
    } else {
      this.applicantObligayionType.push(applicantId);
    }
    console.log(applicantId);

    console.log(this.applicantType, ' applicant array')
  }

  onSubmit() {

    console.log(this.incomeDetailsForm.value);
    // console.log(this.formData)
    // console.log(this.incomeDetailsForm.value.businessIncomeDetails.length);
    this.incomeDetailsService.setAllIncomeDetails(this.incomeDetailsForm.value).subscribe((res: any, ) => {
      // console.log(res.ProcessVariables.businessIncomeIds, 'businessIncomeIds');
      console.log(res);
    });

  }
}
