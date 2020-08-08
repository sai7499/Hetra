import { Component, OnInit, ViewEncapsulation, AbstractType } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { UtilityService } from '@services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { NegotiationService } from './negotiation.service';
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
  CombinedLoan: {};
  Asset = [];
  Asset1 = [];
  Asset2 = [];
  InsuranceProvidersLabel = [];
  DeductionDetails = [];
  Deductions = [];
  CrossSellIns = [];
  CrossSellOthers = [];
  DeductionChargeName: any;
  c: any;
  b: any;
  a: any;
  userId: string;
  sample = [];
  CrossSellInsurance: any;
  SelectAppropriateLMSScheduleCode;
  roleType: any;
  constructor(
    private labelsData: LabelsService,
    private NegotiationService: NegotiationService,
    private fb: FormBuilder,
    private loginStoreService: LoginStoreService
  ) { }
  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.onChangeLanguage('English');
    // this.initForm();
    this.getLabels();
    this.getLOV();
    this.getInsuranceLOV();
    this.loadForm();
    setTimeout(() => { this.getAssetDetails(); }, 1000);
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '4' || this.roleType == '5') {
    console.log(this.createNegotiationForm,  this.t) ;
    this.createNegotiationForm.disable();
    this.t.disable();
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
      (error) => console.log('Lead Creation Label Error', error)
    );
    
  }
  loadForm() {
    this.createNegotiationForm = this.fb.group({
      tickets: new FormArray([]),
      tickets1: new FormArray([]),
      CrossSellInsurance: new FormArray([
        this.fb.group({
          motorInsurance: '',
          fundingRequiredforMI: '',
          MIPremiumAmount: '',
          MITenure: '',
        }),
        this.fb.group({
          creditShieldPAC: '',
          fundingRequiredforPAC: '',
          PACPremiumAmount: '',

        }),
        this.fb.group({
          creditShieldLifeCover: '',
          fundingforLifeCover: '',
          lifeCoverPremiumAmount: '',
        }),
        this.fb.group({
          VAS: '',
          fundingRequiredforVAS: '',
          VASPremiumAmount: '',
        })]),

      // addressProof: this.fb.array([this.initControls()]),
      productCode: '',
      applicant: '',
      coApplicant: '',
      guarantor: '',
      reqLoanAmount: '',
      reqLoanTenor: '',
      ProcessingFee: '',
      DeductionChargefixedRate: '',
      DocumentationCharges: '',
      ValuationFee: '',
      CreditShieldCharges: '',
      MotorInsuranceCharges: '',
      PACCharges: '',
      VASCharges: '',
      RTOCharges: '',
      NetDisbursementAmount: '',
      EMIStartDateAfterDisbursement: '',
      vehicleModel: '',
      fundingProgram: '',
      ageofAsset: '',
      eligibleLTV: '',
      promoCode: '',
      eligibleLoanAmount: '',
      eligibleLoanAmountAftersubvention: '',
      subventionAmount: '',
      incentiveAmount: '',
      eligibleLoanTenor: '',
      EligibleIRR: '',
      regNo: '',
      ManufacturingYear: '',
      LoanAmountincludingCrossSell: '',
      LoanAmountincludingCrossSellofalltheassets: '',
      NegotiatedLoanAmount: '',
      NegotiatedLoanTenor: '',
      NegotiatedIRR: '',
      NegotiatedEMI: '',
      MoratoriumPeriod: '',
      EMICycle: '',
      EMIStartDateLOVAfterDisbursement: '',
      PaymentModeforGapDaysInterest: '',
      SelectAppropriateLMSScheduleCode: '',
      NoofRepayableMonthsafterMoratorium: '',
      netAssetCode: '',
      EquitasFASTagRequired: '',
      FASTagAmount: '',
      fundingRequiredforFASTag: ''
    })
    // this.createNegotiationForm = 
  }
  calculateTotal(event, isBool, value, i) {
    console.log("event", event)
    const productCategorySelected = isBool ? event.target.value : event;
    this.a = "0";
    this.b = "0";
    this.c = "0";
    if (isBool === true && value == "MI") {
      if (productCategorySelected == 2) {
        this.t.value[i].fundingRequiredforPAC === "1" ? this.a = this.t.value[i].PACPremiumAmount : "0"
        this.t.value[i].fundingRequiredforVAS === "1" ? this.b = this.t.value[i].VASPremiumAmount : "0"
        this.t.value[i].fundingRequiredforFASTag === "1" ? this.c = this.t.value[i].FASTagAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
      else if (productCategorySelected == 1) {
        this.t.value[i].fundingRequiredforPAC === "1" ? this.a = this.t.value[i].PACPremiumAmount : "0"
        this.t.value[i].fundingRequiredforVAS === "1" ? this.b = this.t.value[i].VASPremiumAmount : "0"
        this.t.value[i].fundingRequiredforFASTag === "1" ? this.c = this.t.value[i].FASTagAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c) + Number(this.t.value[i].MIPremiumAmount)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
    }
    else if (isBool === true && value == "PAC") {
      if (productCategorySelected == 2) {
        this.t.value[i].fundingRequiredforMI === "1" ? this.a = this.t.value[i].MIPremiumAmount : "0"
        this.t.value[i].fundingRequiredforVAS === "1" ? this.b = this.t.value[i].VASPremiumAmount : "0"
        this.t.value[i].fundingRequiredforFASTag === "1" ? this.c = this.t.value[i].FASTagAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
      else if (productCategorySelected == 1) {
        this.t.value[i].fundingRequiredforMI === "1" ? this.a = this.t.value[i].MIPremiumAmount : "0"
        this.t.value[i].fundingRequiredforVAS === "1" ? this.b = this.t.value[i].VASPremiumAmount : "0"
        this.t.value[i].fundingRequiredforFASTag === "1" ? this.c = this.t.value[i].FASTagAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c) + Number(this.t.value[i].PACPremiumAmount)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
    }
    else if (isBool === true && value == "VAS") {
      if (productCategorySelected == 2) {
        this.t.value[i].fundingRequiredforPAC == '1' ? this.a = this.t.value[i].PACPremiumAmount : "0"
        this.t.value[i].fundingRequiredforMI == '1' ? this.b = this.t.value[i].MIPremiumAmount : "0"
        this.t.value[i].fundingRequiredforFASTag == '1' ? this.c = this.t.value[i].FASTagAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
      else if (productCategorySelected == 1) {
        this.t.value[i].fundingRequiredforPAC == '1' ? this.a = this.t.value[i].PACPremiumAmount : "0"
        this.t.value[i].fundingRequiredforMI == '1' ? this.b = this.t.value[i].MIPremiumAmount : "0"
        this.t.value[i].fundingRequiredforFASTag == '1' ? this.c = this.t.value[i].FASTagAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c) + Number(this.t.value[i].VASPremiumAmount)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
    }
    else if (isBool === true && value == "fastTag") {
      if (productCategorySelected == 2) {
        this.t.value[i].fundingRequiredforPAC == '1' ? this.a = this.t.value[i].PACPremiumAmount : "0"
        this.t.value[i].fundingRequiredforVAS == '1' ? this.b = this.t.value[i].VASPremiumAmount : "0"
        this.t.value[i].fundingRequiredforMI == '1' ? this.c = this.t.value[i].MIPremiumAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
      else if (productCategorySelected == 1) {
        this.t.value[i].fundingRequiredforPAC == '1' ? this.a = this.t.value[i].PACPremiumAmount : "0"
        this.t.value[i].fundingRequiredforVAS == '1' ? this.b = this.t.value[i].VASPremiumAmount : "0"
        this.t.value[i].fundingRequiredforMI == '1' ? this.c = this.t.value[i].MIPremiumAmount : "0"
        const loanamount =
          Number(this.a) +
          Number(this.b) + Number(this.t.value[i].lifeCoverPremiumAmount) +
          Number(this.c) + Number(this.t.value[i].FASTagAmount)
        this.t.at(i).patchValue({
          LoanAmountincludingCrossSell: loanamount.toString()
        });
      }
    }
  }
  getUIValues(event, isBool, value, i) {
    const productCategorySelected = isBool ? event.target.value : event;
    console.log("ticket.value.motorInsurance", i.value)
    {
      if (value == 'MI') {
        if (isBool === true && productCategorySelected == 4) {
          let x = this.t.at(i);
          x.patchValue({
            MITenure: "0",
            fundingRequiredforMI: this.FundingRequiredLOV[2].key,
            MIPremiumAmount: '0',
          });
          x.get('MITenure').disable();
          x.get('fundingRequiredforMI').disable();
          x.get('MIPremiumAmount').disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          let x = this.t.at(i);
          x.patchValue({
            MITenure: '1',
            fundingRequiredforMI: this.FundingRequiredLOV[0].key,
            MIPremiumAmount: ''
          });
          x.get('MITenure').enable();
          x.get('fundingRequiredforMI').enable();
          x.get('MIPremiumAmount').enable();
        }
      }
      else if (value == 'PAC') {
        if (isBool === true && productCategorySelected == 4) {
          let x = this.t.at(i);
          x.patchValue({
            fundingRequiredforPAC: this.FundingRequiredLOV[2].key,
            PACPremiumAmount: '0'
          });
          x.get('fundingRequiredforPAC').disable();
          x.get('PACPremiumAmount').disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          let x = this.t.at(i);
          x.patchValue({
            fundingRequiredforPAC: this.FundingRequiredLOV[0].key,
            PACPremiumAmount: ''
          });
        }
      }
      else if (value == 'VAS') {
        if (isBool === true && productCategorySelected == 4) {
          let x = this.t.at(i);
          x.patchValue({
            fundingRequiredforVAS: this.FundingRequiredLOV[2].key,
            VASPremiumAmount: '0'
          });
          x.get('fundingRequiredforVAS').disable();
          x.get('VASPremiumAmount').disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          let x = this.t.at(i);
          x.patchValue({
            fundingRequiredforVAS: this.FundingRequiredLOV[0].key,
            VASPremiumAmount: ''
          });
        }
      }
      else if (value == 'creditShield') {
        if (isBool === true && productCategorySelected == 4) {
          let x = this.t.at(i);
          x.patchValue({
            fundingforLifeCover: this.InsuranceSlabLOV[6].key,
            lifeCoverPremiumAmount: '0'
          });
          x.get('fundingforLifeCover').disable();
          x.get('lifeCoverPremiumAmount').disable();
        }
        else if (isBool === true && productCategorySelected != 4) {
          let x = this.t.at(i);
          x.patchValue({
            fundingforLifeCover: this.InsuranceSlabLOV[0].key,
            lifeCoverPremiumAmount: ''
          });
          x.get('fundingforLifeCover').enable();
          x.get('lifeCoverPremiumAmount').enable();
        }
      }
      else if (value == 'fastTag') {
        if (isBool === true && productCategorySelected == 2) {
          let x = this.t.at(i);
          x.patchValue({
            fundingRequiredforFASTag: this.FundingRequiredLOV[2].key
          });
          x.get('fundingRequiredforFASTag').disable();
        }
        else if (isBool === true && productCategorySelected != 2) {
          let x = this.t.at(i);
          x.patchValue({
            fundingRequiredforFASTag: this.FundingRequiredLOV[0].key,
          });
          x.get('fundingRequiredforFASTag').enable();
        }
      }
    }
  }
  getLOV() {
    this.NegotiationService
      .getmotorInsuranceData().subscribe((res: any) => {
        this.motorInsuranceData = res.ProcessVariables
        this.EMICycleDaysLOV = res.ProcessVariables.EMICycleDaysLOV;
        this.InsuranceSlabLOV = res.ProcessVariables.InsuranceSlabLOV
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
        // this.createNegotiationForm.patchValue({
        //   fundingRequiredforMI: this.FundingRequiredLOV[0].key,
        //   fundingRequiredforPAC: this.FundingRequiredLOV[0].key,
        //   fundingRequiredforVAS: this.FundingRequiredLOV[0].key,
        //   fundingRequiredforFASTag: this.FundingRequiredLOV[0].key,
        //   EquitasFASTagRequired: this.FASTagLOV[0].key
        // });
        this.MoratoriumDaysLOV = res.ProcessVariables.MoratoriumDaysLOV;
        // this.TypesOfInsuranceLOV = res.ProcessVariables.TypesOfInsuranceLOV
        console.log("motor insurance", this.motorInsuranceData)
      }, error => {
        console.log(error, 'error');
      });
  }
  getInsuranceLOV() {
    this.NegotiationService
      .getInsuranceLOV()
      .subscribe((res: any) => {
        this.productCategoryList = res.ProcessVariables.LOV;
        console.log("productCategoryList", this.productCategoryList)
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
        console.log("InsuranceProvidersLabel", this.InsuranceProvidersLabel)
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
            this.VASInsuranceProvidersLOV.push(obj);
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
            this.PACInsuranceProvidersLOV.push(obj);
          }
        });
      });
  }
  getAssetDetails() {
    this.NegotiationService
      .getAssetDetails()
      .subscribe((res: any) => {
        this.AssetDetailsList = res.ProcessVariables.AssetDetails;
        this.LeadReferenceDetails = res.ProcessVariables.LeadReferenceDetails;
        this.DeductionDetails = res.ProcessVariables.DeductionDetails;
        console.log("deduct", this.DeductionDetails)
        // this.DeductionDetails
        const numberOfTickets1 = this.DeductionDetails.length;
        console.log("t, numbe", this.t, numberOfTickets1)
        if (this.t1.length < numberOfTickets1) {
          for (let i = this.t1.length; i < numberOfTickets1; i++) {
            this.sample[i] = this.DeductionDetails[i].DeductionChargeName;
            if (this.DeductionDetails[i].DeductionChargeType == "P")
              this.DeductionDetails[i].DeductionChargefixedRate = this.DeductionDetails[i].DeductionChargePercentage * 100;
            else
              this.DeductionDetails[i].DeductionChargefixedRate = this.DeductionDetails[i].DeductionChargefixedRate;
            this.t1.push(this.fb.group({
              DeductionChargefixedRate: this.DeductionDetails[i].DeductionChargefixedRate,
            }));
          };
        }
        console.log("AssetDetailsList", this.AssetDetailsList, this.LeadReferenceDetails)
        const productCode = this.LeadReferenceDetails[0].LMSProductCode + "-"
          + this.LeadReferenceDetails[0].LMSProductName;
        this.createNegotiationForm.patchValue({
          productCode: productCode,
          applicant: this.LeadReferenceDetails[0].FullName,
          reqLoanAmount: this.LeadReferenceDetails[0].RequestLoanAmnt,
          reqLoanTenor: this.LeadReferenceDetails[0].RequestedLoanTenure,
          coApplicant: this.LeadReferenceDetails.filter(item => item['LoanApplicationRelation'] == "COAPPAPPRELLEAD").map(item => item['FullName']).join()
        });
        const numberOfTickets = this.AssetDetailsList.length;
        console.log("t, numbe", this.t, numberOfTickets)
        if (this.t.length < numberOfTickets) {
          for (let i = this.t.length; i < numberOfTickets; i++) {
            this.t.push(this.fb.group({
              vehicleModel: '',
              fundingProgram: '',
              regNo: this.AssetDetailsList[i].VehicleRegistrationNo,
              ManufacturingYear: this.AssetDetailsList[i].ManufacturingDate,
              ageofAsset: this.AssetDetailsList[i].AssetAge,
              eligibleLTV: this.AssetDetailsList[i].VehicleRegistrationNo,
              promoCode: this.AssetDetailsList[i].VehicleRegistrationNo,
              eligibleLoanAmount: "1000",
              eligibleLoanAmountAftersubvention: "500",
              subventionAmount: '500',
              incentiveAmount: this.AssetDetailsList[i].VehicleRegistrationNo,
              eligibleLoanTenor: this.AssetDetailsList[i].VehicleRegistrationNo,
              EligibleIRR: '',
              EquitasFASTagRequired: '',
              FASTagAmount: '10',
              fundingRequiredforFASTag: this.FundingRequiredLOV[0].key,
              LoanAmountincludingCrossSell: '0',
              LoanAmountincludingCrossSellofalltheassets: '',
              NegotiatedLoanAmount: '',
              NegotiatedLoanTenor: '',
              NegotiatedIRR: '',
              NegotiatedEMI: '',
              MoratoriumPeriod: '',
              EMICycle: '',
              EMIStartDateLOVAfterDisbursement: '',
              PaymentModeforGapDaysInterest: '',
              SelectAppropriateLMSScheduleCode: '',
              NoofRepayableMonthsafterMoratorium: '',
              netAssetCode: this.AssetDetailsList[i].FinalAssetCost,
            }));
            console.log("FORMmmmm", this.createNegotiationForm.controls.CrossSellInsurance)
            this.createNegotiationForm.controls.CrossSellInsurance['controls']['0'].patchValue({
              motorInsurance: this.InsuranceProvidersLOV[0].key,
              MITenure: '1',
              fundingRequiredforMI: this.FundingRequiredLOV[0].key,
              MIPremiumAmount: '10',
            })
            this.createNegotiationForm.controls.CrossSellInsurance['controls']['1'].patchValue({
              creditShieldPAC: this.PACInsuranceProvidersLOV[0].key,
              PACPremiumAmount: '10',
              fundingRequiredforPAC: this.FundingRequiredLOV[0].key,
            })
            this.createNegotiationForm.controls.CrossSellInsurance['controls']['2'].patchValue({
              creditShieldLifeCover: this.creditShieldInsuranceProvidersLOV[0].key,
              fundingforLifeCover: '',
              lifeCoverPremiumAmount: '10',
            })
            this.createNegotiationForm.controls.CrossSellInsurance['controls']['3'].patchValue({
              VAS: this.VASInsuranceProvidersLOV[0].key,
              VASPremiumAmount: '10',
              fundingRequiredforVAS: this.FundingRequiredLOV[0].key,
            })
            console.log("abcc", this.createNegotiationForm.controls.CrossSellInsurance.value)
          }
        }
      });
  }
  get f() { return this.createNegotiationForm.controls; }
  get t() { return this.f.tickets as FormArray; }
  get t1() { return this.f.tickets1 as FormArray; }
  get a1(){ return this.f.CrossSellInsurance as FormArray;}
  onSubmit() {
    const formData = this.createNegotiationForm.getRawValue();
    console.log("hi", this.createNegotiationForm.getRawValue());

    this.CrossSellInsurance = formData.CrossSellInsurance;
   
      this.AssetDetailsList.forEach((element) => {
        this.CrossSellInsurance.forEach(Ins => {
      var obj = {
        CollateralId: parseInt(element.CollateralId),
        insuranceCode: Ins.motorInsurance || Ins.creditShieldPAC || Ins.creditShieldLifeCover || Ins.VAS,
        FndREInsuranceCode: Ins.fundingRequiredforMI || Ins.fundingRequiredforPAC || Ins.fundingRequiredforVAS,
        PremiumAmnt: Ins.MIPremiumAmount || Ins.PACPremiumAmount || Ins.lifeCoverPremiumAmount || Ins.VASPremiumAmount,
        InsLab: Ins.fundingforLifeCover
      }
      this.CrossSellIns.push(obj)
    });
    console.log("hiaaa", this.CrossSellIns);
  });
    // this.CrossSellOthers = [
    //   {
    //     CollateralId: 14,
    //     CrossSellType: formData.EquitasFASTagRequired,
    //     FndReq: formData.fundingRequiredforFASTag,
    //     Amount: formData.FASTagAmount,
    //   }
    // ]
    // console.log("mowniii", this.CrossSellIns)
    // this.LeadReferenceDetails.forEach((element) => {
    //   var obj = {
    //     UCIC: element.UCIC,
    //     ApplicantId: element.ApplicationId,
    //     WizardLeadId: element.WizardLeadId,
    //     CustomerCategory: element.CustomerCategory,
    //     LoanApplicationRelation: element.LoanApplicationRelation,
    //     LoanApplicationRelationValue: element.LoanApplicationRelationValue
    //   }
    //   this.Applicants.push(obj);
    // });
    // this.DeductionDetails.forEach((element) => {
    //   var obj = {
    //     ChargeCode: element.DeductionChargeCode,
    //     ChargeType: element.DeductionChargeType,
    //     ChargeAmount: element.DeductionChargefixedRate,
    //     ChargeRatio: '',
    //     ChargeName: element.DeductionChargeName,
    //   }
    //   this.Deductions.push(obj);
    // });
    // this.CombinedLoan = {
    //   NegotiatedLoanAmt: parseInt(this.createNegotiationForm.controls.NegotiatedLoanAmount.value),
    //   SubventionAmnt: parseInt(this.createNegotiationForm.controls.subventionAmount.value),
    //   LoanAmntBooked: 1000,
    //   IncentiveAmnt: parseInt(this.createNegotiationForm.controls.incentiveAmount.value),
    //   TotalInsurancePremiumAmnt: 1000,
    //   TotalOtherCrossSellAmnt: 1000,
    //   NegotiatedIRR: parseInt(this.createNegotiationForm.controls.NegotiatedIRR.value),
    //   MoratoriumDays: parseInt(this.createNegotiationForm.controls.MoratoriumPeriod.value),
    //   NegotiateddTenorDays: parseInt(this.createNegotiationForm.controls.NegotiatedLoanTenor.value),
    //   EMICycleDay: parseInt(this.createNegotiationForm.controls.EMICycle.value),
    //   GapDaysPaymentmode: parseInt(this.createNegotiationForm.controls.PaymentModeforGapDaysInterest.value),
    //   LMSScheduleCode: 12,
    //   EMICycleStart: parseInt(this.createNegotiationForm.controls.EMICycle.value),
    // };
    // this.t.controls.forEach(() => {
    //   this.AssetDetailsList.forEach((element) => {
    //     var obj = {
    //       TotalInsurancePremiumAmnt: 5,
    //       TotalOtherCrossSellAmnt: 10,
    //       CollateralId: parseInt(element.CollateralId),
    //       LMSCollaterId: element.LMSCollaterId,
    //       UniqueSubLeadId: element.UniqueSubLeadId
    //     }
    //     this.Asset.push(obj);
    //   });
    // });
    // console.log("ASSET", this.Asset)
    // this.NegotiationService
    //   .submitNegotiation(this.userId, this.Applicants, this.CombinedLoan, this.Deductions, this.Asset,
    //     this.CrossSellIns, this.CrossSellOthers)
    //   .subscribe((res: any) => {
    //   });
  }
}
