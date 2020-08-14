import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { UtilityService } from '@services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { NegotiationService } from './negotiation.service';
import { CreateLeadDataService } from '../lead-creation/service/createLead-data.service';
import { SSL_OP_NO_TICKET } from 'constants';
import { parseHostBindings } from '@angular/compiler';
import { element } from 'protractor';
import { SharedService } from '@modules/shared/shared-service/shared-service';
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
  enableEdit: boolean = false;
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
  CrossSellCrossSellInsIns = [];
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
  view: boolean = false;
  PACvalueSelected: any;
  VASvalueSelected: any;
  fastTagvalueSelected: any;
  valueSelected: any;
  lifecovervalueSelected: any;
  NegotiationId: any;
  leadData;
  constructor(
    private labelsData: LabelsService,
    private NegotiationService: NegotiationService,
    private fb: FormBuilder,
    private createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService,
    private sharedData: SharedService,
  ) { 
    this.sharedData.leadData$.subscribe((value) => {
      this.leadData = value;
    });
  }
  ngOnInit() {
    // const leadData = this.createLeadDataService.getLeadSectionData();
    // this.leadId = leadData['leadId']
    this.userId = localStorage.getItem('userId');
    this.onChangeLanguage('English');this.getLeadId();

    // this.initForm();
    this.getLabels();
    this.getLOV();
    this.getInsuranceLOV();
    this.loadForm();
    this.getAssetDetails();
    if (this.view)
      this.fetchValue();
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
      // addressProof: this.fb.array([this.initControls()]),
      productCode: '',
      applicant: '',
      CustomerCategory: '',
      coApplicant: '',
      coapplicantCategory: '',
      guarantor: '',
      guarantorCategory: '',
      reqLoanAmount: '',
      reqLoanTenor: '',
      NetDisbursementAmount: '2000',
      // EMIStartDateAfterDisbursement: '',
      vehicleModel: '',
      fundingProgram: '',
      ageofAsset: '',
      eligibleLTV: '',
      promoCode: '',
      eligibleLoanAmount: '2000',
      eligibleLoanAmountAftersubvention: '',
      subventionAmount: '',
      incentiveAmount: '',
      eligibleLoanTenor: '',
      EligibleIRR: '',
      regNo: '',
      ManufacturingYear: '',
      LoanAmountincludingCrossSellofalltheassets: ['', [Validators.required]],
      NegotiatedLoanAmount: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],
      NegotiatedLoanTenor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      NegotiatedIRR: ['', [Validators.required]],
      NegotiatedEMI: ['', [Validators.required]],
      MoratoriumPeriod: ['', [Validators.required]],
      EMICycle: ['', [Validators.required]],
      EMIStartDateAfterDisbursement: ['', [Validators.required]],
      PaymentModeforGapDaysInterest: ['', [Validators.required]],
      SelectAppropriateLMSScheduleCode: ['', [Validators.required]],
      NoofRepayableMonthsafterMoratorium: ['', [Validators.required]],
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
      Number(this.MItemp) + Number(this.createNegotiationForm.controls.eligibleLoanAmount.value);
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
        "NegotiatedLoanAmount": this.totalCrossSellAmt
      }
    )
    for (let i = 0; i < this.DeductionDetails.length; i++) {
      if (this.DeductionDetails[i].DeductionChargeType == "P") {
        percentDeductionValue = (Number(this.DeductionDetails[i].DeductionChargePercentage) / 100) * this.totalCrossSellAmt;
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
      NetDisbursementAmount: this.totalCrossSellAmt - sumValue - this.PremiumAmntSum
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
  getRepayableMonths() {
    const selectedValu = this.createNegotiationForm.get('MoratoriumPeriod').value;
    if (Number(selectedValu.slice(0, 1))) {
      const ab = Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value) - (Number(selectedValu.slice(0, 1)) - 1);
      this.createNegotiationForm.get('NoofRepayableMonthsafterMoratorium').setValue(ab);
    }
  }
  getLOV() {
    this.NegotiationService
      .getmotorInsuranceData().subscribe((res: any) => {
        this.motorInsuranceData = res.ProcessVariables
        this.EMICycleDaysLOV = res.ProcessVariables.EMICycleDaysLOV;
        var today = new Date();
        this.EMIDay = new Date(today.setDate(this.today.getDate() + 35)).getDate();
        let result = this.EMICycleDaysLOV.map(({ value }) => value).map(Number);
        const sortedvalue = result.sort((a, b) => a > b).find(x => x > this.EMIDay)
        let result1 = this.EMICycleDaysLOV.findIndex(x => x.value === sortedvalue + '');
        this.createNegotiationForm.patchValue({
          EMICycle: this.EMICycleDaysLOV[result1].key,
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
      }, );
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
    let IRR = Number(event.target.value);
    let loanAmount = this.createNegotiationForm.controls.NegotiatedLoanAmount.value ? Number(this.createNegotiationForm.controls.NegotiatedLoanAmount.value) : null;
    let loanTenor = this.createNegotiationForm.controls.NegotiatedLoanTenor.value ? Number(this.createNegotiationForm.controls.NegotiatedLoanTenor.value) : null;
    if (IRR && loanAmount && loanTenor)
      this.createNegotiationForm.controls.NegotiatedEMI.setValue(loanAmount * IRR / (1 - (Math.pow(1 / (1 + IRR), loanTenor))));
    else
      alert("Enter NegotiatedLoanAmount and NegotiatedLoanTenor")
  }
  getInsuranceLOV() {
  
    const  productCode = this.createLeadDataService.getLeadSectionData();
    console.log('product code',productCode['leadDetails']['productCatCode']);
const data={
  "ProductCode": productCode['leadDetails']['productCatCode']?
                productCode['leadDetails']['productCatCode']:null
}
    this.NegotiationService
      .getInsuranceLOV(data)
      .subscribe((res: any) => {
        this.productCategoryList = res.ProcessVariables.LOV;
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
      });
  }
  getAssetDetails() {
    this.NegotiationService
      .getAssetDetails(this.leadId)
      .subscribe((res: any) => {
        this.AssetDetailsList = res.ProcessVariables.AssetDetails;
        this.LeadReferenceDetails = res.ProcessVariables.LeadReferenceDetails;
        this.DeductionDetails = res.ProcessVariables.DeductionDetails;
        var LMSScheduletemp = res.ProcessVariables.LMSSchedule;
        // this.DeductionDetails
        LMSScheduletemp.forEach(element => {
          var obj =
          {
            key: element.ScheduleTypeCode,
            value: element.ScheduleTypeName
          }
          this.LMSSchedule.push(obj)
        })
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
          coApplicant: this.LeadReferenceDetails.filter(item => item['LoanApplicationRelation'] == "COAPPAPPRELLEAD").map(item => item['FullName']).join(),
          coapplicantCategory: this.LeadReferenceDetails.filter(item => item['LoanApplicationRelation'] == "COAPPAPPRELLEAD").map(item => item['CustomerCategory']).join(),
        });
        // for (let i = 0; i < this.AssetDetailsList.length; i++) {
        // }
        if (this.t.length < this.AssetDetailsList.length) {
          for (let i = this.t.length; i < this.AssetDetailsList.length; i++) {
            this.motarButtonFlag.push(false);
            this.PACButtonFlag.push(false);
            this.lifeButtonFlag.push(false);
            this.VASButtonFlag.push(false);
            this.t.push(
              this.fb.group({
                vehicleModel: this.AssetDetailsList[i].VehicleModel,
                fundingProgram: this.AssetDetailsList[i].FundingProgram,
                regNo: this.AssetDetailsList[i].VehicleRegistrationNo?
                      this.AssetDetailsList[i].VehicleRegistrationNo.toUpperCase(): null,
                ManufacturingYear: new Date(this.AssetDetailsList[i].ManufacturingDate).getFullYear(),
                ageofAsset: this.AssetDetailsList[i].AssetAge,
                eligibleLTV: this.AssetDetailsList[i].EligibleLTV,
                promoCode: this.AssetDetailsList[i].VehicleRegistrationNo,
                eligibleLoanAmount: "2000",
                eligibleLoanAmountAftersubvention: "34",
                subventionAmount: "12",
                incentiveAmount: "13",
                eligibleLoanTenor: this.AssetDetailsList[i].EligibleTenorMax + " " + "To" + " " + this.AssetDetailsList[i].EligibleTenorMin,
                EligibleIRR: this.AssetDetailsList[i].EligibleIRRMin + " " + "To" + " " + this.AssetDetailsList[i].EligibleIRRMax,
                NegotiatedLoanAmount: ['',],
                NegotiatedLoanTenor: ['',],
                NegotiatedIRR: ['',],
                NegotiatedEMI: ['',],
                MoratoriumPeriod: ['',],
                EMICycle: ['',],
                EMIStartDateAfterDisbursement: ['',],
                PaymentModeforGapDaysInterest: ['',],
                SelectAppropriateLMSScheduleCode: ['',],
                NoofRepayableMonthsafterMoratorium: ['',],
                netAssetCost: this.AssetDetailsList[i].FinalAssetCost,
                CrossSellInsurance: this.fb.group({
                  motor: this.fb.group({
                    motorInsurance: this.view == false ? this.InsuranceProvidersLOV[0].key : null,
                    MITenure: '1',
                    fundingRequiredforMI: this.view == false ? this.FundingRequiredLOV[0].key : null,
                    MIPremiumAmount: this.view == false ? '10' : null,
                  }),
                  pac: this.fb.group({
                    creditShieldPAC: this.view == false ? this.PACInsuranceProvidersLOV[0].key : null,
                    PACPremiumAmount: this.view == false ? '10' : null,
                    fundingRequiredforPAC: this.view == false ? this.FundingRequiredLOV[0].key : null,
                  }),
                  life: this.fb.group({
                    creditShieldLifeCover: this.view == false ? this.creditShieldInsuranceProvidersLOV[0].key : null,
                    fundingforLifeCover: '',
                    lifeCoverPremiumAmount: this.view == false ? '10' : null,
                    fundingRequiredforlifeCover: this.view == false ? this.FundingRequiredLOV[0].key : null,
                  }),
                  vas: this.fb.group({
                    VAS: this.view == false ? this.VASInsuranceProvidersLOV[0].key : null,
                    VASPremiumAmount: this.view == false ? '10' : null,
                    fundingRequiredforVAS: this.view == false ? this.FundingRequiredLOV[0].key : null,
                  })
                }),
                fastTag: this.fb.group({
                  EquitasFASTagRequired: this.view == false ? this.FASTagReqLOV[0].key : null,
                  FASTagAmount: this.view == false ? '10' : null,
                  fundingRequiredforFASTag: this.view == false ? this.FundingRequiredLOV[0].key : null,
                  LoanAmountincludingCrossSell: this.createNegotiationForm.controls.eligibleLoanAmount.value,
                }),
              }));
          }
        }
      });
    this.getNetDisbursementAmount();
  }
  get f() { return this.createNegotiationForm.controls; }
  get t() { return this.f.tickets as FormArray; }
  get t1() { return this.f.tickets1 as FormArray; }
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
    this.LeadReferenceDetails.forEach((element) => {
      var obj = {
        UCIC: element.UCIC,
        ApplicantId: element.ApplicationId,
        WizardLeadId: element.WizardLeadId,
        CustomerCategory: element.CustomerCategory,
        LoanApplicationRelation: element.LoanApplicationRelation,
        LoanApplicationRelationValue: element.LoanApplicationRelationValue
      }
      this.Applicants.push(obj);
    });
    this.DeductionDetails.forEach((element) => {
      var obj = {
        ChargeCode: element.DeductionChargeCode,
        ChargeType: element.DeductionChargeType,
        ChargeAmount: element.DeductionChargefixedRate,
        ChargeRatio: '0',
        ChargeName: element.DeductionChargeName,
      }
      this.Deductions.push(obj);
    });
    this.CombinedLoan = {
      NegotiatedLoanAmt: parseInt(this.createNegotiationForm.controls.NegotiatedLoanAmount.value),
      SubventionAmnt: parseInt(this.createNegotiationForm.controls.subventionAmount.value),
      LoanAmntBooked: parseInt(this.createNegotiationForm.controls.NegotiatedLoanAmount.value),
      IncentiveAmnt: parseInt(this.createNegotiationForm.controls.incentiveAmount.value),
      TotalInsurancePremiumAmnt: this.PremiumAmntSum,
      TotalOtherCrossSellAmnt: this.fastTagAmtSum,
      NegotiatedIRR: parseInt(this.createNegotiationForm.controls.NegotiatedIRR.value),
      MoratoriumDays: this.createNegotiationForm.controls.MoratoriumPeriod.value,
      NegotiateddTenorDays: this.createNegotiationForm.controls.NegotiatedLoanTenor.value,
      EMICycleDay: this.createNegotiationForm.controls.EMICycle.value,
      GapDaysPaymentmode: this.createNegotiationForm.controls.PaymentModeforGapDaysInterest.value,
      LMSScheduleCode: parseInt(this.createNegotiationForm.controls.SelectAppropriateLMSScheduleCode.value),
      EMICycleStart: this.createNegotiationForm.controls.EMICycle.value
    };
    this.t.controls.forEach(() => {
      this.AssetDetailsList.forEach((element) => {
        var obj = {
          TotalInsurancePremiumAmnt: this.PremiumAmntSum,
          TotalOtherCrossSellAmnt: this.fastTagAmtSum,
          CollateralId: parseInt(element.CollateralId),
          LMSCollaterId: element.LMSCollaterId,
          UniqueSubLeadId: element.UniqueSubLeadId
        }
        this.Asset.push(obj);
      });
    });
    const formData = this.createNegotiationForm.getRawValue();
    this.CrossSellInsurance = [];
    this.CrossSellOthers = [
    ]
    const crossSellIns = formData.tickets.forEach((ticket, index) => {
      Object.keys(ticket.CrossSellInsurance).forEach(key => {
        const i = {};
        i['CollateralId'] = parseInt(this.AssetDetailsList[index].CollateralId),
          i['insuranceCode'] = ticket.CrossSellInsurance[key].motorInsurance || ticket.CrossSellInsurance[key].creditShieldPAC || ticket.CrossSellInsurance[key].creditShieldLifeCover || ticket.CrossSellInsurance[key].VAS,
          i['FndREInsuranceCode'] = ticket.CrossSellInsurance[key].fundingRequiredforMI || ticket.CrossSellInsurance[key].fundingRequiredforPAC || ticket.CrossSellInsurance[key].fundingRequiredforVAS || ticket.CrossSellInsurance[key].fundingRequiredforlifeCover,
          i['PremiumAmnt'] = ticket.CrossSellInsurance[key].MIPremiumAmount || ticket.CrossSellInsurance[key].PACPremiumAmount || ticket.CrossSellInsurance[key].lifeCoverPremiumAmount || ticket.CrossSellInsurance[key].VASPremiumAmount,
          i['InsLab'] = ticket.CrossSellInsurance[key].fundingforLifeCover
        this.CrossSellInsurance.push(i);
      })
      const fasttagValue = {
        CollateralId: parseInt(this.AssetDetailsList[index].CollateralId),
        CrossSellType: ticket.fastTag.EquitasFASTagRequired,
        FndReq: ticket.fastTag.fundingRequiredforFASTag,
        Amount: ticket.fastTag.FASTagAmount,
      }
      this.CrossSellOthers.push(fasttagValue);
    });
    this.NegotiationService
      .submitNegotiation(this.leadId, this.userId, this.NegotiationId, this.Applicants, this.CombinedLoan, this.Deductions, this.Asset,
        this.CrossSellInsurance, this.CrossSellOthers)
      .subscribe((res: any) => {
        this.NegotiationId = res.ProcessVariables.NegotiationId;
      });
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
      .viewNegotiationData(this.NegotiationId).subscribe((res: any) => {
        this.CombinedLoan = res.ProcessVariables.CombinedLoan;
        this.createNegotiationForm.patchValue({
          EMICycle: this.CombinedLoan.EMICycleDay.toString(),
          MoratoriumPeriod: this.CombinedLoan.MoratoriumDays.toString(),
          NegotiatedIRR: this.CombinedLoan.NegotiatedIRR,
          NegotiatedLoanAmount: this.CombinedLoan.NegotiatedLoanAmt,
          NegotiatedLoanTenor: this.CombinedLoan.NegotiateddTenorDays,
          EMIStartDateAfterDisbursement: this.CombinedLoan.EMICycleStart.toString(),
          PaymentModeforGapDaysInterest: this.CombinedLoan.GapDaysPaymentmode.toString(),
          SelectAppropriateLMSScheduleCode: this.CombinedLoan.LMSScheduleCode,
        });
        this.DeductionDetails = res.ProcessVariables.deductions;
        for (let i = this.t1.length; i < this.DeductionDetails.length; i++) {
          this.deductionLabel[i] = this.DeductionDetails[i].ChargeName;
          if (this.DeductionDetails[i].DeductionChargeType != "P")
            this.DeductionDetails[i].DeductionChargefixedRate = this.DeductionDetails[i].DeductionChargefixedRate;
          this.t1.push(this.fb.group({
            DeductionChargefixedRate: this.DeductionDetails[i].ChargeAmount,
          }));
        };
        this.CrossSellIns = res.ProcessVariables.CrossSellIns;
        const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
          this.CrossSellIns.forEach(key => {
            const i = {};
            this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['motor']
            this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['pac']
            this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['life']
            this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['vas']
            this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].fastTag
            // if(i['CollateralId']  == parseInt(this.AssetDetailsList[index].CollateralId))
            // {
            this.valueSelected['controls'].motorInsurance.setValue(key['InsuranceCode']);
            this.valueSelected['controls'].MIPremiumAmount || this.PACvalueSelected['controls'].PACPremiumAmount || 
            this.PACvalueSelected['controls'].lifeCoverPremiumAmount || this.PACvalueSelected['controls'].VASPremiumAmount.setValue(key['PremiumAmnt']);
            // this.PACvalueSelected['controls'].PACPremiumAmount.setValue(key['PremiumAmnt']);
            // this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(key['PremiumAmnt']);
            // this.VASvalueSelected['controls'].VASPremiumAmount.setValue(key['PremiumAmnt']);
            this.valueSelected['controls'].fundingRequiredforMI.setValue(key['FndREInsuranceCode']);
            // }
          })
          this.CrossSellOthers = res.ProcessVariables.CrossSellOthers;
          this.CrossSellOthers.forEach(key => {
            if (key.CollateralId == this.AssetDetailsList[index].CollateralId) {
              this.fastTagvalueSelected['controls'].EquitasFASTagRequired.setValue(key['CrossSellType']);
              this.fastTagvalueSelected['controls'].fundingRequiredforFASTag.setValue(key['FndReq']);
              this.fastTagvalueSelected['controls'].FASTagAmount.setValue(key['Amount']);
            }
          })
        });
      });
  }
}
