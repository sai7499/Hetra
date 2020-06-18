import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute, } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';

import { LabelsService } from 'src/app/services/labels.service';
import { IncomeDetailsService } from '@services/income-details.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';

@Component({
  selector: 'app-income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.css'],
})
export class IncomeDetailsComponent implements OnInit {
  labels: any = {};
  incomeDetailsForm: FormGroup;
  otherDetailsForm: FormGroup;
  formData: any;
  getBuisinessIncomeId: any;
  otherApplicantType = [];
  leadId: number;
  userId: string;
  applicantDetails: any;
  ngApplicantId: any;
  patchPath = false;
  setPath = true;
  applicantResponse: any;
  applicantBusinessType = [];
  applicantObligayionType = [];
  businessApplicantId: number;
  otherId: number;
  incomeLov: any = [];
  array = [];
  applicantType: any;
  selectedOption: any;
  typeaheadNoResults: boolean;
  formValue: any;
  submitted = false;
  keyword = 'applicantName';
  getResults = new Array();
  constructor(
    private router: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private incomeDetailsService: IncomeDetailsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,


  ) {
   }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (data) => {
        this.labels = data;
      },
      (error) => { }
    );


    this.getLov();
    this.getLeadId();
    this.userId = localStorage.getItem('userId');

    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((res: any) => {
      this.applicantDetails = res.ProcessVariables.applicantListForLead;

    });
    this.incomeDetailsForm = this.formBuilder.group({
      businessIncomeDetails: this.formBuilder.array([]),
      otherIncomeDetails: this.formBuilder.array([]),
      obligationDetails: this.formBuilder.array([]),
      leadId: this.leadId,
      userId: this.userId,
    });
    this.getAllIncome();

  }




  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {

      this.incomeLov.incomeType = value.LOVS.incomeType;
      this.incomeLov.typeOfLoan = value.LOVS.typeOfLoan;
      this.incomeLov.vehicleFinanciers = value.LOVS.vehicleFinanciers;

    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {

        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);

        }
        resolve(null);
      });
    });
  }
  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      this.applicantDetails = processVariables.applicantListForLead;
    });
  }
  private getBusinessIncomeDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: ['', Validators.required],
        applicantType: [''],
        businessEnterpriseName: [''],
        depreciation: Number(null),
        directorSalary: Number(null),
        grossDerivedIncome: Number(null),
        grossMonthlyIncome: Number(null),
        netProfit: Number(null),
      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : 0,
       applicantId: Number(data.applicantId ? data.applicantId : ''),

        applicantType: data.applicantTypeValue ? data.applicantTypeValue : '',
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : '',
        businessEnterpriseName: data.businessEnterpriseName
          ? data.businessEnterpriseName
          : 'Abc Enterprises',
        depreciation: Number(data.depreciation ? data.depreciation : ''),
        directorSalary: Number(data.directorSalary ? data.directorSalary : ''),
        grossDerivedIncome: Number(
          data.grossDerivedIncome ? data.grossDerivedIncome : ''
        ),
        grossMonthlyIncome: Number(
          data.grossMonthlyIncome ? data.grossMonthlyIncome : ''
        ),
        netProfit: Number(data.netProfit ? data.netProfit : ''),
      });
    }
  }
  private getOtherIncomeDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: ['', Validators.required],
        applicantType: [''],
        incomeType: [''],
        grossIncome: Number(null),
        factoring: Number(null),
        factoredIncome: Number(null),
      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : 0,
        applicantId: Number(data.applicantId ? data.applicantId : ''),
        applicantType: data.applicantTypeValue ? data.applicantTypeValue : '',
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : '',
        incomeType: data.incomeType ? data.incomeType : '',
        grossIncome: Number(data.grossIncome ? data.grossIncome : ''),
        factoring: Number(data.factoring ? data.factoring : ''),
        factoredIncome: Number(data.factoredIncome ? data.factoredIncome : ''),
      });
    }
  }
  private getObligationDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: ['', Validators.required],
        applicantType: [''],
        loanType: [''],
        financier: [''],
        loanAmount: Number(null),
        tenure: Number(null),
        mob: Number(null),
        emi: Number(null),
        balanceTenure: Number(null),
        obligationAmount: Number(null),
      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : null,
        applicantId: Number(data.applicantId ? data.applicantId : ''),
        applicantType: data.applicantTypeValue ? data.applicantTypeValue : '',
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : '',
        loanType: data.loanType ? data.loanType : '',
        financier: data.financier ? data.financier : '',

        loanAmount: Number(data.loanAmount ? data.loanAmount : ''),
        tenure: Number(data.tenure ? data.tenure : ''),
        mob: Number(data.mob ? data.mob : ''),
        emi: Number(data.emi ? data.emi : ''),
        balanceTenure: Number(data.balanceTenure ? data.balanceTenure : ''),
        obligationAmount: Number(
          data.obligationAmount ? data.obligationAmount : ''
        ),
      });
    }
  }
  addBusinessIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getBusinessIncomeDetails(data[i]));
      }
    } else {
      control.push(this.getBusinessIncomeDetails());
    }
  }
  removeBusinessIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    const id = control.at(i).value.id;
    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined ) {
        control.removeAt(i);

      } else {
      const body = {
        userId: this.userId,
        aBusinessIncomeDetail: { id },
      };
      this.incomeDetailsService
        .softDeleteIncomeDetails(body)
        .subscribe((res: any) => {
          control.removeAt(i);
          alert(res.ProcessVariables.error.message);

        });
      }

    } else {
      alert('Atleast One Row Required');
    }
  }

  addOtherIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getOtherIncomeDetails(data[i]));
      }
    } else {
      control.push(this.getOtherIncomeDetails());
    }
  }
  removeOtherIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    const id = control.at(i).value.id;

    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined ) {
        control.removeAt(i);

      } else {
      const body = {
        userId: this.userId,
        otherIncomeDetail: { id },
      };
      this.incomeDetailsService
        .softDeleteIncomeDetails(body)
        .subscribe((res: any) => {
          control.removeAt(i);
          alert(res.ProcessVariables.error.message);

        });
      }

    } else {
      alert('Atleast One Row Required');
    }
  }
  addObligationUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getObligationDetails(data[i]));
      }
    } else {
      control.push(this.getObligationDetails());
    }
  }
  removeObligationIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    const id = control.at(i).value.id;
    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined ) {
        control.removeAt(i);

      } else {
      const body = {
        userId: this.userId,
        obligationDetail: { id },
      };
      this.incomeDetailsService
        .softDeleteIncomeDetails(body)
        .subscribe((res: any) => {
          control.removeAt(i);
          alert(res.ProcessVariables.error.message);

        });
      }
    } else {
      alert('Atleast One Row Required');
    }
  }

  getAllIncome() {
    const body = {
      leadId: this.leadId,
    };
    this.incomeDetailsService
      .getAllIncomeDetails(body)
      .subscribe((res: any) => {
        this.applicantResponse = res.ProcessVariables;
        this.addBusinessIncomeUnit(res.ProcessVariables.businessIncomeList);
        this.addOtherIncomeUnit(res.ProcessVariables.otherIncomeList);
        this.addObligationUnit(res.ProcessVariables.obligationsList);
      });
  }

  onBusinessApplicantChange(event?: any, i?: number) {

    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find((res) => res.applicantId == event).applicantType;
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    control.at(i).get('applicantType').setValue(applicantType);

  }

  onOtherApplicantChange(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find((res) => res.applicantId == event).applicantType;
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    control.at(i).get('applicantType').setValue(applicantType);
  }

  onObligationApplicantChange(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find((res) => res.applicantId == event).applicantType;
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    control.at(i).get('applicantType').setValue(applicantType);
  }


onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.incomeDetailsForm.invalid) {
      // return;
      alert('Select Applicant');
    } else {
      this.incomeDetailsService
        .setAllIncomeDetails(this.incomeDetailsForm.value)
        .subscribe((res: any) => {
          // tslint:disable-next-line: triple-equals
          if (res && res.ProcessVariables.error.code == '0') {
            // tslint:disable-next-line: prefer-const
            let businessControls =  this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
            businessControls.controls = [];
            const otherIncomeDetailsControls =  this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
            otherIncomeDetailsControls.controls = [];
            const obligationDetailsControls =  this.incomeDetailsForm.controls.obligationDetails as FormArray;
            obligationDetailsControls.controls = [];
            alert('saved Success');
            this.getAllIncome();
          }
        });
    }
  }
  addBusinessIncomeDetails() {
    alert('Business Income CAlculation');
  }

}


