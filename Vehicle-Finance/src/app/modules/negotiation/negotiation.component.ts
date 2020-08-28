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
  tempFundingRequiredLOV: any;
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
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
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
      NetDisbursementAmount: ['', { disabled: true }],
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
      NegotiatedLoanAmount: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],
      NegotiatedLoanTenor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      NegotiatedIRR: ['', [Validators.required]],
      NegotiatedEMI: ['', [Validators.required]],
      MoratoriumPeriod: ['', [Validators.required]],
      EMICycle: ['', [Validators.required]],
      EMIStartDateAfterDisbursement: ['', [Validators.required]],
      PaymentModeforGapDaysInterest: ['', [Validators.required]],
      SelectAppropriateLMSScheduleCode: ['', [Validators.required]],
      NoofRepayableMonthsafterMoratorium: [{ value: '', disabled: true }],
      netAssetCost: [''],
    })
  }
  checkClick() {
    console.log('clicked', this.motarButtonFlag);
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
    this.getNetDisbursementAmount();
  }
  calculateTotal(event, isBool, value, i, groupName) {
    const productCategorySelected = isBool ? event.target.value : event;
    this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor'].value
    this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac'].value
    this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life'].value
    this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas'].value
    this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag.value
    this.PACtemp = "0";
    this.VAStemp = "0";
    this.fastTagtemp = "0";
    this.lifeCovertemp = "0";
    this.MItemp = "0";
    // if (isBool === true && value == "MI") {
    this.PACvalueSelected.fundingRequiredforPAC === "1FNDREQ" ? this.PACtemp = this.PACvalueSelected.PACPremiumAmount : "0";
    this.VASvalueSelected.fundingRequiredforVAS === "1FNDREQ" ? this.VAStemp = this.VASvalueSelected.VASPremiumAmount : "0";
    this.lifecovervalueSelected.fundingRequiredforlifeCover === "1FNDREQ" ? this.lifeCovertemp = this.lifecovervalueSelected.lifeCoverPremiumAmount : "0";
    this.fastTagvalueSelected.fundingRequiredforFASTag === "1FNDREQ" ? this.fastTagtemp = this.fastTagvalueSelected.FASTagAmount : "0";
    this.valueSelected.fundingRequiredforMI === "1FNDREQ" ? this.MItemp = this.valueSelected.MIPremiumAmount : "0";
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
      if (this.DeductionDetails[i].DeductionChargeType == "P") {
        percentDeductionValue = (Number(this.DeductionDetails[i].DeductionChargePercentage) / 100) * (this.totalCrossSellAmt ? this.totalCrossSellAmt : Number(formData.tickets.fastTag[0].LoanAmountincludingCrossSell));
        selectedIndex = i;
      }
    }
    this.createNegotiationForm.get('tickets1')['controls'][selectedIndex]['controls']['DeductionChargefixedRate'].setValue(percentDeductionValue);
    this.getNetDisbursementAmount();
  }
  getNetDisbursementAmount() {
    const arrayData = this.createNegotiationForm.controls['tickets1'].value;
    let sumValue = 0;
    let PremiumAmntSum = 0;
    let fastTagAmtSum = 0;
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
      NetDisbursementAmount: this.createNegotiationForm.controls.NegotiatedLoanAmount.value - (sumValue + this.fastTagAmtSum + this.PremiumAmntSum)
    });
  }
  getUIValues(event, isBool, value, i) {
    const productCategorySelected = isBool ? event.target.value : event;
    {
      if (value == 'MI') {
        let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].motor['controls']
        if (isBool === true && productCategorySelected == 4) {
          x.fundingRequiredforMI.setValue(this.FundingRequiredLOV[2].key),
            x.MIPremiumAmount.setValue('0')
          x.fundingRequiredforMI.disable();
          x.MIPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          x.fundingRequiredforMI.setValue(this.FundingRequiredLOV[0].key),
            x.MIPremiumAmount.setValue('10')
          x.fundingRequiredforMI.enable();
          x.MIPremiumAmount.enable();
        }
        this.motorInsuranceProviderName = event.target.value
      }
      else if (value == 'PAC') {
        let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].pac['controls']
        if (isBool === true && productCategorySelected == 4) {
          x.fundingRequiredforPAC.setValue(this.FundingRequiredLOV[2].key),
            x.PACPremiumAmount.setValue('0')
          x.fundingRequiredforPAC.disable();
          x.PACPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          x.fundingRequiredforPAC.setValue(this.FundingRequiredLOV[0].key),
            x.PACPremiumAmount.setValue('10')
          x.fundingRequiredforPAC.enable();
          x.PACPremiumAmount.enable();
        }
        this.pACInsuranceProviderName = event.target.value
      }
      else if (value == 'VAS') {
        let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].vas['controls']
        if (isBool === true && productCategorySelected == 4) {
          x.fundingRequiredforVAS.setValue(this.FundingRequiredLOV[2].key),
            x.VASPremiumAmount.setValue('0')
          x.fundingRequiredforVAS.disable();
          x.VASPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          x.fundingRequiredforVAS.setValue(this.FundingRequiredLOV[0].key),
            x.VASPremiumAmount.setValue('10')
          x.fundingRequiredforVAS.enable();
          x.VASPremiumAmount.enable();
        }
        this.vASInsuranceProvidersName = event.target.value
      }
      else if (value == 'creditShield') {
        let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].life['controls']
        if (isBool === true && productCategorySelected == 4) {
          x.fundingRequiredforlifeCover.setValue(this.FundingRequiredLOV[2].key),
            x.lifeCoverPremiumAmount.setValue('0')
          x.fundingRequiredforlifeCover.disable();
          x.lifeCoverPremiumAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          x.fundingRequiredforlifeCover.setValue(this.FundingRequiredLOV[0].key),
            x.lifeCoverPremiumAmount.setValue('10')
          x.fundingRequiredforlifeCover.enable();
          x.lifeCoverPremiumAmount.enable();
        }
        this.creditShieldInsuranceProviderName = event.target.value
      }
      else if (value == 'fastTag') {
        let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag.get('fundingRequiredforFASTag');
        if (isBool === true && productCategorySelected == 2) {
          x.fundingRequiredforFASTag.setValue(this.FundingRequiredLOV[2].key),
            x.FASTagAmount.setValue('')
          x.fundingRequiredforFASTag.disable();
          x.FASTagAmount.disable();
        }
        else if (isBool === true && productCategorySelected != 2) {
          x.fundingRequiredforFASTag.setValue(this.FundingRequiredLOV[0].key),
            x.FASTagAmount.setValue('')
          x.fundingRequiredforFASTag.enable();
          x.FASTagAmount.enable();
        }
      }
    }
  }
  getRepayableMonths(event) {
    const selectedValu = this.createNegotiationForm.get('MoratoriumPeriod').value;
    if (Number(selectedValu.slice(0, 1))) {
      const ab = Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value) - (Number(selectedValu.slice(0, 1)) - 1);
      this.createNegotiationForm.get('NoofRepayableMonthsafterMoratorium').setValue(ab);
    }
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
          this.GapDaysIntPayMode = res.ProcessVariables.GapDaysIntPayMode;
          this.InsuranceSlabLOV = res.ProcessVariables.InsuranceSlabLOV;
          this.InsuranceSlabLOV.forEach((value) => {
            if (value.value.indexOf('.') != -1)
              value.value = value.value * 100 + '%';
          });
          this.EMIStartDateLOV = this.EMIStartDateLOV;
          this.FASTagReqLOV = this.FASTagReqLOV
          this.MoratoriumDaysLOV = res.ProcessVariables.MoratoriumDaysLOV;
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
    else
      this.createNegotiationForm.controls.NegotiatedLoanTenor.setValue(null)
  }
  calculateEMI(event) {
    let IRR = Number(event.target.value) / 1200;
    let loanAmount = this.createNegotiationForm.controls.NegotiatedLoanAmount.value ?
      Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value) : null;
    let loanTenor = this.createNegotiationForm.controls.NegotiatedLoanTenor.value ?
      Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value) : null;
    if (IRR && loanAmount && loanTenor)
      this.createNegotiationForm.controls.NegotiatedEMI.setValue(
        Math.round((loanAmount * IRR) / (1 - (Math.pow(1 / (1 + IRR), loanTenor)))));
    else
      this.toasterService.showError("Enter NegotiatedLoanAmount and NegotiatedLoanTenor", '')
  }
  getInsuranceLOV() {
    const productCode = this.createLeadDataService.getLeadSectionData();
    console.log('product code', productCode['leadDetails']['productCatCode']);
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
                this.PACInsuranceProvidersLOV.push(obj);
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
                  ManufacturingYear: [{ value: this.AssetDetailsList[i].ManufacturingDate ? new Date(this.AssetDetailsList[i].ManufacturingDate).getFullYear() : null, disabled: true }],
                  ageofAsset: [{ value: this.AssetDetailsList[i].AssetAge, disabled: true }],
                  eligibleLTV: [{ value: this.AssetDetailsList[i].EligibleLTV, disabled: true }],
                  promoCode: [{ value: this.AssetDetailsList[i].VehicleRegistrationNo, disabled: true }],
                  eligibleLoanAmount: [{ value: this.AssetDetailsList[i].EligibleLoanAmnt, disabled: true }],
                  eligibleLoanAmountAftersubvention: "34",
                  subventionAmount: "12",
                  incentiveAmount: "13",
                  eligibleLoanTenor: [{ value: (this.AssetDetailsList[i].EligibleTenorMax && this.AssetDetailsList[i].EligibleTenorMin) ? this.AssetDetailsList[i].EligibleTenorMax + " " + "To" + " " + this.AssetDetailsList[i].EligibleTenorMin + " " + "Years" : '', disabled: true }],
                  EligibleIRR: [{ value: (this.AssetDetailsList[i].EligibleIRRMin && this.AssetDetailsList[i].EligibleIRRMax) ? this.AssetDetailsList[i].EligibleIRRMin + " " + "To" + " " + this.AssetDetailsList[i].EligibleIRRMax : '', disabled: true }],
                  NegotiatedLoanAmount: [{ value: this.createNegotiationForm.controls.eligibleLoanAmount.value, disabled: true }],
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
                      fundingRequiredforMI: this.view == false ? this.FundingRequiredLOV[0].key : null,
                      MIPremiumAmount: this.view == false ? '10' : null,
                    }),
                    pac: this.fb.group({
                      creditShieldPAC: this.view == false ? this.PACInsuranceProvidersLOV ? this.PACInsuranceProvidersLOV[0].key : null : null,
                      PACPremiumAmount: this.view == false ? '10' : null,
                      fundingRequiredforPAC: this.view == false ? this.FundingRequiredLOV[0].key : null,
                    }),
                    life: this.fb.group({
                      creditShieldLifeCover: this.view == false ? this.creditShieldInsuranceProvidersLOV ? this.creditShieldInsuranceProvidersLOV[0].key : null : null,
                      fundingforLifeCover: this.view == false ? this.InsuranceSlabLOV[0].key : null,
                      lifeCoverPremiumAmount: this.view == false ? '10' : null,
                      fundingRequiredforlifeCover: this.view == false ? this.FundingRequiredLOV[0].key : null,
                    }),
                    vas: this.fb.group({
                      VAS: this.view == false ? this.VASInsuranceProvidersLOV ? this.VASInsuranceProvidersLOV[0].key : null : null,
                      VASPremiumAmount: this.view == false ? '10' : null,
                      fundingRequiredforVAS: this.view == false ? this.FundingRequiredLOV[0].key : null,
                    })
                  }),
                  fastTag: this.fb.group({
                    EquitasFASTagRequired: this.view == false ? this.FASTagReqLOV[0].key : null,
                    FASTagAmount: this.view == false ? '10' : null,
                    fundingRequiredforFASTag: this.view == false ? this.FundingRequiredLOV[0].key : null,
                    LoanAmountincludingCrossSell: [{ value: this.createNegotiationForm.controls.eligibleLoanAmount.value, disabled: true }],
                  }),
                }));
            }
          }
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
    this.getNetDisbursementAmount();
  }
  get f() { return this.createNegotiationForm.controls; }
  get t() { return this.f.tickets as FormArray; }
  get t1() { return this.f.tickets1 as FormArray; }
  get applicant1() { return this.f.coapplicant as FormArray; }
  get guarantor1() { return this.f.guarantorvalue as FormArray; }
  get a1() { return this.f.CrossSellInsurance as FormArray; }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          this.leadId = value.leadId;
          console.log("after resolve", this.leadId)
        }
        resolve(null);
      });
    });
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
          if(this.DeductionDetails[index].charge_type == 'P')
          {
            this.CombinedLoan.deductions[index].charge_ratio = ((Number(ticket.DeductionChargefixedRate))/(Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value)))* 100;
          }
          var obj = {
            charge_code: this.CombinedLoan.deductions[index].charge_code,
            charge_type: this.CombinedLoan.deductions[index].charge_type,
            charge_amount: ticket.DeductionChargefixedRate,
            charge_ratio: this.CombinedLoan.deductions[index].charge_ratio?this.CombinedLoan.deductions[index].charge_ratio.toString():"0",
            charge_name: this.CombinedLoan.deductions[index].charge_name,
          }
          this.Deductions.push(obj);
        });
      } else {
        this.Deductions = [];
        const deductions = formData.tickets1.forEach((ticket, index) => {
          if(this.DeductionDetails[index].DeductionChargeType == 'P')
          {
            this.DeductionDetails[index].DeductionChargeRatio = ((Number(ticket.DeductionChargefixedRate))/(Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value)))* 100;
          }
          var obj = {
            charge_code: this.DeductionDetails[index].DeductionChargeCode,
            charge_type: this.DeductionDetails[index].DeductionChargeType,
            charge_amount: ticket.DeductionChargefixedRate,
            charge_ratio: this.DeductionDetails[index].DeductionChargeRatio?this.DeductionDetails[index].DeductionChargeRatio.toString():"0",
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
        deductions: this.Deductions
      };

      this.CrossSellInsurance = [];
      this.CrossSellOthers = [];
      var array1 = [];
      var data = {};
      var data1 = {};
      const crossSellIns = formData.tickets.forEach((ticket, index) => {
        var obj = {
          collateral_id: this.AssetDetailsList[index].CollateralId,
          lms_collateral_id: this.AssetDetailsList[index].LMSCollaterId,
          unique_sub_lead_reference_id: this.AssetDetailsList[index].UniqueSubLeadId,
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
      console.log(this.finalAsset);
      const NegotiationDetails = {
        "LeadID": this.leadId,
        "NegotiationID": this.NegotiationId,
        "ApplicantJson": JSON.stringify(this.Applicants),
        "CombinedLoanJson": JSON.stringify(this.CombinedLoan),
        "AssetsJson": JSON.stringify(this.finalAsset),
        "IsCombinedLoan": "N"
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
          });
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
      this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor'].value
      this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac'].value
      this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life'].value
      this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas'].value
    });
    let x= this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']
let insuranceProviderName:String;
let insurancePercentage: string;
console.log('event val',this.lifecovervalueSelected)
    if (event == 'motor'){
      insuranceProviderName = this.valueSelected['motorInsurance']
    }else if(event =='creditShieldInsurance'){
      insuranceProviderName = this.lifecovervalueSelected['creditShieldLifeCover'];      
      insurancePercentage= this.InsuranceSlabLOV.filter(val => 
        val.key ==this.lifecovervalueSelected['fundingforLifeCover'] )[0].value
      console.log("lice cover",insurancePercentage =insurancePercentage.replace('%','').trim())
      // this.lifecovervalueSelected['creditShieldLifeCover']
    }
    const data = {
      insuranceProvider: Number(insuranceProviderName),// Number(this.valueSelected.motorInsurance),//icic chola
      insuranceType: insuranceType, // motor 
      // applicantId: this.LeadReferenceDetails[0].ApplicationId,
      leadId: Number(this.leadId),
      collateralId: Number(this.AssetDetailsList[i].CollateralId),
      loanAmount: Number(this.AssetDetailsList[i].EligibleLoanAmnt),
      loanTenure: Number(this.valueSelected.MITenure),
      loanPercentage: Number(12),
      isVas: true,
      isPac: true,

    }
    console.log("applicant detail", data)
    this.NegotiationService
      .fetchPreimumAmount(data)
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          
         
          // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].
          //   CrossSellInsurance['controls']['motor'];

          if (event == 'motor'){
          x.motor['controls'].MIPremiumAmount.setValue
          (res.ProcessVariables.miPremiumAmount);
          x.pac['controls'].PACPremiumAmount.setValue
          (res.ProcessVariables.pacPremiumAmount);
          x.vas['controls'].VASPremiumAmount.setValue
          (res.ProcessVariables.vasPremiumAmount);
        }else if(event =='creditShieldInsurance'){
          x.life['controls'].lifeCoverPremiumAmount.setValue
          (res.ProcessVariables.miPremiumAmount);

        }

          // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor'].value
          // this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac'].value
          // this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life'].value
          // this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas'].value
          // this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag.value
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
onNext(){
  if(this.roleType == '1') {
    this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
  } else if (this.roleType == '2' ) {
    this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
  } else if( this.roleType == '4' ) {
    this.router.navigate([`pages/cpc-maker/${this.leadId}/check-list`]);
  } else if(  this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.leadId}/check-list`]);
  }
  // this.router.navigateByUrl(`pages/credit-decisions/${this.leadId}/disbursement`)

}

}
