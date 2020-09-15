import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { NegotiationService } from './negotiation.service';
import { CreateLeadDataService } from '../lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ToasterService } from '@services/toaster.service';
import { IfStmt } from '@angular/compiler';
import { LoginStoreService } from '@services/login-store.service';
import { element } from 'protractor';
import { variable } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-negotiation',
  templateUrl: './negotiation.component.html',
  styleUrls: ['./negotiation.component.css']
})
export class NegotiationComponent implements OnInit {
  FASTagReqLOV = [
    { key: "1", value: "Yes" },
    {
      key: "2", value: "No"
    }
  ];
  EMIStartDateLOV = [
    {
      key: "1",
      value: "Next month cycle date"
    },
    {
      key: "2",
      value: "2nd next month cycle date"
    }
  ];
  isDirty: boolean;
  createNegotiationForm: FormGroup;
  lovLabels: any = [];
  labels: any = {};
  namePattern: string;
  fundingRequiredforMI?: string;
  nameLength: number;
  mobileLength: number;
  productCategoryData = [];
  productCategoryList = [];
  motorInsuranceData: any;
  LOV: any = [];
  EMICycleDaysLOV: any;
  TypesOfInsuranceLOV: any;
  MoratoriumDaysLOV: any;
  InsuranceSlabLOV: any;
  InsuranceProvidersLOV = [];
  GapDaysIntPayMode: any;
  FASTagLOV: any;
  FundingRequiredLOV = [];
  bizDivId: any;
  productFromLead1: any;
  sourcingTypeData: string;
  tempInsuranceProvidersLOV: any;
  sourcingTypeData1: string;
  fundingRequiredData: any;
  InsuranceProvidersData: any;
  InsuranceProviderslifecoverData: any;
  enableEdit: boolean = true;
  fundingValue: void;
  creditShieldInsuranceProvidersLOV = [];
  AssetDetailsList: any;
  LeadReferenceDetails: any;
  PACInsuranceProvidersLOV = [];
  VASInsuranceProvidersLOV = [];
  Applicants = [];
  CombinedLoan: any;
  Asset = [];
  InsuranceProvidersLabel = [];
  DeductionDetails = [];
  Deductions = [];
  CrossSellOthers = [];
  userId: string;
  deductionLabel = [];
  CrossSellInsurance: any;
  CrossSellIns = [];
  EMIDay: any;
  today = new Date();
  leadId: any;
  d: any;
  motarButtonFlag = [];
  PACButtonFlag = [];
  lifeButtonFlag = [];
  VASButtonFlag = [];
  fastTagAmtSum = 0;
  PremiumAmntSum = 0;
  totalCrossSellAmt = 0;
  LMSSchedule = [];
  MItemp: string;
  lifeCovertemp: string;
  fastTagtemp: string;
  VAStemp: string;
  PACtemp: string;
  view: boolean;
  PACvalueSelected: any;
  VASvalueSelected: any;
  fastTagvalueSelected: any;
  valueSelected: any;
  lifecovervalueSelected: any;
  NegotiationId: any;
  leadData;
  motorInsuranceProviderName: any;
  pACInsuranceProviderName: any;
  vASInsuranceProvidersName: any;
  creditShieldInsuranceProviderName: any;
  finalAsset = [];
  roleType: any;
  FundingRequiredLOVtemp: any[];
  tempDataFundingRequiredLOV: any[];
  showapplicable: boolean = false;
  isPac: boolean;
  isVas: boolean;
  maxValuePDC: any;
  minValueSPDC: any;
  maxValueSPDC: any;
  minValuePDC: any;
  processingFee = 0;
  serviceCharge = 0;
  SPDCvalueCheck: { rule: (val: any) => boolean; msg: string; }[];
  PDCvalueCheck: { rule: (val: any) => boolean; msg: string; }[];
  RepaymentLOV = [];
  isSecured: boolean;
  valid: boolean;
  IRRValueCheck: { rule: (variance: any) => boolean; msg: string; }[];
  baseInterest: any;
  maxInterest: any;
  minInterest: any;
  varianceIRR : any;
  constructor(
    private labelsData: LabelsService,
    private NegotiationService: NegotiationService,
    private fb: FormBuilder,
    private createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private sharedData: SharedService,
    private router: Router,
    private loginStoreService: LoginStoreService
  ) {
    this.sharedData.leadData$.subscribe((value) => {
      this.leadData = value;
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
    });
  }
  ngOnInit() {
    // const leadData = this.createLeadDataService.getLeadSectionData();
    // this.leadId = leadData['leadId']
    this.userId = localStorage.getItem('userId');
    this.onChangeLanguage('English');
    this.getLeadId();
    // this.initForm();
    this.getLabels();
    this.getLOV();
    this.getInsuranceLOV();
    this.loadForm();
    // setTimeout(() => {
    // }, 1500);
    // else if (!this.view)
    this.getAssetDetails();
    setTimeout(() => {
      this.getAssetDetails();//enable this to fetch data,redirects fro dashboard
    }, 1000);
   
  }
  getFundingReq(event, i) {
    this.showapplicable = false;
    const value = event.target.value;
    let a = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].life['controls']
    if (value == '7INSSLAB') {
      a.fundingRequiredforlifeCover.setValue(this.tempDataFundingRequiredLOV[2].key);
      a.fundingRequiredforlifeCover.disable();
    }
    else if (value != '7INSSLAB') {
      a.fundingRequiredforlifeCover.setValue(this.tempDataFundingRequiredLOV[0].key);
      a.fundingRequiredforlifeCover.enable();
    }
  }
  onChangeLanguage(labels: string) {
    if (labels === 'Hindi') {
      this.labelsData.getLanguageLabelData().subscribe((data) => {
        this.labels = data[0];
      });
    } else {
      this.labelsData.getLabelsData().subscribe((data) => {
        this.labels = data;
      });
    }
  }
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = this.labels.validationData.name.maxLength;
        this.mobileLength = this.labels.validationData.mobileNumber.maxLength;
      },
    ); ''
  }
  loadForm() {
    this.createNegotiationForm = this.fb.group({
      tickets: new FormArray([]),
      tickets1: new FormArray([]),
      coapplicant: new FormArray([]),
      guarantorvalue: new FormArray([]),
      // addressProof: this.fb.array([this.initControls()]),
      productCode: [{ value: '', disabled: true }],
      applicant: [{ value: '', disabled: true }],
      CustomerCategory: [{ value: '', disabled: true }],
      coApplicant: [{ value: '', disabled: true }],
      coapplicantCategory: [{ value: '', disabled: true }],
      guarantor: [{ value: '', disabled: true }],
      guarantorCategory: [{ value: '', disabled: true }],
      reqLoanAmount: [{ value: '', disabled: true }],
      reqLoanTenor: [{ value: '', disabled: true }],
      NetDisbursementAmount: [{ value: '', disabled: true }],
      // EMIStartDateAfterDisbursement: '',
      vehicleModel: [{ value: '', disabled: true }],
      fundingProgram: [{ value: '', disabled: true }],
      ageofAsset: [{ value: '', disabled: true }],
      eligibleLTV: [{ value: '', disabled: true }],
      promoCode: [{ value: '', disabled: true }],
      eligibleLoanAmount: ['', { disabled: true }],
      eligibleLoanAmountAftersubvention: [{ value: '', disabled: true }],
      subventionAmount: [{ value: '', disabled: true }],
      incentiveAmount: [{ value: '', disabled: true }],
      eligibleLoanTenor: [{ value: '', disabled: true }],
      EligibleIRR: [{ value: '', disabled: true }],
      regNo: [{ value: '', disabled: true }],
      ManufacturingYear: [{ value: '', disabled: true }],
      LoanAmountincludingCrossSellofalltheassets: [{ value: '', disabled: true }],
      NegotiatedLoanAmount: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]],
      NegotiatedLoanTenor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      NegotiatedIRR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      NegotiatedEMI: ['', [Validators.required]],
      MoratoriumPeriod: ['', [Validators.required]],
      EMICycle: ['', [Validators.required]],
      EMIStartDateAfterDisbursement: ['', [Validators.required]],
      PaymentModeforGapDaysInterest: ['', [Validators.required]],
      SelectAppropriateLMSScheduleCode: ['', [Validators.required]],
      NoofRepayableMonthsafterMoratorium: [{ value: '', disabled: true }],
      netAssetCost: [''],
      repaymentMode: [''],
      NoofPDC: ['', [Validators.minLength(1), Validators.maxLength(1)]],
      NoofSPDC: ['', [Validators.minLength(1), Validators.maxLength(1)]],
    })
  
  }
  calculatepremiumAmount(event, ins_type_id, i) {
    const value = event.target.value;
    this.productCategoryList.forEach(product => {
      if (Number(product.insurance_type_id) === ins_type_id) {
        if (ins_type_id == 1) {
          if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
            this.motarButtonFlag[i] = false;
          else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
            this.motarButtonFlag[i] = true;
        }
      }
      if (Number(product.insurance_type_id) === ins_type_id) {
        if (ins_type_id == 2) {
          if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
            this.PACButtonFlag[i] = false;
          else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
            this.PACButtonFlag[i] = true;
        }
      }
      if (Number(product.insurance_type_id) === ins_type_id) {
        if (ins_type_id == 3) {
          if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
            this.lifeButtonFlag[i] = false;
          else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
            this.lifeButtonFlag[i] = true;
        }
      }
      if (Number(product.insurance_type_id) === ins_type_id) {
        if (ins_type_id == 4) {
          if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
            this.VASButtonFlag[i] = false;
          else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
            this.VASButtonFlag[i] = true;
        }
      }
    });
  }
  calculateTotal(i) {
    this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
    console.log("vale", this.valueSelected)
    this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']
    this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']
    this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']
    this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag
    this.PACtemp = "0";
    this.VAStemp = "0";
    this.fastTagtemp = "0";
    this.lifeCovertemp = "0";
    this.MItemp = "0";
    // if (isBool === true && value == "MI") {
    this.PACvalueSelected['controls'].fundingRequiredforPAC.value === "1FNDREQ" ?
      this.PACtemp = this.PACvalueSelected['controls'].PACPremiumAmount.value : "0";
    this.VASvalueSelected['controls'].fundingRequiredforVAS.value === "1FNDREQ" ?
      this.VAStemp = this.VASvalueSelected['controls'].VASPremiumAmount.value : "0";
    this.lifecovervalueSelected['controls'].fundingRequiredforlifeCover.value === "1FNDREQ" ?
      this.lifeCovertemp = this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value : "0";
    this.fastTagvalueSelected['controls'].fundingRequiredforFASTag.value === "1FNDREQ" ?
      this.fastTagtemp = this.fastTagvalueSelected['controls'].FASTagAmount.value : "0";
    this.valueSelected['controls'].fundingRequiredforMI.value === "1FNDREQ" ?
      this.MItemp = this.valueSelected['controls'].MIPremiumAmount.value : "0";
    const loanamount =
      Number(this.PACtemp) +
      Number(this.VAStemp) + Number(this.fastTagtemp) + Number(this.lifeCovertemp) +
      Number(this.MItemp) + Number(this.AssetDetailsList[i].EligibleLoanAmnt);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag.get('LoanAmountincludingCrossSell').setValue(loanamount.toString());
    // }
    const formData = this.createNegotiationForm.getRawValue();
    this.totalCrossSellAmt = 0;
    const fastTag = Object.keys(formData.tickets).forEach(key => {
      this.totalCrossSellAmt += Number(formData.tickets[key].fastTag.LoanAmountincludingCrossSell);
    });
    let percentDeductionValue: Number;
    let selectedIndex;
    this.createNegotiationForm.patchValue(
      {
        "LoanAmountincludingCrossSellofalltheassets": this.totalCrossSellAmt,
        "NegotiatedLoanAmount": this.totalCrossSellAmt ? this.totalCrossSellAmt : Number(formData.tickets.fastTag[0].LoanAmountincludingCrossSell)
      }
    )
    for (let i = 0; i < this.DeductionDetails.length; i++) {
      if (!this.view && this.DeductionDetails[i].DeductionChargeType == "P") {
        percentDeductionValue = (Number(this.DeductionDetails[i].DeductionChargePercentage) / 100) * (this.totalCrossSellAmt ? this.totalCrossSellAmt : Number(formData.tickets.fastTag[0].LoanAmountincludingCrossSell));
        selectedIndex = i;
      }
      else if (this.view && this.DeductionDetails[i].charge_type == "P") {
        percentDeductionValue = (Number(this.DeductionDetails[i].charge_ratio) / 100) * (this.totalCrossSellAmt ? this.totalCrossSellAmt : Number(formData.tickets.fastTag[0].LoanAmountincludingCrossSell));
        selectedIndex = i;
      }
    }
    this.createNegotiationForm.get('tickets1')['controls'][selectedIndex]['controls']['DeductionChargefixedRate'].setValue(percentDeductionValue);
    this.getNetDisbursementAmount();
    this.calculateEMI();
  }
  calculatededuction() {
    let percentDeductionValue: Number;
    let selectedIndex;
    for (let i = 0; i < this.DeductionDetails.length; i++) {
      if (!this.view && this.DeductionDetails[i].DeductionChargeType == "P") {
        percentDeductionValue = (Number(this.DeductionDetails[i].DeductionChargePercentage) / 100) * (Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value));
        selectedIndex = i;
      }
      else if (this.view && this.DeductionDetails[i].charge_type == "P") {
        percentDeductionValue = (Number(this.DeductionDetails[i].charge_ratio) / 100) * (Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value));
        selectedIndex = i;
      }
    }
    this.createNegotiationForm.get('tickets1')['controls'][selectedIndex]['controls']['DeductionChargefixedRate'].setValue(percentDeductionValue);
    this.getNetDisbursementAmount();
  }
  getNetDisbursementAmount() {
    const arrayData = this.createNegotiationForm.controls['tickets1'].value;
    let sumValue = 0;
    this.PremiumAmntSum = 0;
    this.fastTagAmtSum = 0;
    arrayData.forEach(array => {
      sumValue += Number(array['DeductionChargefixedRate']);
    });
    this.createNegotiationForm.get('tickets')['controls'].forEach(ticket => {
      this.PremiumAmntSum += Number(ticket['controls'].CrossSellInsurance['controls']['motor']['controls'].MIPremiumAmount.value)
        + Number(ticket['controls'].CrossSellInsurance['controls']['pac']['controls'].PACPremiumAmount.value)
        + Number(ticket['controls'].CrossSellInsurance['controls']['life']['controls'].lifeCoverPremiumAmount.value)
        + Number(ticket['controls'].CrossSellInsurance['controls']['vas']['controls'].VASPremiumAmount.value);
      this.fastTagAmtSum += Number(ticket['controls'].fastTag['controls'].FASTagAmount.value)
    })
    this.createNegotiationForm.patchValue({
      NetDisbursementAmount: Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value) - (sumValue + this.fastTagAmtSum + this.PremiumAmntSum)
    });
  }
  isDecimal = (event) => {
    var charCode = event.keyCode;
    if (charCode == 46 && event.target.value.split('.').length >= 2) {
      return false;
    }
    return true;
  }
  getUIValues(event, isBool, value, i) {
    const productCategorySelected = isBool ? event.target.value : event;
    {
      let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].motor['controls']
      let y = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].pac['controls']
      let z = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].vas['controls']
      let a = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].life['controls']
      if (value == 'MI') {
        x.MIPremiumAmount.setValue('')
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          x.fundingRequiredforMI.setValue(this.FundingRequiredLOV[2].key),
            x.MIPremiumAmount.setValue('0')
          x.fundingRequiredforMI.disable();
          x.MIPremiumAmount.disable();
          x.MITenure.setValue('0'),
            x.MITenure.disable(),
            y.creditShieldPAC.setValue(productCategorySelected)
          y.fundingRequiredforPAC.setValue(this.FundingRequiredLOV[2].key),
            y.PACPremiumAmount.setValue('0');
          y.creditShieldPAC.disable();
          y.fundingRequiredforPAC.disable();
          y.PACPremiumAmount.disable();
          z.VAS.setValue(productCategorySelected)
          z.fundingRequiredforVAS.setValue(this.FundingRequiredLOV[2].key),
            z.VASPremiumAmount.setValue('0')
          z.VAS.disable();
          z.fundingRequiredforVAS.disable();
          z.VASPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          x.fundingRequiredforMI.setValue(this.tempDataFundingRequiredLOV[0].key),
            x.MIPremiumAmount.setValue('')
          x.fundingRequiredforMI.enable();
          x.MIPremiumAmount.enable();
          y.creditShieldPAC.setValue(productCategorySelected)
          y.fundingRequiredforPAC.setValue(this.tempDataFundingRequiredLOV[0].key),
            y.PACPremiumAmount.setValue('');
          y.creditShieldPAC.enable();
          y.fundingRequiredforPAC.enable();
          y.PACPremiumAmount.enable();
          z.VAS.setValue(productCategorySelected)
          z.fundingRequiredforVAS.setValue(this.tempDataFundingRequiredLOV[0].key),
            z.VASPremiumAmount.setValue('');
          z.VAS.enable();
          z.fundingRequiredforVAS.enable();
          z.VASPremiumAmount.enable();
          x.MITenure.setValue('1'),
            x.MITenure.enable(),
            this.PACInsuranceProvidersLOV = [];
          this.VASInsuranceProvidersLOV = [];
          for (let i = 0; i < this.InsuranceProvidersLOV.length; i++) {
            if ((this.InsuranceProvidersLOV[i].key == productCategorySelected) ||
              (this.InsuranceProvidersLOV[i].key == "4")) {
              var obj =
              {
                key: this.InsuranceProvidersLOV[i].key,
                value: this.InsuranceProvidersLOV[i].value,
              }
              this.PACInsuranceProvidersLOV.push(obj)
              this.VASInsuranceProvidersLOV.push(obj)
            }
          }
        }
        this.motorInsuranceProviderName = event.target.value
      }
      else if (value == 'PAC') {
        y.PACPremiumAmount.setValue('')
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          y.fundingRequiredforPAC.setValue(this.FundingRequiredLOV[2].key),
            y.PACPremiumAmount.setValue('0')
          y.fundingRequiredforPAC.disable();
          y.PACPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          y.fundingRequiredforPAC.setValue(this.tempDataFundingRequiredLOV[0].key),
            y.PACPremiumAmount.setValue('')
          y.fundingRequiredforPAC.enable();
          y.PACPremiumAmount.enable();
        }
        this.pACInsuranceProviderName = event.target.value
      }
      else if (value == 'VAS') {
        z.VASPremiumAmount.setValue('')
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          z.fundingRequiredforVAS.setValue(this.FundingRequiredLOV[2].key),
            z.VASPremiumAmount.setValue('0')
          z.fundingRequiredforVAS.disable();
          z.VASPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          z.fundingRequiredforVAS.setValue(this.tempDataFundingRequiredLOV[0].key),
            z.VASPremiumAmount.setValue('')
          z.fundingRequiredforVAS.enable();
          z.VASPremiumAmount.enable();
        }
        this.vASInsuranceProvidersName = event.target.value
      }
      else if (value == 'creditShield') {
        a.lifeCoverPremiumAmount.setValue('0')
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          a.fundingforLifeCover.setValue(this.InsuranceSlabLOV[6].key)
          a.fundingRequiredforlifeCover.setValue(this.FundingRequiredLOV[2].key),
            a.lifeCoverPremiumAmount.setValue('0')
          a.fundingRequiredforlifeCover.disable();
          a.lifeCoverPremiumAmount.disable();
          a.fundingforLifeCover.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          this.tempDataFundingRequiredLOV = [];
          this.FundingRequiredLOV.forEach((element) => {
            if (element.key != "3FNDREQ") {
              this.tempDataFundingRequiredLOV.push(element)
            }
          });
          a.fundingforLifeCover.setValue(this.InsuranceSlabLOV[0].key)
          a.fundingforLifeCover.enable();
          a.fundingRequiredforlifeCover.setValue(this.tempDataFundingRequiredLOV[0].key),
            a.lifeCoverPremiumAmount.setValue('')
          a.fundingRequiredforlifeCover.enable();
          a.lifeCoverPremiumAmount.enable();
        }
        this.creditShieldInsuranceProviderName = event.target.value
      }
      else if (value == 'fastTag') {
        let b = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag['controls'];
        if (isBool === true && productCategorySelected == 2) {
          this.showapplicable = true;
          b.fundingRequiredforFASTag.setValue(this.FundingRequiredLOV[2].key),
            b.FASTagAmount.setValue('0')
          b.fundingRequiredforFASTag.disable();
          b.FASTagAmount.disable();
          b.FASTagAmount.setErrors(null);
        }
        else if (isBool === true && productCategorySelected != 2) {
          this.showapplicable = false;
          b.fundingRequiredforFASTag.setValue(this.tempDataFundingRequiredLOV[0].key),
            b.FASTagAmount.setValue('')
          b.fundingRequiredforFASTag.enable();
          b.FASTagAmount.enable();
        }
      }
    }
  }
  getRepayableMonths() {
    const ab = Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value);
    this.createNegotiationForm.get('NoofRepayableMonthsafterMoratorium').setValue(ab);
  }
  calculateMinMax(value) {
    // const minmax = event.target.value;
    let minmax = this.createNegotiationForm.controls.repaymentMode.value;
    let pdcvalue = this.createNegotiationForm.controls.NoofPDC;
    let spdcvalue = this.createNegotiationForm.controls.NoofSPDC;
    if (value == 'empty') {
      pdcvalue.setValue(null);
      spdcvalue.setValue(null);
      pdcvalue.setErrors(null);
      spdcvalue.setErrors(null);
    }
    if ((minmax == '1LOSREPAY') || (minmax == '2LOSREPAY')) {
      if (value == 'empty') {
        pdcvalue.setValue("1");
        spdcvalue.setValue("5");
      }
      this.minValuePDC = "1"
      this.maxValuePDC = "4"
      this.PDCvalueCheck = [{ rule: pdcvalue => Number(pdcvalue) > Number(this.maxValuePDC), msg: 'Invalid Value' }]
      // { rule: pdcvalue => Number(pdcvalue) < Number(this.minValuePDC), msg: 'Invalid value' }];
    }
    else if (minmax == '4LOSREPAY') {
      if (value == 'empty') {
        pdcvalue.setValue("0");
        spdcvalue.setValue("5");
      }
      this.minValuePDC = "0"
      this.maxValuePDC = "4"
      this.PDCvalueCheck = [{ rule: pdcvalue => Number(pdcvalue) > Number(this.maxValuePDC), msg: 'Invalid Value' },
      { rule: pdcvalue => Number(pdcvalue) < Number(this.minValuePDC), msg: 'Invalid value' }];
    }
    else if (minmax == '3LOSREPAY') {
      let minvalue = this.createNegotiationForm.controls.NegotiatedLoanTenor.value;
      let maxvalue = (Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value) + 5).toString();
      if (value == 'empty') {
        pdcvalue.setValue(minvalue);
        spdcvalue.setValue("5");
      }
      this.minValuePDC = minvalue;
      this.maxValuePDC = maxvalue;
      this.PDCvalueCheck = [{ rule: pdcvalue => Number(pdcvalue) > Number(this.maxValuePDC), msg: 'Invalid Value' },
      { rule: pdcvalue => Number(pdcvalue) < Number(this.minValuePDC), msg: 'Invalid value' }];
    }
    this.minValueSPDC = "5"
    this.maxValueSPDC = "8"
    this.SPDCvalueCheck = [{ rule: spdcvalue => Number(spdcvalue) > Number(this.maxValueSPDC), msg: 'value should be between 5 and 8' },
    { rule: spdcvalue => Number(spdcvalue) < Number(this.minValueSPDC), msg: 'value should be between 5 and 8' }];
  }
 
  getLOV() {
    this.NegotiationService
      .getmotorInsuranceData().subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.motorInsuranceData = res.ProcessVariables
          this.EMICycleDaysLOV = res.ProcessVariables.EMICycleDaysLOV;
          var today = new Date();
          this.EMIDay = new Date(today.setDate(this.today.getDate() + 35)).getDate();
          let result = this.EMICycleDaysLOV.map(({ value }) => value).map(Number);
          const sortedvalue = result.sort((a, b) => a > b).find(x => x > this.EMIDay)
          let result1 = this.EMICycleDaysLOV.findIndex(x => x.value === sortedvalue + '');
          this.createNegotiationForm.patchValue({
            EMICycle: (result1 != -1) ? this.EMICycleDaysLOV[result1].key : this.EMICycleDaysLOV[0].key,
          });
          // this.InsuranceSlabLOV = res.ProcessVariables.InsuranceSlabLOV
          this.FASTagLOV = res.ProcessVariables.FASTagLOV;
          this.FundingRequiredLOV = res.ProcessVariables.FundingRequiredLOV;
          this.tempDataFundingRequiredLOV = [];
          this.FundingRequiredLOV.forEach((element) => {
            if (element.key != "3FNDREQ") {
              this.tempDataFundingRequiredLOV.push(element)
            }
          });
          this.GapDaysIntPayMode = res.ProcessVariables.GapDaysIntPayMode;
          this.InsuranceSlabLOV = res.ProcessVariables.InsuranceSlabLOV;
          this.InsuranceSlabLOV.forEach((value) => {
            if (value.value.indexOf('.') != -1)
              value.value = value.value * 100 + '%';
          });
          this.EMIStartDateLOV = this.EMIStartDateLOV;
          this.FASTagReqLOV = this.FASTagReqLOV
          this.MoratoriumDaysLOV = res.ProcessVariables.MoratoriumDaysLOV;
          this.RepaymentLOV = res.ProcessVariables.RepaymentLOV;
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
  allowSix(event) {
    const valueEntered = event.target.value;
    let EligibleTenorMin = 0;
    let EligibleTenorMax = 0;
    let value = Math.min.apply(Math, this.AssetDetailsList.map(function (o) {
      EligibleTenorMin = o.EligibleTenorMin;
    }))
    let value1 = Math.max.apply(Math, this.AssetDetailsList.map(function (o) {
      EligibleTenorMax = o.EligibleTenorMin;
    }
    ))
    if (Number(valueEntered) % 6 == 0) {
      this.createNegotiationForm.controls.NegotiatedLoanTenor.setValue(valueEntered.toString());
    }
    else {
      this.createNegotiationForm.controls.NegotiatedLoanTenor.setValue(null);
      this.toasterService.showError(
        'Negotiated Loan Tenor should be in multiples of 6.',
        'Create Negotiation'
      );
    }
  }
  calculateEMI(event?) {
    this.createNegotiationForm.controls.NegotiatedEMI.value ? this.createNegotiationForm.controls.NegotiatedEMI.setValue(0) : 0;
    let IRR = parseFloat(this.createNegotiationForm.controls.NegotiatedIRR.value) / 1200;
    let loanAmount = this.createNegotiationForm.controls.NegotiatedLoanAmount.value ?
      Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value) : null;
    let loanTenor = this.createNegotiationForm.controls.NegotiatedLoanTenor.value ?
      Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value) : null;
    if (IRR && loanAmount && loanTenor)
      this.createNegotiationForm.controls.NegotiatedEMI.setValue(
        Math.round((loanAmount * IRR) / (1 - (Math.pow(1 / (1 + IRR), loanTenor)))));
    // this.toasterService.showError("Enter NegotiatedLoanAmount and NegotiatedLoanTenor", '')
  }
  getInsuranceLOV() {
    const productCode = this.createLeadDataService.getLeadSectionData();
    const data = {
      "ProductCode": productCode['leadDetails']['productCatCode'] ?
        productCode['leadDetails']['productCatCode'] : null
    }
    this.NegotiationService
      .getInsuranceLOV(data)
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.productCategoryList = res.ProcessVariables.LOV;
          if (this.productCategoryList) {
            this.productCategoryList.forEach((element) => {
              var obj1 = {
                insurance_type_id: element.insurance_type_id,
                insurance_type_name: element.insurance_type_name
              }
              this.InsuranceProvidersLabel.push(obj1);
            });
            this.InsuranceProvidersLabel = this.InsuranceProvidersLabel.filter((thing, index) => {
              const _thing = JSON.stringify(thing);
              return index === this.InsuranceProvidersLabel.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            });
            this.productCategoryList.forEach((element) => {
              if (element.insurance_type_id == 1) {
                var obj = {
                  key: element.insurance_provider_id,
                  value: element.insurance_provider_name
                }
                this.InsuranceProvidersLOV.push(obj);
              }
              else if (element.insurance_type_id == 2) {
                var obj = {
                  key: element.insurance_provider_id,
                  value: element.insurance_provider_name
                }
                this.PACInsuranceProvidersLOV.push(obj)
              }
              else if (element.insurance_type_id == 3) {
                var obj = {
                  key: element.insurance_provider_id,
                  value: element.insurance_provider_name
                }
                this.creditShieldInsuranceProvidersLOV.push(obj);
              }
              else if (element.insurance_type_id == 4) {
                var obj = {
                  key: element.insurance_provider_id,
                  value: element.insurance_provider_name
                }
                this.VASInsuranceProvidersLOV.push(obj);
              }
            });
          }
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
  getAssetDetails() {
    this.NegotiationService
      .getAssetDetails(this.leadId)
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          if (res.ProcessVariables.isSecured) {
            this.isSecured = true;
            // this.fetchValue();
          }
          else
            this.isSecured = false;
          if (res.ProcessVariables.fetchNegotiation) {
            this.view = true;
            this.fetchValue();
          }
          else
            this.view = false;
          this.AssetDetailsList = res.ProcessVariables.AssetDetails ? res.ProcessVariables.AssetDetails : [];
          this.LeadReferenceDetails = res.ProcessVariables.LeadReferenceDetails ? res.ProcessVariables.LeadReferenceDetails : [];
          this.DeductionDetails = res.ProcessVariables.DeductionDetails ? res.ProcessVariables.DeductionDetails : [];
          var LMSScheduletemp = res.ProcessVariables.LMSSchedule ? res.ProcessVariables.LMSSchedule : [];
          this.minInterest = res.ProcessVariables.ratMinVar;
          this.maxInterest = res.ProcessVariables.ratMaxVar;
          this.baseInterest = res.ProcessVariables.baseInterest;
          // this.DeductionDetails
          if (LMSScheduletemp.length != 0) {
            LMSScheduletemp.forEach(element => {
              var obj =
              {
                key: element.ScheduleTypeCode,
                value: element.ScheduleTypeName
              }
              this.LMSSchedule.push(obj)
            })
          }
          const numberOfTickets1 = this.DeductionDetails.length;
          if (this.view == false) {
            if (this.t1.length < numberOfTickets1) {
              for (let i = this.t1.length; i < numberOfTickets1; i++) {
                this.deductionLabel[i] = this.DeductionDetails[i].DeductionChargeName;
                if (this.DeductionDetails[i].DeductionChargeType != "P")
                  this.DeductionDetails[i].DeductionChargefixedRate = this.DeductionDetails[i].DeductionChargefixedRate;
                this.t1.push(this.fb.group({
                  DeductionChargefixedRate: this.DeductionDetails[i].DeductionChargefixedRate,
                }));
              };
            }
          }
          const productCode = this.LeadReferenceDetails[0].LMSProductCode + "-"
            + this.LeadReferenceDetails[0].LMSProductName;
          this.createNegotiationForm.patchValue({
            productCode: productCode,
            applicant: this.LeadReferenceDetails[0].FullName,
            CustomerCategory: this.LeadReferenceDetails[0].CustomerCategory,
            reqLoanAmount: this.LeadReferenceDetails[0].RequestLoanAmnt,
            reqLoanTenor: this.LeadReferenceDetails[0].RequestedLoanTenure,
          });
          for (let i = this.applicant1.length + 1; i < this.LeadReferenceDetails.length; i++) {
            if (this.LeadReferenceDetails[i].LoanApplicationRelation == "COAPPAPPRELLEAD") {
              this.applicant1.push(this.fb.group({
                coApplicant: [{ value: this.LeadReferenceDetails[i].FullName, disabled: true }],
                coapplicantCategory: [{ value: this.LeadReferenceDetails[i].CustomerCategory, disabled: true }]
              }));
            }
          };
          for (let i = this.guarantor1.length + 1; i < this.LeadReferenceDetails.length; i++) {
            if (this.LeadReferenceDetails[i].LoanApplicationRelation == "GUARAPPRELLEAD") {
              this.guarantor1.push(this.fb.group({
                guarantor: [{ value: this.LeadReferenceDetails[i].FullName, disabled: true }],
                guarantorCategory: [{ value: this.LeadReferenceDetails[i].CustomerCategory, disabled: true }]
              }));
            }
          };
          if (this.t.length < this.AssetDetailsList.length) {
            for (let i = this.t.length; i < this.AssetDetailsList.length; i++) {
              this.motarButtonFlag.push(false);
              this.PACButtonFlag.push(false);
              this.lifeButtonFlag.push(false);
              this.VASButtonFlag.push(false);
              this.t.push(
                this.fb.group({
                  vehicleModel: [{ value: this.AssetDetailsList[i].VehicleModel, disabled: true }],
                  fundingProgram: [{ value: this.AssetDetailsList[i].FundingProgram, disabled: true }],
                  regNo: [{
                    value: this.AssetDetailsList[i].VehicleRegistrationNo ?
                      this.AssetDetailsList[i].VehicleRegistrationNo.toUpperCase() : null, disabled: true
                  }],
                  ManufacturingYear: [{ value: this.AssetDetailsList[i].ManufacturingDate ? this.AssetDetailsList[i].ManufacturingDate.split('/')[2] : null, disabled: true }],
                  ageofAsset: [{ value: this.AssetDetailsList[i].AssetAge, disabled: true }],
                  eligibleLTV: [{ value: this.AssetDetailsList[i].EligibleLTV, disabled: true }],
                  promoCode: [{ value: this.AssetDetailsList[i].VehicleRegistrationNo, disabled: true }],
                  eligibleLoanAmount: [{ value: this.AssetDetailsList[i].EligibleLoanAmnt, disabled: true }],
                  eligibleLoanAmountAftersubvention: "34",
                  subventionAmount: "12",
                  incentiveAmount: "13",
                  eligibleLoanTenor: [{ value: (this.AssetDetailsList[i].EligibleTenorMin && this.AssetDetailsList[i].EligibleTenorMax) ? this.AssetDetailsList[i].EligibleTenorMin + " " + "To" + " " + this.AssetDetailsList[i].EligibleTenorMax + " " + "Years" : '', disabled: true }],
                  EligibleIRR: [{ value: (this.AssetDetailsList[i].EligibleIRRMin && this.AssetDetailsList[i].EligibleIRRMax) ? this.AssetDetailsList[i].EligibleIRRMin + " " + "To" + " " + this.AssetDetailsList[i].EligibleIRRMax : '', disabled: true }],
                  NegotiatedLoanAmount: [{}],
                  NegotiatedLoanTenor: ['',],
                  NegotiatedIRR: ['',],
                  NegotiatedEMI: ['',],
                  MoratoriumPeriod: ['',],
                  EMICycle: ['',],
                  EMIStartDateAfterDisbursement: ['',],
                  PaymentModeforGapDaysInterest: ['',],
                  SelectAppropriateLMSScheduleCode: ['',],
                  NoofRepayableMonthsafterMoratorium: [{ value: '', disabled: true }],
                  netAssetCost: [{ value: this.AssetDetailsList[i].FinalAssetCost, disabled: true }],
                  CrossSellInsurance: this.fb.group({
                    motor: this.fb.group({
                      motorInsurance: this.view == false ? this.InsuranceProvidersLOV ? this.InsuranceProvidersLOV[0].key : null : null,
                      MITenure: '1',
                      fundingRequiredforMI: this.view == false ? this.tempDataFundingRequiredLOV[0].key : null,
                      MIPremiumAmount: [this.view == false ? '' : null, [Validators.maxLength(10)]],
                      // ['', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]],
                    }),
                    pac: this.fb.group({
                      creditShieldPAC: this.view == false ? this.PACInsuranceProvidersLOV ? this.PACInsuranceProvidersLOV[0].key : null : null,
                      PACPremiumAmount: [this.view == false ? '' : null, [Validators.maxLength(10)]],
                      fundingRequiredforPAC: this.view == false ? this.tempDataFundingRequiredLOV[0].key : null,
                    }),
                    life: this.fb.group({
                      creditShieldLifeCover: this.view == false ? this.creditShieldInsuranceProvidersLOV ? this.creditShieldInsuranceProvidersLOV[0].key : null : null,
                      fundingforLifeCover: this.view == false ? this.InsuranceSlabLOV[0].key : null,
                      lifeCoverPremiumAmount: [this.view == false ? '' : null, [Validators.maxLength(10)]],
                      fundingRequiredforlifeCover: this.view == false ? this.tempDataFundingRequiredLOV[0].key : null,
                    }),
                    vas: this.fb.group({
                      VAS: this.view == false ? this.VASInsuranceProvidersLOV ? this.VASInsuranceProvidersLOV[0].key : null : null,
                      VASPremiumAmount: [this.view == false ? '' : null, [Validators.maxLength(10)]],
                      fundingRequiredforVAS: this.view == false ? this.tempDataFundingRequiredLOV[0].key : null,
                    })
                  }),
                  fastTag: this.fb.group({
                    EquitasFASTagRequired: this.view == false ? this.FASTagReqLOV[0].key : null,
                    FASTagAmount: [this.view == false ? '' : null, [Validators.maxLength(10)]],
                    fundingRequiredforFASTag: this.view == false ? this.tempDataFundingRequiredLOV[0].key : null,
                    LoanAmountincludingCrossSell: [{ value: '', disabled: true }],
                  }),
                }));
            }
          }
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
    //  this.getNetDisbursementAmount();
  }
  get f() { return this.createNegotiationForm.controls; }
  get t() { return this.f.tickets as FormArray; }
  get t1() { return this.f.tickets1 as FormArray; }
  get applicant1() { return this.f.coapplicant as FormArray; }
  get guarantor1() { return this.f.guarantorvalue as FormArray; }
  get a1() { return this.f.CrossSellInsurance as FormArray; }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = value.leadId;
        }
        resolve(null);
      });
    });
  }
  allowValuesforNegoIRR(event) {
    let negoIRRValue = event.target.value;
    this.varianceIRR = (parseFloat(negoIRRValue) - parseFloat(this.baseInterest)).toFixed(2);
    if (this.varianceIRR > Number(this.maxInterest) || this.varianceIRR < Number(this.minInterest)) {
      this.createNegotiationForm.controls.NegotiatedIRR.setValue(null);
      this.toasterService.showError(
        'IRR should be between '+ (Number(this.minInterest) + Number(this.baseInterest)) +' and '+(Number(this.maxInterest) + Number(this.baseInterest)) +'.',
        'Create Negotiation'
      );
    }
    else
      this.createNegotiationForm.controls.NegotiatedIRR.setValue(negoIRRValue);
    this.calculateEMI();
  }
  allowvaluesforNegoAmount(event) {
    const formData = this.createNegotiationForm.getRawValue();
    this.totalCrossSellAmt = 0;
    const fastTag = Object.keys(formData.tickets).forEach(key => {
      this.totalCrossSellAmt += Number(formData.tickets[key].fastTag.LoanAmountincludingCrossSell);
    });
    let negoLoanValue = event.target.value;
    let totalvalue = this.totalCrossSellAmt ? this.totalCrossSellAmt : Number(formData.tickets[0].fastTag.LoanAmountincludingCrossSell)
    if (this.isSecured && Number(negoLoanValue) > Number(totalvalue)) {
      this.createNegotiationForm.controls.NegotiatedLoanAmount.setValue(totalvalue)
      this.toasterService.showError(
        'Negotiated Loan Amount should be less than Cross Sell Amount.',
        'Create Negotiation'
      );
    }
    else if (!this.isSecured && Number(negoLoanValue) > Number(totalvalue) * 2) {
      this.createNegotiationForm.controls.NegotiatedLoanAmount.setValue(totalvalue)
      this.toasterService.showError(
        'Negotiated Loan Amount should be less than twice of Cross Sell Amount.',
        'Create Negotiation'
      );
    }else{
      this.createNegotiationForm.controls.NegotiatedLoanAmount.setValue(negoLoanValue)
    }
  }
  onSubmit() {
    // this.getLeadId();
    this.isDirty = true;
    if (this.createNegotiationForm.valid === true) {
      this.getLeadId();
      const formData = this.createNegotiationForm.getRawValue();
      this.LeadReferenceDetails.forEach((element) => {
        var obj = {
          ucic: element.UCIC,
          applicant_id: element.ApplicationId,
          wizard_lead_id: element.WizardLeadId,
          customer_category: element.CustomerCategory,
          loan_application_relation: element.LoanApplicationRelation,
          loan_application_relation_value: element.LoanApplicationRelationValue
        }
        this.Applicants.push(obj);
      });
      if (this.NegotiationId) {
        this.Deductions = [];
        const deductions = formData.tickets1.forEach((ticket, index) => {
          if (this.DeductionDetails[index].charge_type == 'P') {
            this.CombinedLoan.deductions[index].charge_ratio = ((Number(ticket.DeductionChargefixedRate)) / (Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value))) * 100;
          }
          if (this.CombinedLoan.deductions[index].charge_code == "710") {
            this.processingFee = Number(ticket.DeductionChargefixedRate);
          } else {
            this.serviceCharge += Number(ticket.DeductionChargefixedRate);
          }
          var obj = {
            charge_code: this.CombinedLoan.deductions[index].charge_code,
            charge_type: this.CombinedLoan.deductions[index].charge_type,
            charge_amount: ticket.DeductionChargefixedRate,
            charge_ratio: this.CombinedLoan.deductions[index].charge_ratio ? this.CombinedLoan.deductions[index].charge_ratio.toString() : "0",
            charge_name: this.CombinedLoan.deductions[index].charge_name,
          }
          this.Deductions.push(obj);
        });
      }
      else {
        this.Deductions = [];
        const deductions = formData.tickets1.forEach((ticket, index) => {
          if (this.DeductionDetails[index].DeductionChargeType == 'P') {
            this.DeductionDetails[index].DeductionChargeRatio = ((Number(ticket.DeductionChargefixedRate)) / (Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value))) * 100;
          }
          if (this.DeductionDetails[index].DeductionChargeCode == "710") {
            this.processingFee = Number(ticket.DeductionChargefixedRate);
          } else {
            this.serviceCharge += Number(ticket.DeductionChargefixedRate);
          }
          var obj = {
            charge_code: this.DeductionDetails[index].DeductionChargeCode,
            charge_type: this.DeductionDetails[index].DeductionChargeType,
            charge_amount: ticket.DeductionChargefixedRate,
            charge_ratio: this.DeductionDetails[index].DeductionChargeRatio ? this.DeductionDetails[index].DeductionChargeRatio.toString() : "0",
            charge_name: this.DeductionDetails[index].DeductionChargeName,
          }
          this.Deductions.push(obj);
        });
      }
      this.CombinedLoan = {
        negotiated_loan_amount: this.createNegotiationForm.controls.NegotiatedLoanAmount.value,
        subvention_amount: this.createNegotiationForm.controls.subventionAmount.value,
        loan_amount_to_be_booked: this.createNegotiationForm.controls.NegotiatedLoanAmount.value,
        incentive_amount: this.createNegotiationForm.controls.incentiveAmount.value,
        negotiated_emi: this.createNegotiationForm.controls.NegotiatedEMI.value,
        mor_repay_month: this.createNegotiationForm.controls.NoofRepayableMonthsafterMoratorium.value,
        total_insurance_premium_amount: this.PremiumAmntSum,
        total_other_cross_sell_amount: this.fastTagAmtSum,
        negotiated_irr: this.createNegotiationForm.controls.NegotiatedIRR.value,
        moratorium_days: this.createNegotiationForm.controls.MoratoriumPeriod.value,
        negotiated_tenor_months: this.createNegotiationForm.controls.NegotiatedLoanTenor.value,
        emi_cycle_day: this.createNegotiationForm.controls.EMICycle.value,
        gap_days_payment_mode: this.createNegotiationForm.controls.PaymentModeforGapDaysInterest.value,
        lms_schedule_code: this.createNegotiationForm.controls.SelectAppropriateLMSScheduleCode.value,
        emi_cycle_start: this.createNegotiationForm.controls.EMIStartDateAfterDisbursement.value,
        tot_cross_sel_amnt_of_all_assert_incl_ln_amnt: this.createNegotiationForm.controls.LoanAmountincludingCrossSellofalltheassets.value,
        net_disbursement_amnt: this.createNegotiationForm.controls.NetDisbursementAmount.value,
        repaymentMode: this.createNegotiationForm.controls.repaymentMode.value,
        NoofPDC: this.createNegotiationForm.controls.NoofPDC.value,
        NoofSPDC: this.createNegotiationForm.controls.NoofSPDC.value,
        deductions: this.Deductions,
        processingFee: this.processingFee,
        serviceCharge: this.serviceCharge,
        variance:this.varianceIRR
      };
      this.CrossSellInsurance = [];
      this.CrossSellOthers = [];
      var array1 = [];
      var data = {};
      var data1 = {};
      const crossSellIns = formData.tickets.forEach((ticket, index) => {
        var obj = {
          collateral_id: this.AssetDetailsList[index].CollateralId ? this.AssetDetailsList[index].CollateralId : "",
          lms_collateral_id: this.AssetDetailsList[index].LMSCollaterId ? this.AssetDetailsList[index].LMSCollaterId : "",
          unique_sub_lead_reference_id: this.AssetDetailsList[index].UniqueSubLeadId ? this.AssetDetailsList[index].UniqueSubLeadId : "",
          negotiated_loan_amount: "",
          subvention_amount: "",
          loan_amount_to_be_booked: "",
          incentive_amount: "",
          total_insurance_premium_amount: this.PremiumAmntSum,
          total_other_cross_sell_amount: this.fastTagAmtSum,
          negotiated_irr: "",
          moratorium_days: "",
          negotiated_tenor_months: "",
          emi_cycle_day: "",
          gap_days_payment_mode: "",
          lms_schedule_code: "",
          emi_cycle_start: "",
          cross_sell_ins: [],
          cross_sell_others: {},
          deductions: []
        }
        var array = [];
        Object.keys(ticket.CrossSellInsurance).forEach(key => {
          const i = {};
          var object = {
            insurance_code: ticket.CrossSellInsurance[key].motorInsurance || ticket.CrossSellInsurance[key].creditShieldPAC || ticket.CrossSellInsurance[key].creditShieldLifeCover || ticket.CrossSellInsurance[key].VAS,
            fndreinsurance_code: ticket.CrossSellInsurance[key].fundingRequiredforMI || ticket.CrossSellInsurance[key].fundingRequiredforPAC || ticket.CrossSellInsurance[key].fundingRequiredforVAS || ticket.CrossSellInsurance[key].fundingRequiredforlifeCover,
            premium_amount: ticket.CrossSellInsurance[key].MIPremiumAmount || ticket.CrossSellInsurance[key].PACPremiumAmount || ticket.CrossSellInsurance[key].lifeCoverPremiumAmount || ticket.CrossSellInsurance[key].VASPremiumAmount,
            insslab: ticket.CrossSellInsurance[key].fundingforLifeCover,
            mi_tenure: ticket.CrossSellInsurance[key].MITenure,
          }
          array.push(object);
        })
        const fasttagValue = {
          cross_sell_type: ticket.fastTag.EquitasFASTagRequired,
          fndreq: ticket.fastTag.fundingRequiredforFASTag,
          amount: ticket.fastTag.FASTagAmount,
          loan_amnt_incl_cross_sel: ticket.fastTag.LoanAmountincludingCrossSell
        }
        obj.cross_sell_others = fasttagValue;
        obj.cross_sell_ins = array;
        this.Asset[index] = obj;
        this.Asset[index].cross_sell_others = fasttagValue;
        this.Asset[index].cross_sell_ins = array;
        this.finalAsset.push(this.Asset[index])
      });
      const NegotiationDetails = {
        "LeadID": this.leadId,
        "NegotiationID": this.NegotiationId,
        "ApplicantJson": JSON.stringify(this.Applicants),
        "CombinedLoanJson": JSON.stringify(this.CombinedLoan),
        "AssetsJson": JSON.stringify(this.finalAsset),
        "IsCombinedLoan": "Y"
      }
      this.NegotiationService
        .submitNegotiation(NegotiationDetails
        )
        .subscribe((res: any) => {
          if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
            this.NegotiationId = res.ProcessVariables.NegotiationDetails.NegotiationID;
            this.toasterService.showSuccess(res.ProcessVariables.error.message, '');
          }
          else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
            this.toasterService.showError(res.ProcessVariables.error.message, '');
          }
        });
    }
    else {
      this.toasterService.showError(
        'Please fill all mandatory fields.',
        'Create Negotiation'
      );
    }
  }
  cancel() {
    this.createNegotiationForm.controls.NegotiatedLoanTenor.setValue(null);
    this.createNegotiationForm.controls.NegotiatedLoanAmount.setValue(null);
    this.createNegotiationForm.controls.NegotiatedIRR.setValue(null);
    this.createNegotiationForm.controls.NegotiatedEMI.setValue(null);
    this.createNegotiationForm.controls.MoratoriumPeriod.setValue(null);
    this.createNegotiationForm.controls.NoofRepayableMonthsafterMoratorium.setValue(null);
    this.createNegotiationForm.controls.EMIStartDateAfterDisbursement.setValue(null);
    this.createNegotiationForm.controls.PaymentModeforGapDaysInterest.setValue(null);
    this.createNegotiationForm.controls.SelectAppropriateLMSScheduleCode.setValue(null);
  }
  fetchValue() {
    this.NegotiationService
      .viewNegotiationData(this.leadId).subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.NegotiationId = res.ProcessVariables.NegotiationDetails.NegotiationID;
          this.CombinedLoan = JSON.parse(res.ProcessVariables.NegotiationDetails.CombinedLoanJson);
          this.createNegotiationForm.patchValue({
            EMICycle: this.CombinedLoan.emi_cycle_day,
            MoratoriumPeriod: this.CombinedLoan.moratorium_days,
            NegotiatedIRR: this.CombinedLoan.negotiated_irr,
            NegotiatedLoanAmount: this.CombinedLoan.negotiated_loan_amount,
            NegotiatedLoanTenor: this.CombinedLoan.negotiated_tenor_months,
            NegotiatedEMI: this.CombinedLoan.negotiated_emi,
            NoofRepayableMonthsafterMoratorium: this.CombinedLoan.mor_repay_month,
            EMIStartDateAfterDisbursement: this.CombinedLoan.emi_cycle_start,
            PaymentModeforGapDaysInterest: this.CombinedLoan.gap_days_payment_mode,
            SelectAppropriateLMSScheduleCode: this.CombinedLoan.lms_schedule_code,
            NetDisbursementAmount: this.CombinedLoan.net_disbursement_amnt,
            LoanAmountincludingCrossSellofalltheassets: this.CombinedLoan.tot_cross_sel_amnt_of_all_assert_incl_ln_amnt,
            repaymentMode: this.CombinedLoan.repaymentMode,
            NoofPDC: this.CombinedLoan.NoofPDC,
            NoofSPDC: this.CombinedLoan.NoofSPDC
          });
          this.calculateMinMax(this.CombinedLoan.repaymentMode)
          this.DeductionDetails = this.CombinedLoan.deductions;
          for (let i = this.t1.length; i < this.DeductionDetails.length; i++) {
            this.deductionLabel[i] = this.DeductionDetails[i].charge_name;
            // if (this.DeductionDetails[i].charge_type != "P")
            //   this.DeductionDetails[i].DeductionChargefixedRate = this.DeductionDetails[i].DeductionChargefixedRate;
            this.t1.push(this.fb.group({
              DeductionChargefixedRate: this.DeductionDetails[i].charge_amount,
            }));
          };
          this.CrossSellIns = JSON.parse(res.ProcessVariables.NegotiationDetails.AssetsJson);
          const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
            this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['motor']
            this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['pac']
            this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['life']
            this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['vas']
            this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].fastTag;
            this.valueSelected['controls'].motorInsurance.setValue(this.CrossSellIns[index].cross_sell_ins[0].insurance_code);
            this.valueSelected['controls'].MITenure.setValue(this.CrossSellIns[index].cross_sell_ins[0].mi_tenure);
            this.valueSelected['controls'].MIPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[0].premium_amount);
            this.valueSelected['controls'].fundingRequiredforMI.setValue(this.CrossSellIns[index].cross_sell_ins[0].fndreinsurance_code);
            this.PACvalueSelected['controls'].creditShieldPAC.setValue(this.CrossSellIns[index].cross_sell_ins[1].insurance_code);
            this.PACvalueSelected['controls'].PACPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[1].premium_amount);
            this.PACvalueSelected['controls'].fundingRequiredforPAC.setValue(this.CrossSellIns[index].cross_sell_ins[1].fndreinsurance_code);
            this.lifecovervalueSelected['controls'].creditShieldLifeCover.setValue(this.CrossSellIns[index].cross_sell_ins[2].insurance_code);
            this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[2].premium_amount);
            this.lifecovervalueSelected['controls'].fundingRequiredforlifeCover.setValue(this.CrossSellIns[index].cross_sell_ins[2].fndreinsurance_code);
            this.lifecovervalueSelected['controls'].fundingforLifeCover.setValue(this.CrossSellIns[index].cross_sell_ins[2].insslab);
            this.VASvalueSelected['controls'].VAS.setValue(this.CrossSellIns[index].cross_sell_ins[3].insurance_code);
            this.VASvalueSelected['controls'].VASPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[3].premium_amount);
            this.VASvalueSelected['controls'].fundingRequiredforVAS.setValue(this.CrossSellIns[index].cross_sell_ins[3].fndreinsurance_code);
            this.fastTagvalueSelected['controls'].EquitasFASTagRequired.setValue(this.CrossSellIns[index].cross_sell_others.cross_sell_type);
            this.fastTagvalueSelected['controls'].fundingRequiredforFASTag.setValue(this.CrossSellIns[index].cross_sell_others.fndreq);
            this.fastTagvalueSelected['controls'].FASTagAmount.setValue(this.CrossSellIns[index].cross_sell_others.amount);
            this.fastTagvalueSelected['controls'].LoanAmountincludingCrossSell.setValue(this.CrossSellIns[index].cross_sell_others.loan_amnt_incl_cross_sel);
          })
        }
      });
  }
  fetchPreimumAmount(insuranceType, event, i) {
    const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
      // this.CrossSellIns.forEach(key => {
      // const i = {};LoanAmountincludingCrossSell
      this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
      this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']
      this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']
      this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']
      console.log("VALUE0", this.valueSelected)
    });
    // this.valueSelected['controls'].MIPremiumAmount? this.valueSelected['controls'].MIPremiumAmount = "" : "";
    // this.PACvalueSelected['controls'].PACPremiumAmount? this.valueSelected['controls'].PACPremiumAmount = "":"";
    // this.VASvalueSelected['controls'].VASPremiumAmount? this.valueSelected['controls'].VASPremiumAmount = "":"";
    let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']
    let insuranceProviderName: String;
    let insurancePercentage: number;
    let insuranceTenor: number;
    if (event == 'motor') {
      insuranceProviderName = this.valueSelected['controls'].motorInsurance.value;
      insuranceTenor = Number(this.valueSelected['controls'].MITenure.value);
      let PACProvider = this.PACInsuranceProvidersLOV.filter(val =>
        val.key == this.PACvalueSelected['controls'].creditShieldPAC.value)
      if (PACProvider[0].key == "4")
        this.isPac = false;
      else
        this.isPac = true;
      let VASProvider = this.VASInsuranceProvidersLOV.filter(val =>
        val.key == this.VASvalueSelected['controls'].VAS.value)
      if (VASProvider[0].key == "4")
        this.isVas = false;
      else
        this.isVas = true;
    }
    else if (event == 'creditShieldInsurance') {
      insuranceProviderName = this.lifecovervalueSelected['controls'].creditShieldLifeCover.value;
      let percentage = this.InsuranceSlabLOV.filter(val =>
        val.key == this.lifecovervalueSelected['controls'].fundingforLifeCover.value)
      insurancePercentage = Number(percentage[0].value.replace('%', ''));
      insuranceTenor =
        Number(this.AssetDetailsList[i].EligibleTenorMax);
    }
    const data = {
      insuranceProvider: Number(insuranceProviderName),// Number(this.valueSelected.motorInsurance),//icic chola
      insuranceType: insuranceType, // motor
      // applicantId: this.LeadReferenceDetails[0].ApplicationId,
      leadId: Number(this.leadId),
      collateralId: Number(this.AssetDetailsList[i].CollateralId),
      loanAmount: Number(this.AssetDetailsList[i].EligibleLoanAmnt),
      loanTenure: insuranceTenor,
      loanPercentage: insurancePercentage,
      isVas: this.isVas,
      isPac: this.isPac,
    }
    this.NegotiationService
      .fetchPreimumAmount(data)
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          if (event == 'motor') {
            this.valueSelected['controls'].MIPremiumAmount.setValue(res.ProcessVariables.miPremiumAmount);
            x.motor['controls'].MIPremiumAmount.disable();
            this.PACvalueSelected['controls'].PACPremiumAmount.setValue
              (res.ProcessVariables.pacPremiumAmount);
            x.pac['controls'].PACPremiumAmount.disable();
            this.VASvalueSelected['controls'].VASPremiumAmount.setValue
              (res.ProcessVariables.vasPremiumAmount);
            x.vas['controls'].VASPremiumAmount.disable();
          }
          else if (event == 'creditShieldInsurance') {
            this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(res.ProcessVariables.premiumAmount);
            x.life['controls'].lifeCoverPremiumAmount.disable();
          }
          this.calculateTotal(i)
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
  onNext() {
    if (this.roleType == '1') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/disbursement`]);
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/check-list`]);
    }
    // this.router.navigateByUrl(`pages/credit-decisions/${this.leadId}/disbursement`)
  }
  onBack() {
    if (this.roleType == '1') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/term-sheet`]);
    } 
    // else if (this.roleType == '2') {
    //   this.router.navigate([`pages/credit-decisions/${this.leadId}/credit-condition`]);
    // } else if (this.roleType == '4') {
    //   this.router.navigate([`pages/cpc-maker/${this.leadId}/sanction-details`]);
    // } else if (this.roleType == '5') {
    //   this.router.navigate([`pages/cpc-checker/${this.leadId}/pdc-details`]);
    // }
  }
}
