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
import { ToggleDdeService } from '@services/toggle-dde.service';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.css'],
})
export class IncomeDetailsComponent implements OnInit {
  disableSaveBtn: boolean;
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
  totalMonthlySalaryIncome :any;
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
  isDirty = false;
  incomeTypeValue: any;
  SalariedFOIRDeviation: number = 0;
  usedCar: boolean;
  NewOrUsedComercialVehicle: boolean;
  today: any = new Date().getFullYear();
  yearOneValue: string;
  yearTwoValue: string;
  yearThreeValue: string;
  cashGeneratedValue: number;
  cashGeneration: number;
  cashGeneratedYearOneValue: number;
  cashGeneratedYearTwoValue: number;
  cashGeneratedYearThreeValue: number;
  keyFinancialObj: any;
  keyFinancialData: any;
  rowIndex;
  isModelShow: boolean;
  errorMessage;
  isbusinessIncomeShow: boolean;
  isOtherIncomeShow: boolean;
  isObligationIncomeShow: boolean;
  isKeyFinancialShow: boolean;
  public yearOneMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  public yearTwoMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2))
  public yearThreeMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3))
  businessIncomeDetailsArray: FormArray;
  otherIncomeDetailsArray: FormArray;
  obligationDetailsArray: FormArray;
  KeyFinancialDetailsArray: FormArray;
  salariedFOIRasperPolicyIncome: number;
  totalSalary: number;

  constructor(
    private router: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private incomeDetailsService: IncomeDetailsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private utilityService: UtilityService,
  ) {
    this.yearOneValue = (this.today - 1).toString() + '-' + (this.today)
    this.yearTwoValue = (this.today - 2).toString() + '-' + (this.today - 1)
    this.yearThreeValue = (this.today - 3).toString() + '-' + (this.today - 2)
    console.log(this.yearOneMinDate);
    console.log(this.yearTwoMinDate);
    console.log(this.yearThreeMinDate);
    this.businessIncomeDetailsArray = this.formBuilder.array([]);
    this.otherIncomeDetailsArray = this.formBuilder.array([]);
    this.obligationDetailsArray  = this.formBuilder.array([]);
    this.KeyFinancialDetailsArray =this.formBuilder.array([]);
  }


  ngOnInit() {
    console.log(this.salariedFOIRasperPolicyIncome);
    console.log(this.totalMonthlySalaryIncome);
    
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
    this.getSalariedFoirIncome();
    console.log(this.salariedFOIRasperPolicy);
    
    this.incomeDetailsForm = this.formBuilder.group({
      keyFinanceDetails: this.KeyFinancialDetailsArray,
      // keyFinanceDetails: this.formBuilder.group({
      //   keyFinancials: this.formBuilder.array([this.getKeyFinancialDetails()])
      //   }),
      businessIncomeDetails:  this.businessIncomeDetailsArray,
      otherIncomeDetails:this.otherIncomeDetailsArray,
      obligationDetails:  this.obligationDetailsArray,
      salariedFOIRasperPolicy: this.salariedFOIRasperPolicy,
      salariedFOIRDeviation: [
        ,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      leadId: this.leadId,
      userId: this.userId,
    });
    
    // this.salariedFOIRasperPolicy = 70;
    this.SalariedFOIRDeviation = 0;
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

    if (this.productCode == "UC") {
      this.usedCar = true;
      // this.incomeDetailsForm.controls.
    } else if (this.productCode == "NCV" || this.productCode == "UCV") {
      this.NewOrUsedComercialVehicle = true
    }
    this.businessIncomeValidators()
  }
  businessIncomeValidators() {

    if (this.productCode == "NCV" || this.productCode == "UCV") {
      this.incomeDetailsForm.get('salariedFOIRDeviation').clearValidators();
      this.incomeDetailsForm.get('salariedFOIRDeviation').updateValueAndValidity();

    }

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

  private getKeyFinancialDetails(data?: any) {

    if (data == undefined) {

      return this.formBuilder.group({
        yearOne: this.formBuilder.group({
          yearValue: this.yearOneValue,
          applicantId: [''],
          applicantType: [''],
          // shareCapital:new FormControl(null, [
          //   Validators.required,
          //   Validators.maxLength(200),
          //   Validators.pattern(
          //     /^[a-zA-Z0-9 ]*$/
          //   ),
          // ]),
          shareCapital: [''],
          lorryHireChargesPaid: [''],
          securedLoans: [''],
          unSecuredLoans: [''],
          creditors: [''],
          debtors: [''],
          currentLiabilities: [''],
          fixedAssets: [''],
          currentAssets: [''],
          cashAndBankBalance: [''],
          revenueFromOperationsOrTopLine: [''],
          netProfitAfterTax: [''],
          depreciation: [''],
          partnersSalary: [''],
          cashGeneration: [''],
          dateOfItrFiling: [''],
        }),

        yearTwo: this.formBuilder.group({
          yearValue: this.yearTwoValue,
          applicantId: [''],
          applicantType: [''],
          shareCapital: [''],
          lorryHireChargesPaid: [''],
          securedLoans: [''],
          unSecuredLoans: [''],
          creditors: [''],
          debtors: [''],
          currentLiabilities: [''],
          fixedAssets: [''],
          currentAssets: [''],
          cashAndBankBalance: [''],
          revenueFromOperationsOrTopLine: [''],
          netProfitAfterTax: [''],
          depreciation: [''],
          partnersSalary: [''],
          cashGeneration: [''],
          dateOfItrFiling: [''],
        }),
        yearThree: this.formBuilder.group({
          yearValue: this.yearThreeValue,
          applicantId: [''],
          applicantType: [''],
          shareCapital: [''],
          lorryHireChargesPaid: [''],
          securedLoans: [''],
          unSecuredLoans: [''],
          creditors: [''],
          debtors: [''],
          currentLiabilities: [''],
          fixedAssets: [''],
          currentAssets: [''],
          cashAndBankBalance: [''],
          revenueFromOperationsOrTopLine: [''],
          netProfitAfterTax: [''],
          depreciation: [''],
          partnersSalary: [''],
          cashGeneration: [''],
          dateOfItrFiling: [''],
        }),
      })

    } else {
      return this.formBuilder.group({
        yearOne: this.formBuilder.group({
          yearValue: data.yearOne.yearValue ? data.yearOne.yearValue : this.yearOneValue,
          applicantId: data.yearOne.applicantId ? data.yearOne.applicantId : '',
          applicantType: data.yearOne.applicantType ? data.yearOne.applicantType : '',
          shareCapital: data.yearOne.shareCapital ? data.yearOne.shareCapital : '',
          lorryHireChargesPaid: data.yearOne.lorryHireChargesPaid ? data.yearOne.lorryHireChargesPaid : '',
          securedLoans: data.yearOne.securedLoans ? data.yearOne.securedLoans : '',
          unSecuredLoans: data.yearOne.unSecuredLoans ? data.yearOne.unSecuredLoans : '',
          creditors: data.yearOne.creditors ? data.yearOne.creditors : '',
          debtors: data.yearOne.debtors ? data.yearOne.debtors : '',
          currentLiabilities: data.yearOne.currentLiabilities ? data.yearOne.currentLiabilities : '',
          fixedAssets: data.yearOne.fixedAssets ? data.yearOne.fixedAssets : '',
          currentAssets: data.yearOne.currentAssets ? data.yearOne.currentAssets : '',
          cashAndBankBalance: data.yearOne.cashAndBankBalance ? data.yearOne.cashAndBankBalance : '',
          revenueFromOperationsOrTopLine: data.yearOne.revenueFromOperationsOrTopLine ? data.yearOne.revenueFromOperationsOrTopLine : '',
          netProfitAfterTax: data.yearOne.netProfitAfterTax ? data.yearOne.netProfitAfterTax : '',
          depreciation: data.yearOne.depreciation ? data.yearOne.depreciation : '',
          partnersSalary: data.yearOne.partnersSalary ? data.yearOne.partnersSalary : '',
          cashGeneration: data.yearOne.cashGeneration ? data.yearOne.cashGeneration : '',
          dateOfItrFiling: data.yearOne.dateOfItrFiling ? this.utilityService.getDateFromString(
            this.utilityService.convertDateTimeTOUTC(data.yearOne.dateOfItrFiling, 'DD/MM/YYYY')
          ) : '',
        }),
        yearTwo: this.formBuilder.group({
          yearValue: data.yearTwo.yearValue ? data.yearTwo.yearValue : this.yearTwoValue,
          applicantId: data.yearTwo.applicantId ? data.yearTwo.applicantId : '',
          applicantType: data.yearTwo.applicantType ? data.yearTwo.applicantType : '',
          shareCapital: data.yearTwo.shareCapital ? data.yearTwo.shareCapital : '',
          lorryHireChargesPaid: data.yearTwo.lorryHireChargesPaid ? data.yearTwo.lorryHireChargesPaid : '',
          securedLoans: data.yearTwo.securedLoans ? data.yearTwo.securedLoans : '',
          unSecuredLoans: data.yearTwo.unSecuredLoans ? data.yearTwo.unSecuredLoans : '',
          creditors: data.yearTwo.creditors ? data.yearTwo.creditors : '',
          debtors: data.yearTwo.debtors ? data.yearTwo.debtors : '',
          currentLiabilities: data.yearTwo.currentLiabilities ? data.yearTwo.currentLiabilities : '',
          fixedAssets: data.yearTwo.fixedAssets ? data.yearTwo.fixedAssets : '',
          currentAssets: data.yearTwo.currentAssets ? data.yearTwo.currentAssets : '',
          cashAndBankBalance: data.yearTwo.cashAndBankBalance ? data.yearTwo.cashAndBankBalance : '',
          revenueFromOperationsOrTopLine: data.yearTwo.revenueFromOperationsOrTopLine ? data.yearTwo.revenueFromOperationsOrTopLine : '',
          netProfitAfterTax: data.yearTwo.netProfitAfterTax ? data.yearTwo.netProfitAfterTax : '',
          depreciation: data.yearTwo.depreciation ? data.yearTwo.depreciation : '',
          partnersSalary: data.yearTwo.partnersSalary ? data.yearTwo.partnersSalary : '',
          cashGeneration: data.yearTwo.cashGeneration ? data.yearTwo.cashGeneration : '',
          dateOfItrFiling: data.yearTwo.dateOfItrFiling ? this.utilityService.getDateFromString(
            this.utilityService.convertDateTimeTOUTC(data.yearTwo.dateOfItrFiling, 'DD/MM/YYYY')
          ) : '',
        }),
        yearThree: this.formBuilder.group({
          yearValue: data.yearThree.yearValue ? data.yearThree.yearValue : this.yearThreeValue,
          applicantId: data.yearThree.applicantId ? data.yearThree.applicantId : '',
          applicantType: data.yearThree.applicantType ? data.yearThree.applicantType : '',
          shareCapital: data.yearThree.shareCapital ? data.yearThree.shareCapital : '',
          lorryHireChargesPaid: data.yearThree.lorryHireChargesPaid ? data.yearThree.lorryHireChargesPaid : '',
          securedLoans: data.yearThree.securedLoans ? data.yearThree.securedLoans : '',
          unSecuredLoans: data.yearThree.unSecuredLoans ? data.yearThree.unSecuredLoans : '',
          creditors: data.yearThree.creditors ? data.yearThree.creditors : '',
          debtors: data.yearThree.debtors ? data.yearThree.debtors : '',
          currentLiabilities: data.yearThree.currentLiabilities ? data.yearThree.currentLiabilities : '',
          fixedAssets: data.yearThree.fixedAssets ? data.yearThree.fixedAssets : '',
          currentAssets: data.yearThree.currentAssets ? data.yearThree.currentAssets : '',
          cashAndBankBalance: data.yearThree.cashAndBankBalance ? data.yearThree.cashAndBankBalance : '',
          revenueFromOperationsOrTopLine: data.yearThree.revenueFromOperationsOrTopLine ? data.yearThree.revenueFromOperationsOrTopLine : '',
          netProfitAfterTax: data.yearThree.netProfitAfterTax ? data.yearThree.netProfitAfterTax : '',
          depreciation: data.yearThree.depreciation ? data.yearThree.depreciation : '',
          partnersSalary: data.yearThree.partnersSalary ? data.yearThree.partnersSalary : '',
          cashGeneration: data.yearThree.cashGeneration ? data.yearThree.cashGeneration : '',
          dateOfItrFiling: data.yearThree.dateOfItrFiling ? this.utilityService.getDateFromString(
            this.utilityService.convertDateTimeTOUTC(data.yearThree.dateOfItrFiling, 'DD/MM/YYYY')
          ) : '',
        }),
      });
    }
  }
  addKeyFinancialDetails(data?: any) {
    const control = this.incomeDetailsForm.controls
      .keyFinanceDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        control.push(this.getKeyFinancialDetails(data[i]));
        this.onCashGeneration(null, i)
      }
    } else {
      control.push(this.getKeyFinancialDetails());
    }
  }
  removeKeyFinancialDetails(i?: any) {
    const control = this.incomeDetailsForm.controls
      .keyFinanceDetails as FormArray;
    control.removeAt(i);
    this.isKeyFinancialShow = false;
    const keyFinancialObj = { keyFinancials: this.incomeDetailsForm.controls.keyFinanceDetails.value }

    const body = {

      otherIncomeDetails: this.incomeDetailsForm.controls.otherIncomeDetails.value,
      obligationDetails: this.incomeDetailsForm.controls.obligationDetails.value,
      keyFinanceDetails: JSON.stringify(keyFinancialObj || null),
      leadId: this.leadId,
      userId: this.userId,

    };
    this.incomeDetailsService
      .setAllIncomeDetails(body)
      .subscribe((res: any) => {
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const
          let businessControls = this.incomeDetailsForm.controls
            .businessIncomeDetails as FormArray;
            this.businessIncomeDetailsArray.controls = [];
          const otherIncomeDetailsControls = this.incomeDetailsForm.controls
            .otherIncomeDetails as FormArray;
            this.otherIncomeDetailsArray .controls = [];
          const obligationDetailsControls = this.incomeDetailsForm.controls
            .obligationDetails as FormArray;
            this.obligationDetailsArray.controls = [];
          const keyFinancialCOntrols = this.incomeDetailsForm.controls
            .keyFinanceDetails as FormArray;
          keyFinancialCOntrols.controls = [];
          this.toasterService.showSuccess(
            'Key Financial Details Deleted Successfully',
            'Income Details'
          );
          this.getAllIncome();
        }

      });

  }
  private getBusinessIncomeDetails(data?: any) {
    if (data === undefined) {
      if (this.productCode == "UC") {
        return this.formBuilder.group({
          applicantId: ['', Validators.required],
          applicantType: [''],
          businessEnterpriseName: [
            null,
            [Validators.required],
          ],
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
      }
      else if (this.productCode == "UCV" || this.productCode == "NCV") {
        return this.formBuilder.group({
          applicantId: [],
          applicantType: [],
          businessEnterpriseName: [],
          depreciation: [
            ,
          ],
          directorSalary: [

          ],
          grossDerivedIncome: [],
          grossMonthlyIncome: [],
          netProfit: [],
        });
      }

    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : null,
        applicantId: data.applicantId ? data.applicantId : null,

        applicantType: data.applicantTypeValue ? data.applicantTypeValue : '',
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : '',
        businessEnterpriseName: data.businessEnterpriseName
          ? data.businessEnterpriseName
          : null,
        depreciation: Number(data.depreciation ? data.depreciation : null),
        directorSalary: Number(data.directorSalary ? data.directorSalary : null),
        grossDerivedIncome: Number(
          data.grossDerivedIncome ? data.grossDerivedIncome : null
        ),
        grossMonthlyIncome: Number(
          data.grossMonthlyIncome ? data.grossMonthlyIncome : null
        ),
        netProfit: Number(data.netProfit ? data.netProfit : null),
      });
    }
  }
  private getOtherIncomeDetails(data?: any) {

    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: ['', Validators.required],
        applicantType: [''],
        incomeType: ['', Validators.required],
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
      if (this.productCode == "UC") {
        return this.formBuilder.group({
          applicantId: [''],
          applicantType: [''],
          loanType: [''],
          financier: [''],
          loanAmount: [
          ],
          tenure: [null],
          mob: [null],
          emi: [null],
          balanceTenure: Number(null),
          obligationAmount: Number(null),
        });
      } else {
        return this.formBuilder.group({
          applicantId: ['', Validators.required],
          applicantType: [''],
          loanType: ['', Validators.required],
          financier: ['', Validators.required],
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
      }
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
        this.businessIncomeDetailsArray.push(this.getBusinessIncomeDetails(data[i]));
        this.onIncome(null, i);
      }
    } else if(data == null){
      this.businessIncomeDetailsArray.push(this.getBusinessIncomeDetails());
    }
  }
  removeBusinessIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    const id = this.businessIncomeDetailsArray.at(i).value.id;
    if (this.businessIncomeDetailsArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.businessIncomeDetailsArray.removeAt(i);
        this.toasterService.showInfo('Row is Removed', 'Income Details');
        this.isbusinessIncomeShow = false;
        this.onIncome(null, i)
      } else {
        const body = {
          userId: this.userId,
          aBusinessIncomeDetail: { id },
        };
        this.incomeDetailsService
          .softDeleteIncomeDetails(body)
          .subscribe((res: any) => {
            this.businessIncomeDetailsArray.removeAt(i);
            this.isbusinessIncomeShow = false;
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.onIncome(null, i)

          });
      }
    } else {
      // if (this.productCode == 'UC') {
      //   this.toasterService.showError('Atleast One Row Required', '');
      // }

    }
  }

  addOtherIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.otherIncomeDetailsArray.push(this.getOtherIncomeDetails(data[i]));
        this.getTotalOtherIncome(i);
        this.getOtherFactoredIncome(i)
        this.getSalariedFoirIncome()
      }
    } else if(data == null){
      this.otherIncomeDetailsArray.push(this.getOtherIncomeDetails());
    }
  }
  removeOtherIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    const id = this.otherIncomeDetailsArray.at(i).value.id;

    if (this.otherIncomeDetailsArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.otherIncomeDetailsArray.removeAt(i);
        this.toasterService.showInfo('Row is Removed', 'Income Details');
        this.isOtherIncomeShow = false;
        this.getTotalOtherIncome(i);
        this.getOtherFactoredIncome(i)
        this.getSalariedFoirIncome()


      } else {
        const body = {
          userId: this.userId,
          otherIncomeDetail: { id },
        };
        this.incomeDetailsService
          .softDeleteIncomeDetails(body)
          .subscribe((res: any) => {
            this.otherIncomeDetailsArray.removeAt(i);
            this.isOtherIncomeShow = false;

            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.getTotalOtherIncome(i);
        this.getOtherFactoredIncome(i)
        this.getSalariedFoirIncome()


          });
      }
    } else {
      // this.toasterService.showError('Atleast One Row Required', '');
    }
  }
  addObligationUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.obligationDetailsArray.push(this.getObligationDetails(data[i]));
        this.onEmi(null, i);
      }
    } else if(data == null){
      this.obligationDetailsArray.push(this.getObligationDetails());
    }
  }
  removeObligationIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    const id =  this.obligationDetailsArray.at(i).value.id;
    if ( this.obligationDetailsArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.obligationDetailsArray.removeAt(i);
        this.toasterService.showInfo('Row is Removed', 'Income Details');
        this.isObligationIncomeShow = false;
        this.onEmi(null, i);

      } else {
        const body = {
          userId: this.userId,
          obligationDetail: { id },
        };
        this.incomeDetailsService
          .softDeleteIncomeDetails(body)
          .subscribe((res: any) => {
            this.obligationDetailsArray.removeAt(i);
            this.isObligationIncomeShow = false;

            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
            this.onEmi(null, i);

          });
      }
    } else {
      // this.toasterService.showError('Atleast One Row Required', '');
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

        this.incomeDetailsForm.patchValue({
          salariedFOIRDeviation: this.applicantResponse.salariedFOIRDeviation || "0",
        });
        if(res.ProcessVariables.businessIncomeList != null){
          this.addBusinessIncomeUnit(res.ProcessVariables.businessIncomeList);
        }
        if(res.ProcessVariables.otherIncomeList != null){
          this.addOtherIncomeUnit(res.ProcessVariables.otherIncomeList);
        }
        if(res.ProcessVariables.obligationsList != null){
          this.addObligationUnit(res.ProcessVariables.obligationsList);
        } 
        this.onSalFoirDeviation(this.applicantResponse.salariedFOIRDeviation);
        const operationType = this.toggleDdeService.getOperationType();
        if (operationType === '1') {
          this.incomeDetailsForm.disable();
          this.disableSaveBtn = true;
        }
        // this.keyFinancialData = JSON.parse(res.ProcessVariables.keyFinanceDetails.keyFinancials || null)
        // this.addKeyFinancialDetails(this.keyFinancialData)
        let keyFinancialData = JSON.parse(res.ProcessVariables.keyFinanceDetails || null)
        if (keyFinancialData != null) {
          const keyFinancialObj = keyFinancialData.keyFinancials
          this.addKeyFinancialDetails(keyFinancialObj)
        } else {
          const keyFinancialObj = null
          this.addKeyFinancialDetails(keyFinancialObj)
        }
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
      this.businessIncomeDetailsArray.at(i).get('applicantType').setValue(applicantType);
  }

  onOtherApplicantChange(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
      this.otherIncomeDetailsArray.at(i).get('applicantType').setValue(applicantType);
  }

  onObligationApplicantChange(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
      this.obligationDetailsArray.at(i).get('applicantType').setValue(applicantType);
  }
  onKeyFinancialApplicantChangeYearOne(event, i?: number) {
    // this.resetApplicantValues(i)
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;

    const control: any = this.incomeDetailsForm.controls
      .keyFinanceDetails['controls'] as FormGroup;
    control[i].controls.yearOne.get('applicantType').setValue(applicantType);
    control[i].controls.yearTwo.get('applicantType').setValue(applicantType);
    control[i].controls.yearThree.get('applicantType').setValue(applicantType);
    const applicantName = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).fullName;
    control[i].controls.yearTwo.get('applicantId').setValue(applicantName);
    control[i].controls.yearThree.get('applicantId').setValue(applicantName);

  }
  onKeyFinancialApplicantChangeYearTwo(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;

    const control: any = this.incomeDetailsForm.controls
      .keyFinanceDetails['controls'] as FormGroup;
    // control[i].controls.yearOne.get('applicantType').setValue(applicantType);
    control[i].controls.yearTwo.get('applicantType').setValue(applicantType);
    // control[i].controls.yearThree.get('applicantType').setValue(applicantType);
    const applicantName = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).fullName;
    control[i].controls.yearTwo.get('applicantId').setValue(applicantName);

  }
  onKeyFinancialApplicantChangeYearThree(event, i?: number) {
    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;

    const control: any = this.incomeDetailsForm.controls
      .keyFinanceDetails['controls'] as FormGroup;
    control[i].controls.yearThree.get('applicantType').setValue(applicantType);
    const applicantName = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).fullName;
    control[i].controls.yearThree.get('applicantId').setValue(applicantName);

  }
  // resetApplicantValues(i: number) {
  //   const control: any = this.incomeDetailsForm.controls
  //     .keyFinanceDetails['controls'] as FormGroup;
  //   console.log(control)
  //   const val =control[i].controls.yearOne.value
  // for(var key in val) {
  //  if(key !== 'applicantType' ) { 
  //    if( key !== 'applicantId' ) {
  //     control[i].controls.yearOne.controls[key].reset();
  //     control[i].controls.yearTwo.controls[key].reset();
  //     control[i].controls.yearThree.controls[key].reset();
  //    } 
  // }
  // }
  // console.log(val);
  
  
  // }
  onSubmit() {
    this.submitted = true;
   
if(this.productCode == "UC" && this.businessIncomeDetailsArray.length == 0 && this.otherIncomeDetailsArray.length == 0  ){
  this.toasterService.showError(
    'Add atleast one entry in Business income or Other income Details',
    'Income Details'
  );
  return;
}else if(this.productCode == "UCV" && this.KeyFinancialDetailsArray.length == 0 && this.otherIncomeDetailsArray.length == 0  ){
  this.toasterService.showError(
    'Add atleast one entry in Key Financials or Other income Details',
    'Income Details'
  );
  return;
}else if(this.productCode == "NCV" && this.KeyFinancialDetailsArray.length == 0 && this.otherIncomeDetailsArray.length == 0  ){
  this.toasterService.showError(
    'Add atleast one entry in Key Financials or Other income Details',
    'Income Details'
  );
  return;
}
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
      for (let i = 0; i < this.businessIncomeDetailsArray.length; i++) {
        const depreciation = (this.businessIncomeDetailsArray.at(i).get('depreciation').value);
        this.businessIncomeDetailsArray.at(i).get('depreciation').setValue(depreciation);
        const directorSalary = this.businessIncomeDetailsArray.at(i).get('directorSalary').value;
        this.businessIncomeDetailsArray.at(i).get('directorSalary').setValue(directorSalary);
        const netProfit = this.businessIncomeDetailsArray.at(i).get('netProfit').value;
        this.businessIncomeDetailsArray.at(i).get('netProfit').setValue(netProfit);
        this.businessIncomeDetailsArray.at(i).get('grossDerivedIncome').setValue(
          this.businessIncomeDetailsArray.at(i).get('grossDerivedIncome').value);
        this.businessIncomeDetailsArray.at(i).get('grossMonthlyIncome').setValue(
          this.businessIncomeDetailsArray.at(i).get('grossMonthlyIncome').value);
        this.businessIncomeDetailsArray.at(i).get('applicantId').setValue(
          (this.businessIncomeDetailsArray.at(i).get('applicantId').value));
      }
      const otherIncomeControl = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
      for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
        const grossIncome = this.otherIncomeDetailsArray.at(i).get('grossIncome').value;
        this.otherIncomeDetailsArray.at(i).get('grossIncome').setValue(grossIncome.toString());
        this.otherIncomeDetailsArray.at(i).get('factoredIncome').setValue(
          this.otherIncomeDetailsArray.at(i).get('factoredIncome').value.toString());
        this.otherIncomeDetailsArray.at(i).get('applicantId').setValue(
          Number(this.otherIncomeDetailsArray.at(i).get('applicantId').value))
      }
      const obligationControl = this.incomeDetailsForm.controls
        .obligationDetails as FormArray;
      for (let i = 0; i < this.obligationDetailsArray.length; i++) {
        const loanAmount = this.obligationDetailsArray.at(i).get('loanAmount').value;
        this.obligationDetailsArray.at(i).get('loanAmount').setValue(loanAmount.toString());
        const tenure = Number(this.obligationDetailsArray.at(i).get('tenure').value);
        this.obligationDetailsArray.at(i).get('tenure').setValue(tenure);
        const mob = Number(this.obligationDetailsArray.at(i).get('mob').value);
        this.obligationDetailsArray.at(i).get('mob').setValue(mob);
        const emi = Number(this.obligationDetailsArray.at(i).get('emi').value);
        this.obligationDetailsArray.at(i).get('emi').setValue(emi);
        this.obligationDetailsArray.at(i).get('obligationAmount').setValue(
          this.obligationDetailsArray.at(i).get('obligationAmount').value.toString());
        this.obligationDetailsArray.at(i).get('applicantId').setValue(
          Number(this.obligationDetailsArray.at(i).get('applicantId').value));
      }
      const salaryContol = this.incomeDetailsForm.controls
        .salariedFOIRDeviation as FormControl;
      const salariedFOIRDeviation = Number(salaryContol.value);
      salaryContol.setValue(salariedFOIRDeviation);

      const keyFinancialObj = { keyFinancials: this.incomeDetailsForm.controls.keyFinanceDetails.value }

      let productCode = this.productCode;
      let bodyForm;
      if (productCode == "UC") {
        const body = {

          businessIncomeDetails: this.incomeDetailsForm.controls.businessIncomeDetails.value,
          otherIncomeDetails: this.incomeDetailsForm.controls.otherIncomeDetails.value,
          obligationDetails: this.incomeDetailsForm.controls.obligationDetails.value,
          // keyFinanceDetails: JSON.stringify(keyFinancialObj || null),
          salariedFOIRasperPolicy: this.incomeDetailsForm.controls.salariedFOIRasperPolicy.value,
          salariedFOIRDeviation: this.incomeDetailsForm.controls.salariedFOIRDeviation.value,
          leadId: this.leadId,
          userId: this.userId,

        }

        bodyForm = body

      } else if (productCode == "UCV" || productCode == "NCV") {

        const body = {

          // businessIncomeDetails: this.incomeDetailsForm.controls.businessIncomeDetails.value,
          otherIncomeDetails: this.incomeDetailsForm.controls.otherIncomeDetails.value,
          obligationDetails: this.incomeDetailsForm.controls.obligationDetails.value,
          keyFinanceDetails: JSON.stringify(keyFinancialObj || null),
          // salariedFOIRasperPolicy: this.incomeDetailsForm.controls.salariedFOIRasperPolicy.value,
          // salariedFOIRDeviation: this.incomeDetailsForm.controls.salariedFOIRDeviation.value,
          leadId: this.leadId,
          userId: this.userId,

        }

        bodyForm = body

      }


      this.incomeDetailsService
        .setAllIncomeDetails(bodyForm)
        .subscribe((res: any) => {

          // tslint:disable-next-line: triple-equals
          if (res && res.ProcessVariables.error.code == '0') {
            // tslint:disable-next-line: prefer-const
            let businessControls = this.incomeDetailsForm.controls
              .businessIncomeDetails as FormArray;
              this.businessIncomeDetailsArray.controls = [];
            const otherIncomeDetailsControls = this.incomeDetailsForm.controls
              .otherIncomeDetails as FormArray;
              this.otherIncomeDetailsArray.controls = [];
            const obligationDetailsControls = this.incomeDetailsForm.controls
              .obligationDetails as FormArray;
              this.obligationDetailsArray.controls = [];
            const keyFinancialCOntrols = this.incomeDetailsForm.controls
              .keyFinanceDetails as FormArray;
            keyFinancialCOntrols.controls = [];
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
        this.otherIncomeDetailsArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[0].factoring });
    } else if (event === this.incomeTypeResponse[1].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
        this.otherIncomeDetailsArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[1].factoring });
    } else if (event === this.incomeTypeResponse[2].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
        this.otherIncomeDetailsArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[2].factoring });
    } else if (event === this.incomeTypeResponse[3].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
        this.otherIncomeDetailsArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[3].factoring });
    } else if (event === this.incomeTypeResponse[4].incomeTypeUniqueValue) {
      const incomeArray = this.incomeDetailsForm.controls
        .otherIncomeDetails as FormArray;
        this.otherIncomeDetailsArray
        .at(i)
        .patchValue({ factoring: this.incomeTypeResponse[4].factoring });
    }
    this.getOtherIncomeDetails(i);
  }
  getOtherFactoredIncome(i: number) {
    const incomeArray = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    const factoringPerc = this.otherIncomeDetailsArray.at(i).value.factoring;
    const grossIncome = this.otherIncomeDetailsArray.at(i).value.grossIncome;
    const value = Math.round(grossIncome * (factoringPerc / 100));
    this.otherIncomeDetailsArray.at(i).patchValue({ factoredIncome: value });

    if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'SALRINCTYP') {
      if (this.otherIncomeDetailsArray && this.otherIncomeDetailsArray.length > 0) {
        this.totalMonthlySalaryIncome = 0;
        for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
          if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'SALRINCTYP') {
            this.totalMonthlySalaryIncome = Math.round(
              this.totalMonthlySalaryIncome +
              this.otherIncomeDetailsArray.value[i].factoredIncome
            );
            this.salArray.push(this.totalMonthlySalaryIncome);
          
            this.getSalariedFoirIncome()
          }   
        }
      }
    }
   
    if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'RENINCTYP') {
      if (this.otherIncomeDetailsArray && this.otherIncomeDetailsArray.length > 0) {
        this.totalMonthlyRentalIncome = 0;
        for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
          if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'RENINCTYP') {
            this.totalMonthlyRentalIncome = Math.round(
              this.totalMonthlyRentalIncome +
              this.otherIncomeDetailsArray.value[i].factoredIncome
            );
            this.rentArray.push(this.totalMonthlyRentalIncome);
          }
        }
      }
    }
    if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'PENINCTYP') {
      if (this.otherIncomeDetailsArray && this.otherIncomeDetailsArray.length > 0) {
        this.totalMonthlyPensionIncome = 0;
        for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
          if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'PENINCTYP') {
            this.totalMonthlyPensionIncome = Math.round(
              this.totalMonthlyPensionIncome +
              this.otherIncomeDetailsArray.value[i].factoredIncome
            );
            this.pensionArray.push(this.totalMonthlyPensionIncome);
          }
        }
      }
    }
    if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'AGRIINCINCTYP') {
      if (this.otherIncomeDetailsArray && this.otherIncomeDetailsArray.length > 0) {
        this.totalMonthlyAgriIncome = 0;
        for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
          if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'AGRIINCINCTYP') {
            this.totalMonthlyAgriIncome = Math.round(
              this.totalMonthlyAgriIncome + this.otherIncomeDetailsArray.value[i].factoredIncome
            );
            this.agriArray.push(this.totalMonthlyAgriIncome);
          }
        }
      }
    }
    if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'OTHRINCTYP') {
      if (this.otherIncomeDetailsArray && this.otherIncomeDetailsArray.length > 0) {
        this.totalMonthlyOtherIncomeOfOthers = 0;
        for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
          if (this.otherIncomeDetailsArray.at(i).value.incomeType === 'OTHRINCTYP') {
            this.totalMonthlyOtherIncomeOfOthers = Math.round(
              this.totalMonthlyOtherIncomeOfOthers + this.otherIncomeDetailsArray.value[i].factoredIncome
            );
            this.otherArray.push(this.totalMonthlyOtherIncomeOfOthers);
          }
        }
      }
    }
    this.getTotalOtherIncome(i)

  }
  getSalariedFoirIncome(){
    const salFoirPolicy:any = this.incomeDetailsForm as FormGroup
    // console.log(salFoirPolicy);
    
    if(this.totalMonthlySalaryIncome <= 600000){
      salFoirPolicy.patchValue({
        salariedFOIRasperPolicy: 70
      });
      // this.salariedFOIRasperPolicy = 70
      console.log( this.salariedFOIRasperPolicy);
      
    }else if (this.totalMonthlySalaryIncome >= 600000 && this.totalMonthlySalaryIncome <= 1000000 ){
      salFoirPolicy.patchValue({
        salariedFOIRasperPolicy: 75
      });
      console.log( this.salariedFOIRasperPolicy);

    }else if (this.totalMonthlySalaryIncome >= 1000000){
      salFoirPolicy.patchValue({
        salariedFOIRasperPolicy: 80
      });
      console.log( this.salariedFOIRasperPolicy);

    }
  }
  getTotalOtherIncome(i: number) {
    const incomeArray = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;

    if (this.otherIncomeDetailsArray && this.otherIncomeDetailsArray.length > 0) {
      this.totalMonthlyOtherIncome = 0;
      for (let i = 0; i < this.otherIncomeDetailsArray.length; i++) {
        this.totalMonthlyOtherIncome = Math.round(
          this.totalMonthlyOtherIncome + this.otherIncomeDetailsArray.value[i].factoredIncome
        );
        const factoringPerc = this.otherIncomeDetailsArray.at(i).value.factoring;
        const grossIncome = this.otherIncomeDetailsArray.at(i).value.grossIncome;
        const value = Math.round(grossIncome * (factoringPerc / 100));
        this.otherIncomeDetailsArray.at(i).patchValue({ factoredIncome: value });

      }
    }
  }
  onTenure(event: any, i: number) {
    let tenure = 0;
    let mob = 0;
    const obligationArray = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    tenure = Number(this.obligationDetailsArray.value[i].tenure);

    mob = Number(this.obligationDetailsArray.value[i].mob);

    if (tenure < mob) {
      this.toasterService.showError('Mob should not exceed tenure', '');
      this.obligationDetailsArray.at(i).patchValue({ mob: 0 });
      this.obligationDetailsArray.at(i).patchValue({ balanceTenure: tenure });
    } else {
      const balanceTenor = Math.abs(Number(tenure) - Number(mob));

      this.obligationDetailsArray.at(i).patchValue({ balanceTenure: balanceTenor });
    }
  }
  onEmi(event: any, i: number) {
    const obligationArray = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    if (this.obligationDetailsArray && this.obligationDetailsArray.length > 0) {
      this.totalObligationAmount = 0;
      for (let i = 0; i < this.obligationDetailsArray.length; i++) {
        this.totalObligationAmount = Math.round(
          this.totalObligationAmount + Number(this.obligationDetailsArray.value[i].emi)

        );
        const emi = this.obligationDetailsArray.value[i].emi;
        const obligationAmount = emi;
        this.obligationDetailsArray.at(i).patchValue({ obligationAmount });
      }
    }
  }
  onIncome(event: any, i: number) {
    const businessIncomeArray = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    if (this.businessIncomeDetailsArray && this.businessIncomeDetailsArray.length > 0) {
      this.totalBusinessIncomeAmount = 0;
      for (let i = 0; i < this.businessIncomeDetailsArray.length; i++) {
        this.totalBusinessIncomeAmount = Math.round(
          this.totalBusinessIncomeAmount +
          this.businessIncomeDetailsArray.value[i].grossMonthlyIncome
        );
      }
      const netProfit = this.businessIncomeDetailsArray.value[i].netProfit;
      const depreciation = this.businessIncomeDetailsArray.value[i].depreciation;
      const directorSalary = this.businessIncomeDetailsArray.value[i].directorSalary;

      const grossDerivedIncome = Math.round(
        Number(netProfit * 3) + Number(depreciation) + Number(directorSalary)
      );
      this.businessIncomeDetailsArray.at(i).patchValue({ grossDerivedIncome });
      const grossMonthlyIncome = Math.round(grossDerivedIncome / 12);
      this.businessIncomeDetailsArray.at(i).patchValue({ grossMonthlyIncome });
    }
  }
  onSalFoirDeviation(event: any) {
    const salariedFOIRasperPolicy = this.incomeDetailsForm.controls
      .salariedFOIRasperPolicy.value;
if(this.productCode == "UC"){
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
  onCashGeneration(event, i: number) {

    const keyFinanceDetails = this.incomeDetailsForm.controls
      .keyFinanceDetails as FormArray;

    const netProfitAfterTaxYearOne = keyFinanceDetails.value[i].yearOne.netProfitAfterTax;
    const depreciationBYearOne = keyFinanceDetails.value[i].yearOne.depreciation;
    const netProfitAfterTaxYearTwo = keyFinanceDetails.value[i].yearTwo.netProfitAfterTax;
    const depreciationBYearTwo = keyFinanceDetails.value[i].yearTwo.depreciation;
    const netProfitAfterTaxYearThree = keyFinanceDetails.value[i].yearThree.netProfitAfterTax;
    const depreciationBYearThree = keyFinanceDetails.value[i].yearThree.depreciation;

    this.cashGeneratedYearOneValue = Number(netProfitAfterTaxYearOne) + Number(depreciationBYearOne);
    this.cashGeneratedYearTwoValue = Number(netProfitAfterTaxYearTwo) + Number(depreciationBYearTwo);
    this.cashGeneratedYearThreeValue = Number(netProfitAfterTaxYearThree) + Number(depreciationBYearThree);

    const control = this.incomeDetailsForm.controls
      .keyFinanceDetails['controls'] as FormGroup;

    control[i].controls.yearOne.get('cashGeneration').setValue(this.cashGeneratedYearOneValue);
    control[i].controls.yearTwo.get('cashGeneration').setValue(this.cashGeneratedYearTwoValue);
    control[i].controls.yearThree.get('cashGeneration').setValue(this.cashGeneratedYearThreeValue);
  }
  showBusinessIncome(i) {
    this.rowIndex = i;
    this.isbusinessIncomeShow = true;
    this.errorMessage = 'Are you sure Want to remove this row ?';
  }
  showOtherIncome(i) {
    this.rowIndex = i;
    this.isOtherIncomeShow = true;
    this.errorMessage = 'Are you sure Want to remove this row ?';
  }
  showObligationIncome(i) {
    this.rowIndex = i;
    this.isObligationIncomeShow = true;
    this.errorMessage = 'Are you sure Want to remove this row ?';
  }
  showKeyFinancial(i) {
    this.rowIndex = i;
    this.isKeyFinancialShow = true;
    this.errorMessage = 'Are you sure Want to remove this row ?';
  }

}
