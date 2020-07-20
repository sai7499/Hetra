import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { LabelsService } from 'src/app/services/labels.service';
import { IncomeDetailsService } from '@services/income-details.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToasterService } from '@services/toaster.service';

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
  totalObligation: void;
  totalObligationAmount = 0;
  totalBusinessIncomeAmount = 0;
  totalMonthlySalaryIncome = 0;
  totalMonthlyRentalIncome = 0;
  totalMonthlyPensionIncome = 0;
  totalMonthlyAgriIncome = 0;
  totalMonthlyOtherIncome = 0;
  totalSalariedFOIR = 0;
  totalMonthlyOtherIncomeOfOthers = 0;
  otherArray = [];
  salArray = [];
  rentArray = [];
  pensionArray = [];
  agriArray = [];
  productCode: string;
  incomeTypeResponse: any;
  inputValidation = {
    rule: '^[0-9]*$',
    msg: 'Enter Digits Only',
  };
  inputLength10 = {
    rule: 10,
  };
  inputLength3 = {
    rule: 3,
  };
  inputLength30 = {
    rule: 30,
  };
  namePattern = {
    rule: '^[A-Z, ]*[a-z, ]*[0-9, ]*$',
    msg: 'Invalid Name',
  };
  salariedFOIRasperPolicy: number;
  isDirty: boolean;
  incomeTypeValue: any;
  SalariedFOIRDeviation: number;

  constructor(
    private router: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private incomeDetailsService: IncomeDetailsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService
  ) { }

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
      salariedFOIRasperPolicy: Number(70),
      salariedFOIRDeviation: [
        null,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      leadId: this.leadId,
      userId: this.userId,
    });
    this.salariedFOIRasperPolicy = 70;
    const leadData = this.createLeadDataService.getLeadSectionData();
    const leadSectionData = leadData as any;
    this.productCode = leadSectionData.leadDetails['productCatCode'];
    const incomeData = {
      productCode: this.productCode,
    };
    this.incomeDetailsService.getFactoringValue(incomeData).subscribe((res: any) => {
      this.incomeTypeResponse = res.ProcessVariables['factoringList'];
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
        depreciation: [
          null,
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        directorSalary: [
          null,
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        grossDerivedIncome: Number(null),
        grossMonthlyIncome: Number(null),
        netProfit: [
          null,
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.maxLength(10),
          ],
        ],
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
        depreciation: Number(data.depreciation ? data.depreciation : 0),
        directorSalary: Number(data.directorSalary ? data.directorSalary : 0),
        grossDerivedIncome: Number(
          data.grossDerivedIncome ? data.grossDerivedIncome : 0
        ),
        grossMonthlyIncome: Number(
          data.grossMonthlyIncome ? data.grossMonthlyIncome : 0
        ),
        netProfit: Number(data.netProfit ? data.netProfit : 0),
      });
    }
  }
  private getOtherIncomeDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: ['', Validators.required],
        applicantType: [''],
        incomeType: [''],
        grossIncome: [
          null,
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
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
        loanAmount: [
          null,
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        tenure: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
        mob: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
        emi: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
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
        this.onIncome(null, i);
      }
    } else {
      control.push(this.getBusinessIncomeDetails());
    }
  }
  removeBusinessIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    const id = control.at(i).value.id;
    if (control.controls.length > 1) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        control.removeAt(i);
        this.onIncome(null,i)
      } else {
        const body = {
          userId: this.userId,
          aBusinessIncomeDetail: { id },
        };
        this.incomeDetailsService
          .softDeleteIncomeDetails(body)
          .subscribe((res: any) => {
            control.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
        this.onIncome(null,i)

          });
      }
    } else {
      this.toasterService.showError('Atleast One Row Required', '');
    }
  }

  addOtherIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getOtherIncomeDetails(data[i]));
        this.getOtherFactoredIncome(i);
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
      if (id == undefined) {
        control.removeAt(i);
        this.getOtherFactoredIncome(i);
      } else {
        const body = {
          userId: this.userId,
          otherIncomeDetail: { id },
        };
        this.incomeDetailsService
          .softDeleteIncomeDetails(body)
          .subscribe((res: any) => {
            control.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
        this.getOtherFactoredIncome(i);

          });
      }
    } else {
      this.toasterService.showError('Atleast One Row Required', '');
    }
  }
  addObligationUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getObligationDetails(data[i]));
        this.onEmi(null, i);
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
      if (id == undefined) {
        control.removeAt(i);
        this.onEmi(null, i);

      } else {
        const body = {
          userId: this.userId,
          obligationDetail: { id },
        };
        this.incomeDetailsService
          .softDeleteIncomeDetails(body)
          .subscribe((res: any) => {
            control.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.onEmi(null, i);

          });
      }
    } else {
      this.toasterService.showError('Atleast One Row Required', '');
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
        console.log(this.applicantResponse);

        this.incomeDetailsForm.patchValue({
          salariedFOIRDeviation: this.applicantResponse.salariedFOIRDeviation,
        });
        this.addBusinessIncomeUnit(res.ProcessVariables.businessIncomeList);
        this.addOtherIncomeUnit(res.ProcessVariables.otherIncomeList);
        this.addObligationUnit(res.ProcessVariables.obligationsList);
        this.onSalFoirDeviation(this.applicantResponse.salariedFOIRDeviation);
      });
  }

  onBusinessApplicantChange(event?: any, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    const control = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    control.at(i).get('applicantType').setValue(applicantType);
  }

  onOtherApplicantChange(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    control.at(i).get('applicantType').setValue(applicantType);
  }

  onObligationApplicantChange(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    control.at(i).get('applicantType').setValue(applicantType);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.incomeDetailsForm.invalid) {
      this.toasterService.showError(
        'Mandatory Fields Missing Or Invalid Pattern Detected',
        'Income Details'
      );
      return;
    } else {
      const businessControl = this.incomeDetailsForm.controls
        .businessIncomeDetails as FormArray;
      for (let i = 0; i < businessControl.length; i++) {
        const depreciation = (businessControl.at(i).get('depreciation').value);
        businessControl.at(i).get('depreciation').setValue(depreciation.toString());
        const directorSalary = businessControl.at(i).get('directorSalary').value;
        businessControl.at(i).get('directorSalary').setValue(directorSalary.toString());
        const netProfit = businessControl.at(i).get('netProfit').value;
        businessControl.at(i).get('netProfit').setValue(netProfit.toString());
        businessControl.at(i).get('grossDerivedIncome').setValue(
          businessControl.at(i).get('grossDerivedIncome').value.toString());
        businessControl.at(i).get('grossMonthlyIncome').setValue(
          businessControl.at(i).get('grossMonthlyIncome').value.toString());
        businessControl.at(i).get('applicantId').setValue(
          Number(businessControl.at(i).get('applicantId').value));
      }
      const otherIncomeControl = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      for (let i = 0; i < otherIncomeControl.length; i++) {
        const grossIncome = otherIncomeControl.at(i).get('grossIncome').value;
        otherIncomeControl.at(i).get('grossIncome').setValue(grossIncome.toString());
        otherIncomeControl.at(i).get('factoredIncome').setValue(
          otherIncomeControl.at(i).get('factoredIncome').value.toString());
        otherIncomeControl.at(i).get('applicantId').setValue(
          Number(otherIncomeControl.at(i).get('applicantId').value))
      }
      const obligationControl = this.incomeDetailsForm.controls
        .obligationDetails as FormArray;
      for (let i = 0; i < obligationControl.length; i++) {
        const loanAmount = obligationControl.at(i).get('loanAmount').value;
        obligationControl.at(i).get('loanAmount').setValue(loanAmount.toString());
        const tenure = Number(obligationControl.at(i).get('tenure').value);
        obligationControl.at(i).get('tenure').setValue(tenure);
        const mob = Number(obligationControl.at(i).get('mob').value);
        obligationControl.at(i).get('mob').setValue(mob);
        const emi = Number(obligationControl.at(i).get('emi').value);
        obligationControl.at(i).get('emi').setValue(emi);
        obligationControl.at(i).get('obligationAmount').setValue(
          obligationControl.at(i).get('obligationAmount').value.toString());
        obligationControl.at(i).get('applicantId').setValue(
          Number(obligationControl.at(i).get('applicantId').value));
      }
      const salaryContol = this.incomeDetailsForm.controls
        .salariedFOIRDeviation as FormControl;
      const salariedFOIRDeviation = Number(salaryContol.value);
      salaryContol.setValue(salariedFOIRDeviation);

      this.incomeDetailsService
        .setAllIncomeDetails(this.incomeDetailsForm.value)
        .subscribe((res: any) => {
          // tslint:disable-next-line: triple-equals
          if (res && res.ProcessVariables.error.code == '0') {
            // tslint:disable-next-line: prefer-const
            let businessControls = this.incomeDetailsForm.controls
              .businessIncomeDetails as FormArray;
            businessControls.controls = [];
            const otherIncomeDetailsControls = this.incomeDetailsForm.controls
              .otherIncomeDetails as FormArray;
            otherIncomeDetailsControls.controls = [];
            const obligationDetailsControls = this.incomeDetailsForm.controls
              .obligationDetails as FormArray;
            obligationDetailsControls.controls = [];

            this.toasterService.showSuccess(
              'Applicant Income Details Saved Successfully',
              'Income Details'
            );
            this.getAllIncome();
          }
        });
    }
  }

  appendFactoredIncome(event: any, i: number) {
    if (event === this.incomeTypeResponse[0].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      incomeArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[0].factoring });
    } else if (event === this.incomeTypeResponse[1].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      incomeArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[1].factoring });
    } else if (event === this.incomeTypeResponse[2].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      incomeArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[2].factoring });
    } else if (event === this.incomeTypeResponse[3].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      incomeArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[3].factoring });
    } else if (event === this.incomeTypeResponse[4].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      incomeArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[4].factoring });
    }
    this.getOtherIncomeDetails(i);
  }
  getOtherFactoredIncome(i: number) {
    const incomeArray = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    const factoringPerc = incomeArray.at(i).value.factoring;
    const grossIncome = incomeArray.at(i).value.grossIncome;
    const value = Math.round(grossIncome * (factoringPerc / 100));
    incomeArray.at(i).patchValue({ factoredIncome: value });

    if (incomeArray.at(i).value.incomeType === 'SALRINCTYP') {
      if (incomeArray && incomeArray.length > 0) {
        this.totalMonthlySalaryIncome = 0;
        for (let i = 0; i < incomeArray.length; i++) {
          if (incomeArray.at(i).value.incomeType === 'SALRINCTYP') {
            this.totalMonthlySalaryIncome = Math.round(
              this.totalMonthlySalaryIncome +
              incomeArray.value[i].factoredIncome
            );
            this.salArray.push(this.totalMonthlySalaryIncome);
          }
        }
      }
    }
    if (incomeArray.at(i).value.incomeType === 'RENINCTYP') {
      if (incomeArray && incomeArray.length > 0) {
        this.totalMonthlyRentalIncome = 0;
        for (let i = 0; i < incomeArray.length; i++) {
          if (incomeArray.at(i).value.incomeType === 'RENINCTYP') {
            this.totalMonthlyRentalIncome = Math.round(
              this.totalMonthlyRentalIncome +
              incomeArray.value[i].factoredIncome
            );
            this.rentArray.push(this.totalMonthlyRentalIncome);
          }
        }
      }
    }
    if (incomeArray.at(i).value.incomeType === 'PENINCTYP') {
      if (incomeArray && incomeArray.length > 0) {
        this.totalMonthlyPensionIncome = 0;
        for (let i = 0; i < incomeArray.length; i++) {
          if (incomeArray.at(i).value.incomeType === 'PENINCTYP') {
            this.totalMonthlyPensionIncome = Math.round(
              this.totalMonthlyPensionIncome +
              incomeArray.value[i].factoredIncome
            );
            this.pensionArray.push(this.totalMonthlyPensionIncome);
          }
        }
      }
    }
    if (incomeArray.at(i).value.incomeType === 'AGRIINCINCTYP') {
      if (incomeArray && incomeArray.length > 0) {
        this.totalMonthlyAgriIncome = 0;
        for (let i = 0; i < incomeArray.length; i++) {
          if (incomeArray.at(i).value.incomeType === 'AGRIINCINCTYP') {
            this.totalMonthlyAgriIncome = Math.round(
              this.totalMonthlyAgriIncome + incomeArray.value[i].factoredIncome
            );
            this.agriArray.push(this.totalMonthlyAgriIncome);
          }
        }
      }
    }
    if (incomeArray.at(i).value.incomeType === 'OTHRINCTYP') {
      if (incomeArray && incomeArray.length > 0) {
        this.totalMonthlyOtherIncomeOfOthers = 0;
        for (let i = 0; i < incomeArray.length; i++) {
          if (incomeArray.at(i).value.incomeType === 'OTHRINCTYP') {
            this.totalMonthlyOtherIncomeOfOthers = Math.round(
              this.totalMonthlyOtherIncomeOfOthers + incomeArray.value[i].factoredIncome
            );
            this.otherArray.push(this.totalMonthlyOtherIncomeOfOthers);
          }
        }
      }
    }

    if (incomeArray && incomeArray.length > 0) {
      this.totalMonthlyOtherIncome = 0;
      for (let i = 0; i < incomeArray.length; i++) {
        this.totalMonthlyOtherIncome = Math.round(
          this.totalMonthlyOtherIncome + incomeArray.value[i].factoredIncome
        );
      }
    }
    // const factoringPerc = incomeArray.at(i).value.factoring;
    // const grossIncome = incomeArray.at(i).value.grossIncome;
    // const value = Math.round(grossIncome * (factoringPerc / 100));
    // incomeArray.at(i).patchValue({ factoredIncome: value });
  }

  onTenure(event: any, i: number) {
    let tenure = 0;
    let mob = 0;
    const obligationArray = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    tenure = Number(obligationArray.value[i].tenure);

    mob = Number(obligationArray.value[i].mob);

    if (tenure < mob) {
      this.toasterService.showError('Mob should not exceed tenure', '');
      obligationArray.at(i).patchValue({ mob: 0 });
      obligationArray.at(i).patchValue({ balanceTenure: tenure });
    } else {
      const balanceTenor = Math.abs(Number(tenure) - Number(mob));

      obligationArray.at(i).patchValue({ balanceTenure: balanceTenor });
    }
  }
  onEmi(event: any, i: number) {
    const obligationArray = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    // const emi = obligationArray.value[i].emi;
    // const obligationAmount = emi;
    // obligationArray.at(i).patchValue({ obligationAmount });
    if (obligationArray && obligationArray.length > 0) {
      this.totalObligationAmount = 0;
      for (let i = 0; i < obligationArray.length; i++) {
        this.totalObligationAmount = Math.round(
          this.totalObligationAmount + Number(obligationArray.value[i].emi)

        );
        const emi = obligationArray.value[i].emi;
        const obligationAmount = emi;
        obligationArray.at(i).patchValue({ obligationAmount });
      }
    }
  }
  onIncome(event: any, i: number) {
    const businessIncomeArray = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    // const netProfit = businessIncomeArray.value[i].netProfit;
    // const depreciation = businessIncomeArray.value[i].depreciation;
    // const directorSalary = businessIncomeArray.value[i].directorSalary;

    // const grossDerivedIncome = Math.round(
    //   Number(netProfit * 3) + Number(depreciation) + Number(directorSalary)
    // );
    // businessIncomeArray.at(i).patchValue({ grossDerivedIncome });
    // const grossMonthlyIncome = Math.round(grossDerivedIncome / 12);
    // businessIncomeArray.at(i).patchValue({ grossMonthlyIncome });
    if (businessIncomeArray && businessIncomeArray.length > 0) {
      this.totalBusinessIncomeAmount = 0;
      for (let i = 0; i < businessIncomeArray.length; i++) {
        this.totalBusinessIncomeAmount = Math.round(
          this.totalBusinessIncomeAmount +
          businessIncomeArray.value[i].grossMonthlyIncome
        );
      }
      const netProfit = businessIncomeArray.value[i].netProfit;
    const depreciation = businessIncomeArray.value[i].depreciation;
    const directorSalary = businessIncomeArray.value[i].directorSalary;

    const grossDerivedIncome = Math.round(
      Number(netProfit * 3) + Number(depreciation) + Number(directorSalary)
    );
    businessIncomeArray.at(i).patchValue({ grossDerivedIncome });
    const grossMonthlyIncome = Math.round(grossDerivedIncome / 12);
    businessIncomeArray.at(i).patchValue({ grossMonthlyIncome });
    }
  }
  onSalFoirDeviation(event: any) {
    const salariedFOIRasperPolicy = this.incomeDetailsForm.controls
      .salariedFOIRasperPolicy.value;

    if (Number(event) + Number(salariedFOIRasperPolicy) <= 150) {
      this.SalariedFOIRDeviation = Math.round(Number(event));
      this.totalSalariedFOIR =
        this.SalariedFOIRDeviation + salariedFOIRasperPolicy;
    } else {
      this.toasterService.showWarning('should not exceed 150', '');
      this.totalSalariedFOIR = 0;
    }
  }
}
