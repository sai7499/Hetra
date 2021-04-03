import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { LoanViewService } from '@services/loan-view.service';
import { Location } from '@angular/common';
import { UtilityService } from '@services/utility.service';
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
  RepaymentModeLOV = [
    { key: "NACH", value: "NACH" },
    {
      key: "ECS", value: "ECS"
    },
    { key: "PDC", value: "PDC" },
    {
      key: "CASA(SI)", value: "CASA(SI)"
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
  EMICycleDaysLOV = [];
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
  loanBookingSelected:any;
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
  showapplicableCredit: boolean = false;
  showapplicableFastag: boolean = false;
  isPac: boolean;
  isVas: boolean;
  result1: any;
  maxValuePDC: any;
  minValueSPDC: any;
  maxValueSPDC: any;
  minValuePDC: any;
  processingFee = 0;
  serviceCharge = 0;
  SPDCvalueCheck: { rule: (val: any) => boolean; msg: string; }[];
  PDCvalueCheck: { rule: (val: any) => boolean; msg: string; }[];
  RepaymentLOV = [];
  RepayFrequencyLOV= [];
  EMIStructureLOV  = [];
  isSecured: boolean;
  valid: boolean;
  IRRValueCheck: { rule: (variance: any) => boolean; msg: string; }[];
  productLoanDetails:any;
  baseInterest: any;
  maxInterest: any;
  minInterest: any;
  varianceIRR: any;
  isCombinedLoan: boolean;
  combinedLoanvalue: any;
  AssetsJson: any;
  premiumAmtvalidation: boolean = true;
  negoLoanamount: any;
  onformsubmit: boolean = true;
  maxLoanAmount: number;
  minLoanAmount: number;
  maxLoanTenor: number;
  minLoanTenor: number;
  minEMIAmount: number;
  maxEMIAmount: number;
  variableFormArray:any;
  mockSchFormArray:any
  tableObjectIndex :any;
  tableRowIndex :any;
  emiIndexValue: any;
  loanBreakupSelected: any;
  showRegFields: boolean;
  negoLoanAmount: number;
  subventionAmount: number;
  gapDaysAmount: number;
  genratedDate: any;
  negotiationSelected: any;
  combinedVal: number;
  subAmount: any;
  
  isLoan360: any;        //GIT
  udfGroupId: string = 'NEG001';  //GIT
  udfScreenId: string = 'NES001'; //GIT
  udfDetails: any = []; //GIT
  userDefineForm: any; //GIT
  showInsuranceFields: boolean = false;
  mockIndex: any;
  repaymentAmnt: number;
  LMSScheduleLOV: any;
  LMSScheduleLOVData: any;
  tempLMSScheduleLOVData = [];
  varErrToaster: boolean = true;
  fetchAssetsJson: any;
  isPredDone: any;
  showModal = false;
  //tempDeductionDetails: any;

  modalDetails = {
    heading: 'Request Approval',
    content: 'Are you sure you want to submit the record for Approval?'
  }
  modalButtons: any = [
    {
      name: 'Yes',
      isModalClose: false,

    },
    {
      name: 'Cancel',
      isModalClose: true,
    }];
  // showButton = true;
  getBranchDetails: any;
  userDetails: any;
  keyValue: any;
  approvalStatus = [];
  collectedSPDCvalueCheck: { rule: (spdcvalue: any) => boolean; msg: string; }[];
  isCollectedSPDC: boolean;
  collectedPDCvalueCheck: { rule: (collectedpdcvalue: any) => boolean; msg: string; }[];
  isAlreadyApproved: boolean;
  approvedBy: any;
  currentIndex: any;
  statusApproval: any;
  deferralDate: any;
  isNeededApproval = false;
  minDefDate: Date;
  isDeferral = false;
  showErrorCollected: boolean;
  invalidPDC: boolean;
  onApproveOrSave: string;
  defaultApprovalStatus: any;

  constructor(
    private labelsData: LabelsService,
    private NegotiationService: NegotiationService,
    private fb: FormBuilder,
    private createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toasterService: ToasterService,
    private sharedData: SharedService,
    private router: Router,
    private loginStoreService: LoginStoreService,
    private loanViewService: LoanViewService,
    private location: Location,
    private utilityService: UtilityService
  ) {
    this.sharedData.leadData$.subscribe((value) => {
      this.leadData = value;
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
    });
    let todayDate = new Date();
    todayDate = this.utilityService.setTimeForDates(todayDate);
    this.minDefDate = todayDate;
    this.minDefDate.setDate(this.minDefDate .getDate() + 1)
  }
  ngOnInit() {
    // const leadData = this.createLeadDataService.getLeadSectionData();
    // this.leadId = leadData['leadId']
    this.isPredDone = localStorage.getItem('is_pred_done');
    console.log(JSON.stringify(this.isPredDone));
    
    this.userId = localStorage.getItem('userId');
    this.onChangeLanguage('English');
    this.isLoan360 = this.loanViewService.checkIsLoan360()
    if (this.isLoan360) {
      const path = this.location.path().split('/').filter((val) => val !== ' ');
      const leadId = path.find((value: any) => {
        value = Number(value);
        return !isNaN(Number(value)) && value !== 0;
      })
      this.leadId = Number(leadId)
    } else {
      this.getLeadId();
    }
    // this.initForm();
    this.getApprovingAuthority();
    this.getLabels();
    this.getLOV();
    this.getInsuranceLOV();
    this.loadForm();
    
    
    console.log('this.roleType',this.roleType )
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;
      if (this.roleType == '1') {
        this.udfScreenId = udfScreenId.Negotiations.negotiationDetailsNegotiations;
      } else if (this.roleType == '2') {
        this.udfScreenId = udfScreenId.creditDecision.negotiationDetailsCreditDecision;
      } else if (this.roleType == '4') {
        this.showErrorCollected = true;
        this.udfScreenId = udfScreenId.CPCMaker.negotiationsCPCMaker;
      } else if (this.roleType == '5') {
        this.showErrorCollected = true;
        this.udfScreenId = udfScreenId.CPCChecker.negotiationsCPCChecker;      
      } else if (this.roleType == '7') {
        this.showErrorCollected = true;
        this.udfScreenId = udfScreenId.CAD.negotiationsCAD;
      }
      

    })
    // if (this.view == false)
    this.getAssetDetails();
    setTimeout(() => {
      this.getAssetDetails();//enable this to fetch data,redirects fro dashboard
    }, 1000);
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  
  isNumber = (evt) => { // for table inputs alone
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getFundingReq(event, i) {
    this.showapplicableCredit = false;
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

  onApprovePdcSpdc(type?: string) {
    let reqForApproval;
    const approvingUser = this.keyValue ? this.keyValue : this.approvedBy;
    // console.log('approvingUser', this.keyValue, this.approvedBy);
    if(this.userDetails && this.userDetails.length  == 0 && type == 'approval') {
      this.toasterService.showError('Invalid user', 'Approving Authority');
      return;
    }
    this.onApproveOrSave = type;
    if(type == 'approval') {
      reqForApproval = true;
      this.onSubmit();
      this.onApproveOrSave = '';
    } else {
      reqForApproval = false;
    }
    this.createNegotiationForm.get('tickets')['controls'][0]['controls'].approvalForm.patchValue({
      approvalStatus: 1
    });
    this.defaultApprovalStatus = this.isAlreadyApproved ? 1 : 0;
    const todayDate = new Date();
    const deferralDate = this.createNegotiationForm.get('tickets')['controls'][0]['controls'].approvalForm.value.deferralDate;
    // console.log(this.utilityService.getDateFormat(deferralDate));
    const approvedBy = this.createNegotiationForm.get('tickets')['controls'][0]['controls'].approvalForm.value.approvedBy;
    // delete this.keyValue['Name']
    const data = {
      leadId: Number(this.leadId),
      requestedOn: this.utilityService.convertDateTimeTOUTC(todayDate, 'YYYY-MM-DD HH:mm'),
      requestedBy: localStorage.getItem('userId'),
      approvedBy: this.keyValue ? this.keyValue : this.approvedBy,
      approvalStatus: this.statusApproval ? Number(this.statusApproval.id) : this.defaultApprovalStatus,
      deferredDate : this.utilityService.getDateFormat(deferralDate),
      reqForApproval : reqForApproval
    }
    console.log(data);
    this.NegotiationService.approvalForPdcSpdc(data).subscribe((res: any) => {
      const response = res;
      if (response.Error == '0' && response.ProcessVariables.error.code == '0') {
        console.log('response', response);
        // this.showButton = false;
        if(type == 'approval') {
        this.isAlreadyApproved = true;
        this.showModal = false;
        }
        // this.isAlreadyApproved = true;
        // this.showModal = false;
        if(this.isAlreadyApproved && this.roleType == '2' && type == 'approval') {
          this.createNegotiationForm.get('tickets')['controls'][0]['controls'].repaymentmodeArray.disable();
          }
      } else {
        this.toasterService.showError(response.ProcessVariables.error.message, '');
      }
    });
  }
  
  getApprovingAuthority(i?) {
    const data = {
      leadId: Number(this.leadId)
    }
    this.NegotiationService.approvingAuthorityLOV(data).subscribe((res: any) => {
      const response = res;
      if (response.Error == '0' && response.ProcessVariables.error.code == '0') {
      console.log(response, "approvingAuthority");
      this.getBranchDetails = response.ProcessVariables.approvedBy;
      const approvalStatus = response.ProcessVariables.approvalStatus;
      this.isAlreadyApproved = response.ProcessVariables.isAlreadyApproved;
      this.approvedBy =  response.ProcessVariables.aApprovedBy;
      this.statusApproval = response.ProcessVariables.aApprovalStatus;
      this.deferralDate = response.ProcessVariables.deferredDate;
        approvalStatus.map(ele => {
          const status = {
            key: ele.id,
            value: ele.value
          }
          this.approvalStatus.push(status);
        });
        console.log(this.createNegotiationForm.get('tickets')['controls'], 'createNegotiationForm')
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }
  onApprovalNameSearch(val) {
    if (val && val.trim().length > 0) {
      this.userDetails = this.getBranchDetails.filter((e: any) => {
        let myVal = val.toString().toLowerCase();
        let eName = e.name.toString().toLowerCase();
        let eUserId = e.userId.toString().toLowerCase();
        if (eName.includes(myVal) || eUserId.includes(myVal)) {
          e.Name = e.name + ' - ' + e.userId;
          // e.Name = e.name;
          return e;
        }
      });
    }
  }
  selectApprovalNameEvent(val: any, i) {
    console.log(val, i, 'val')
    this.keyValue = val;
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].approvalForm.patchValue({
      approvedBy: val['Name']
    });
  }
  onApprovalNameClear(val, i) {
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].approvalForm.patchValue({
      approvedBy: ''
    });
    this.userDetails = [];
    this.keyValue = [];
  }
  collectedChequeMaxMin(value, i) {
    let pdcvalue = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['NoofPDC'].value ? this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['NoofPDC'].value
    : this.CrossSellIns.length > 0 ? this.CrossSellIns[i].repayment_dtls.no_of_pdc : '');
    let spdcvalue = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['NoofSPDC'].value ? this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['NoofSPDC'].value
    : this.CrossSellIns.length > 0 ? this.CrossSellIns[i].repayment_dtls.no_of_spdc : '');
    let collectedpdcvalue = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofPDC'].value ? this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofPDC'].value
    : this.CrossSellIns.length > 0 ? this.CrossSellIns[i].repayment_dtls.collected_no_of_pdc : '');
    let collectedspdcvalue = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofSPDC'].value ? this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofSPDC'].value
    : this.CrossSellIns.length > 0 ? this.CrossSellIns[i].repayment_dtls.collected_no_of_spdc : '');
    const requiredNoofCheques = pdcvalue + spdcvalue;
    const collectedNoofCheques = collectedpdcvalue + collectedspdcvalue;
    console.log(requiredNoofCheques, collectedNoofCheques);
    let repaymentMode = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['repaymentMode'].value;
    setTimeout(() => {
      if(repaymentMode) {
        console.log('Value');
          this.collectedSPDCvalueCheck = [{ rule: collectedspdcvalue => collectedspdcvalue > spdcvalue, msg: 'value should not be greater than required spdc' }];
          this.collectedPDCvalueCheck = [{ rule: collectedpdcvalue => collectedpdcvalue > pdcvalue, msg: 'value should not be greater than required pdc' }];    
       }
    });
    if(collectedspdcvalue > spdcvalue) {
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofSPDC'].setErrors({'incorrect': true})
    } else {
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofSPDC'].setErrors(null);
    }
   
   if (requiredNoofCheques && (collectedNoofCheques || collectedNoofCheques == 0) && (requiredNoofCheques !== collectedNoofCheques) && (requiredNoofCheques > collectedNoofCheques)) {
      this.isNeededApproval = true;
    } else {
      this.isNeededApproval = false;
    }
    console.log('NeededApproval', this.isNeededApproval);
    
  }
  
  onApprovalClick(index?) {
    console.log(index, 'index');
    this.currentIndex = index
    this.isDeferral = true;
    const approvedBy = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].approvalForm.value.approvedBy;
    const deferralDate = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].approvalForm.value.deferralDate;
    if(approvedBy && deferralDate && !this.createNegotiationForm.get('tickets')['controls'][index]['controls'].approvalForm['controls']['deferralDate'].invalid) {
      this.showModal = true;
      this.isDeferral = false;
    } else {
      this.toasterService.showError('Please fill all mandatory fields', '')
    }
   
  }
  loadForm() {
    this.createNegotiationForm = this.fb.group({
      tickets: new FormArray([]), // CrossSellInsurance
      tickets1: new FormArray([]), //deduction
      //coapplicant: new FormArray([]),
      //guarantorvalue: new FormArray([]),
      // addressProof: this.fb.array([this.initControls()]),
        productCode: [{ value: '', disabled: true }],
        applicant: [{ value: '', disabled: true }],
        CustomerCategory: [{ value: '', disabled: true }],
      // coApplicant: [{ value: '', disabled: true }],
      // coapplicantCategory: [{ value: '', disabled: true }],
      // guarantor: [{ value: '', disabled: true }],
      // guarantorCategory: [{ value: '', disabled: true }],
        reqLoanAmount: [{ value: '', disabled: true }],
        reqLoanTenor: [{ value: '', disabled: true }],
      //NetDisbursementAmount: [{ value: '', disabled: true }],
      // EMIStartDateAfterDisbursement: '',
      // vehicleModel: [{ value: '', disabled: true }],
      // fundingProgram: [{ value: '', disabled: true }],
      // PromotionScheme: [{ value: '', disabled: true }],
      // ageofAsset: [{ value: '', disabled: true }],
      // eligibleLTV: [{ value: '', disabled: true }],
      // promoCode: [{ value: '', disabled: true }],
      // eligibleLoanAmount: ['', { disabled: true }],
      // eligibleLoanAmountAftersubvention: [{ value: '', disabled: true }],
      // subventionAmount: [{ value: '', disabled: true }],
      // incentiveAmount: [{ value: '', disabled: true }],
      // subventSchemeLoanTenor: [{ value: '', disabled: true }],
      // subventionSchemeIRR: [{ value: '', disabled: true }],
      // subventSchemeEMI: [{ value: '', disabled: true }],
      // subventAmount: [{ value: '', disabled: true }],
      // eligibleLoanTenor: [{ value: '', disabled: true }],
      // EligibleIRR: [{ value: '', disabled: true }],
      // regNo: [{ value: '', disabled: true }],
      // ManufacturingYear: [{ value: '', disabled: true }],
      // LoanAmountincludingCrossSellofalltheassets: [{ value: '', disabled: true }],
      // NegotiatedLoanAmount: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]],
      // NegotiatedLoanTenor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      // NegotiatedIRR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      // NegotiatedEMI: ['', [Validators.required]],
      // MoratoriumPeriod: ['', [Validators.required]],
      //EMIStartDateAfterDisbursement: ['', [Validators.required]],
      // PaymentModeforGapDaysInterest: ['', [Validators.required]],
      // SelectAppropriateLMSScheduleCode: ['', [Validators.required]],
      // NoofRepayableMonthsafterMoratorium: [{ value: '', disabled: true }],
      // netAssetCost: [''],
      // repaymentMode: [''],
      // NoofPDC: ['', [Validators.minLength(1), Validators.maxLength(1)]],
      // NoofSPDC: ['', [Validators.minLength(1), Validators.maxLength(1)]],
    })
    
  }

  msInitRowsDefault(flag,objDetaills){    //nego Enhance  
   
    return this.fb.group({
      installmentCounter: [{value:flag?objDetaills.installmentCounter.value:'',disabled:true}],
      installmentDate: [{value:flag?objDetaills.installmentDate.value:'',disabled:true}],
      totalInstallmentAmount: [{value:flag?objDetaills.totalInstallmentAmount.value:'',disabled:true}],
      principalAmount: [{value:flag?objDetaills.principalAmount.value:'',disabled:true}],
      interestAmount: [{value:flag?objDetaills.interestAmount.value:'',disabled:true}],
      principalBalanceAmount: [{value:flag?objDetaills.principalBalanceAmount.value:'',disabled:true}],
    });
  }
  initRowsDefault(i,flag) { //for default purpose added //nego Enhance
    
    let indexEmiStruVal:any ='';
    let indexBaseEmiValue:any  = '';
    let indexMaxTenorMonth:any ='';
    
    if(flag){
      let arrVals=this.createNegotiationForm.controls.tickets; 
      let negoArray=arrVals['controls'][i]['controls']['negotiationformArray']['controls'];
      if(!(this.AssetDetailsList[i].schemeType=='S' || this.AssetDetailsList[i].schemeType=='I' || this.AssetDetailsList[i].schemeType=='SI')){
        indexMaxTenorMonth=negoArray['NegotiatedLoanTenor']['value']?Number(negoArray['NegotiatedLoanTenor']['value']):0;
      }else{ // if it is Subvention
        indexMaxTenorMonth=negoArray['subventSchemeLoanTenor']['value']?Number(negoArray['subventSchemeLoanTenor']['value']):0;
  
      }
          indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];
          indexBaseEmiValue=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['emiDefaultValue']['value'];   
    }
    return this.fb.group({
      fromMonth: [{value:'1',disabled:true},[Validators.required]],
      toMonth: [{value:indexEmiStruVal=='4EMISTRUCT'?indexMaxTenorMonth-1:null,disabled:indexEmiStruVal=='4EMISTRUCT'?true:false},[Validators.required]],
      installmentPercent: [{value:null,disabled:indexEmiStruVal=='4EMISTRUCT'?true:false},[Validators.required]],
      emiAmount: [{value:indexEmiStruVal=='4EMISTRUCT'?indexBaseEmiValue:null,disabled:indexEmiStruVal=='4EMISTRUCT'?true:false},[Validators.required]],
    });
  }
 
  initRows(i,j,flag,objDetaills) { //nego Enhance
    if(!flag){
    let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];
    let defFromMonth = Number(varFormArrayValues['controls'][j]['controls']['toMonth'].value) + 1;
    varFormArrayValues['controls'][j]['controls']['toMonth'].value

   
    let newObj= this.fb.group({
      fromMonth: [{value:defFromMonth,disabled:true},[Validators.required]],
      toMonth: ["",[Validators.required]],
      installmentPercent: ["",[Validators.required]],
      emiAmount: ["",[Validators.required]],
    });
    let getLength=Number(this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'].controls.length);
        getLength = getLength-1;
      this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][getLength].controls.toMonth.disable();
      this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][getLength].controls.installmentPercent.disable();
      this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][getLength].controls.emiAmount.disable();
      
    return newObj;
   }else{
    return this.fb.group({
      fromMonth: [{value:objDetaills.fromMonth.value,disabled:true}],
      toMonth: [{value:objDetaills.toMonth.value,disabled:true}],
      installmentPercent: [{value:objDetaills.installmentPercent.value,disabled:true}],
      emiAmount: [{value:objDetaills.emiAmount.value,disabled:true}],
     
    });
   }
  }
  
  addNewRow(i,j) { //nego Enhance
   let arrVals=this.createNegotiationForm.controls.tickets;   

   let indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];
    
   //clearing the MockScheduleArray whenever
    this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];

    var obj = true;
    (arrVals['controls'][i]['controls']['variableForm'].get('variableFormArray') as FormArray).controls.forEach((formGroup) => {
      if (formGroup['status'] && formGroup['status']=='INVALID') {
        this.toasterService.showError('Please fill All the Values', '');
        obj = false;        
        return;
      }
    });
    if(obj){
      this.tableObjectIndex = i;
      this.tableRowIndex = j;
      if(indexEmiStruVal!='4EMISTRUCT'){
        this.formArr.push(this.initRows(i,j,false,''));
      }else{
        this.formArr.push(this.initRowsDefault(i,true));
      }
      }
  }

  deleteRow(i,o) { //nego Enhance
    //clearing the MockScheduleArray whenever
    this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
    let deleteArray=this.createNegotiationForm.controls.tickets;
    deleteArray['controls'][i]['controls']['variableForm']['controls']['variableFormArray'].removeAt(o)
    let getLength=Number(deleteArray['controls'][i]['controls']['variableForm']['controls']['variableFormArray'].controls.length);
    getLength=getLength-1;
   
    deleteArray['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][getLength].controls.toMonth.enable();
    deleteArray['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][getLength].controls.installmentPercent.enable();
      //deleteArray['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][getLength].controls.emiAmount.enable();
    //console.log(getLength)
    //this.formArr.removeAt(index);
  }

  getToMonthVal(event,i,j){  //nego Enhance
    let enteredValue= event.target.value;
    //clearing the MockScheduleArray whenever
    this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
    let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];
    let fromMonthVal=varFormArrayValues.controls[j]['controls']['fromMonth']['value'];

    let loanTenorMonth:any = 0;
    let negoArray=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['negotiationformArray']['controls'];
        loanTenorMonth=negoArray['NegotiatedLoanTenor']['value']?Number(negoArray['NegotiatedLoanTenor']['value']):0;


    if(Number(enteredValue)>(loanTenorMonth)){
      this.toasterService.showError('To Month should not be greater than  '+ (loanTenorMonth) + ' Months', '');
       varFormArrayValues.controls[j]['controls']['toMonth'].setValue(null);
       varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
       varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null);
        return;
    }                  
    if (Number(enteredValue)<=Number(fromMonthVal)){
      this.toasterService.showError('To Month should be greater than from Month', '');
      varFormArrayValues.controls[j]['controls']['toMonth'].setValue(null);
      varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
      varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null);
        return;
    }
    if(varFormArrayValues.controls[j]['controls'].installmentPercent.value){
      this.instalPercentCal(varFormArrayValues.controls[j]['controls'].installmentPercent.value,i,j,false)
    }

  }

  instalPercentCal(event,i,j,flag){
    let enteredValue :any;
    if(flag){
      enteredValue= event.target.value?Number(event.target.value):null;
    }else{
      enteredValue= Number(event);
    }
    let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];
    if(!(varFormArrayValues.controls[j]['controls']['toMonth']['value'])){ // with out filling month this will get error
      varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
      varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null);
      this.toasterService.showError('Kindly fill To Month to proceed further', '');
      return;
    }
    if(!enteredValue){ // if there is no Value,existing Value will get clear
      varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
      varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null);
      return;
    }
    let totalinstallmentPercent = null;
    //newValidation Included
    for (let k = 0; k < varFormArrayValues['controls'].length; k++) {
      let addTotalinstallmentPercent = varFormArrayValues['controls'][k]['controls']['installmentPercent']['value'];
      addTotalinstallmentPercent = addTotalinstallmentPercent?Number(addTotalinstallmentPercent):0;
      totalinstallmentPercent  = totalinstallmentPercent + addTotalinstallmentPercent;
      if(totalinstallmentPercent>100){
        varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
        varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
        this.toasterService.showError('Total Installment should not be greater than 100%', '');
        return;
      }
    }

    let indexValue=j;
    if(indexValue>0){
      indexValue = j - 1;
      indexValue=Number(varFormArrayValues.controls[indexValue]['controls']['installmentPercent']['value']);
    }

    let arrVals=this.createNegotiationForm.controls.tickets;   
    let indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];

    if(indexEmiStruVal=='2EMISTRUCT'){ //Step Down
      if((indexValue?enteredValue>=indexValue:false)){ // if enetered Value is lesser than InstallmentPercentage
        this.toasterService.showError('Installment Percentage should be lesser than Previous row value' + '.','');           
        varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
        return;
      } 
    }else if(indexEmiStruVal=='3EMISTRUCT'){ //Step Up
      if((indexValue?enteredValue<=indexValue:false)){ // if enetered Value is greater than InstallmentPercentage
        this.toasterService.showError('Installment Percentage should be greater than previous row value' + '.','');           
        varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
        return;
      } 
    }else if(indexEmiStruVal=='5EMISTRUCT'){ // Baloon
      if((indexValue?enteredValue<=indexValue:false)){ // if enetered Value is lesser than InstallmentPercentage
        this.toasterService.showError('Installment Percentage should be greater than previous row value' + '.','');           
        varFormArrayValues.controls[j]['controls']['installmentPercent'].setValue(null);
        return;
      }
    }
      
    if(this.repaymentAmnt){
      let getFM = varFormArrayValues.controls[j]['controls']['fromMonth']['value'];
      let getTM = varFormArrayValues.controls[j]['controls']['toMonth']['value'];
      if(getTM && getFM){
        let repayAmnt = Number(this.repaymentAmnt);
        let emiCycleMonths = (Number(getTM)-Number(getFM))+1;
        let calculatedAmnt = (repayAmnt * enteredValue) / 100;
        calculatedAmnt  = calculatedAmnt / emiCycleMonths;
        calculatedAmnt = calculatedAmnt?Math.round(calculatedAmnt):null;
        varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(calculatedAmnt);
        this.enterEmiCall(calculatedAmnt,i,j);
      }
    }
    
  }

  enterEmiCall(event,i,j){ //nego Enhance
    let enteredValue= event;
    let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];
    let indexBaseEmiValue = this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanBookingDetails['controls']['emiDefaultValue']['value'];   
    //clearing the MockScheduleArray whenever
    this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
    indexBaseEmiValue = indexBaseEmiValue?Number(indexBaseEmiValue):0
        if(!indexBaseEmiValue){
          varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
          this.toasterService.showError('Default Base EMI Value for this table not yet calculated','');  
           return
        }
    let indexValue=j;
    if(indexValue>0){
      indexValue = j - 1;
      indexValue=Number(varFormArrayValues.controls[indexValue]['controls']['emiAmount']['value']);
    }

    let arrVals=this.createNegotiationForm.controls.tickets;   
    let indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];
   
    if(indexEmiStruVal=='2EMISTRUCT'){ //Step Down
      if((enteredValue<indexBaseEmiValue) || (indexValue?enteredValue>=indexValue:false)){ // if enetered Value is lesser than emiValue
        this.toasterService.showError('Variable EMI value calculated for given month range and repayment % is ' + enteredValue + '.  For Step Down, this should be greater than ' + indexBaseEmiValue +' and lesser than previous row EMI value',''); 
        varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
      } 
    }else if(indexEmiStruVal=='3EMISTRUCT'){ //Step Up
      if((enteredValue<indexBaseEmiValue) || (indexValue?enteredValue<=indexValue:false)){ // if enetered Value is greater than emiValue
        this.toasterService.showError('Variable EMI value calculated for given month range and repayment % is ' + enteredValue + '.  For Step Up, this should be greater than ' + indexBaseEmiValue +' and previous row EMI value',''); 
        varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
      } 
    }else if(indexEmiStruVal=='5EMISTRUCT'){ // Baloon
      if((enteredValue<indexBaseEmiValue) || (indexValue?enteredValue<=indexValue:false)){ // if enetered Value is lesser than emiValue
        this.toasterService.showError('Variable EMI value calculated for given month range and repayment % is ' + enteredValue + '.  For Baloon, this should be greater than ' + indexBaseEmiValue +' and previous row EMI value',''); 
        varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
      }
    }
  }

  // enterEmiCall(event,i,j){ //nego Enhance Existing
  //   //let enteredValue= event.target.value?Number(event.target.value):null;
  //   let enteredValue= event;
  //   let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];
  //   let emiValue=varFormArrayValues.controls[j]['controls']['emiAmount']['value'];
  //   let indexBaseEmiValue = this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanBookingDetails['controls']['emiDefaultValue']['value'];   
  //   //clearing the MockScheduleArray whenever
  //   this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
  //   indexBaseEmiValue = indexBaseEmiValue?Number(indexBaseEmiValue):0
  //       if(!indexBaseEmiValue){
  //         varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
  //         this.toasterService.showError('Default Base EMI Value for this table not yet calculated','');  
  //          return
  //       }
  //       //console.log(indexBaseEmiValue);
  //       //console.log(this.emiIndexValue);
  //   let indexValue=j;
  //   if(indexValue>0){
  //     indexValue = j - 1;
  //     indexValue=Number(varFormArrayValues.controls[indexValue]['controls']['emiAmount']['value']);
  //   }

  //   let arrVals=this.createNegotiationForm.controls.tickets;   
  //   let indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];

   
  //   if(indexEmiStruVal=='2EMISTRUCT'){ //Step Down
  //     if((enteredValue<indexBaseEmiValue) || (indexValue?enteredValue>=indexValue:false)){ // if enetered Value is lesser than emiValue
  //       this.toasterService.showError('EMI Value should be greater than ' + indexBaseEmiValue + ' and lesser than Previous row EmiAmountValue' + '.','');           
  //       varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
  //     } 
  //   }else if(indexEmiStruVal=='3EMISTRUCT'){ //Step Up
  //     if((enteredValue<indexBaseEmiValue) || (indexValue?enteredValue<=indexValue:false)){ // if enetered Value is greater than emiValue
  //       this.toasterService.showError('EMI Value should be greater than ' + indexBaseEmiValue + ' and Previous row EmiAmountValue' + '.','');           
  //       varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
  //     } 
  //   }else if(indexEmiStruVal=='5EMISTRUCT'){ // Baloon
  //     if((enteredValue<indexBaseEmiValue) || (indexValue?enteredValue<=indexValue:false)){ // if enetered Value is lesser than emiValue
  //       this.toasterService.showError('EMI Value should be greater than ' + indexBaseEmiValue + ' and Previous row EmiAmountValue' + '.','');           
  //       varFormArrayValues.controls[j]['controls']['emiAmount'].setValue(null)
  //     }
  //   }
  // }

  emiStrutureChange(i){  //nego Enhance
    let arrVals=this.createNegotiationForm.controls.tickets;   

   let indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];

    this.tableObjectIndex=i;
    this.mockIndex=i;
    arrVals['controls'][i]['controls']['variableForm'].get('variableFormArray').controls=[];
    arrVals['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
    //this.mockformArr.push(this.msInitRowsDefault(false,''));
    let indexBaseEmiValue = this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanBookingDetails['controls']['emiDefaultValue']['value'];   
    if(!indexBaseEmiValue){
      //this.loanBookingEmi(i);
      this.defaultIndexEmiValue(i);
      indexBaseEmiValue = this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanBookingDetails['controls']['emiDefaultValue']['value'];
    }
    //console.log(indexBaseEmiValue)
    this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanAmountBreakup['controls']['gapDaysInterest'].setValue(null); 
    if(indexEmiStruVal=='4EMISTRUCT'){//Bullet

      let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];
      indexBaseEmiValue = indexBaseEmiValue?Number(indexBaseEmiValue):0
   

        if(!indexBaseEmiValue){
          this.createNegotiationForm['controls']['tickets']['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure'].setValue('')
          this.formArr.push(this.initRowsDefault(i,false));
          this.toasterService.showError('Default Base EMI Value for this table not yet calculated','');  
           return
        }
        this.formArr.push(this.initRowsDefault(i,true));
        this.addNewRow(i,0);
        let varArrayControls=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls'][0]['controls']; // nego Tenor Month
        //let negoArray=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['negotiationformArray']['controls'];
        let loanBookingDetails=this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanBookingDetails']['controls'];
         varFormArrayValues['controls'][1].patchValue({ 
           'fromMonth':varArrayControls['toMonth']['value']+1,
           'toMonth':Number(varArrayControls['toMonth']['value'])+1,
           'emiAmount':Number(varArrayControls['emiAmount']['value'])+(loanBookingDetails['LoanAmountincludingCrossSell']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSell']['value']):null)
        })       
    }else if (indexEmiStruVal=='1EMISTRUCT'){
      this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'].setErrors(null);
    }
    else if(indexEmiStruVal!='1EMISTRUCT'){       
      this.formArr.push(this.initRowsDefault(i,true))
  } 
     
  }

  loanBookingEmi(i) {    //nego Enhance
    let crossSellLoanAmnt:any=0;
    let loanTenorMonth:any = 0;
    let irr :any= 0;
    let negoArray=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['negotiationformArray']['controls'];
    if(!(this.AssetDetailsList[i].schemeType=='S' || this.AssetDetailsList[i].schemeType=='I' || this.AssetDetailsList[i].schemeType=='SI')){
      loanTenorMonth=negoArray['NegotiatedLoanTenor']['value']?Number(negoArray['NegotiatedLoanTenor']['value']):0;
      irr=negoArray['NegotiatedIRR']['value']?Number(negoArray['NegotiatedIRR']['value']):0;
    }else{ // if it is Subvention
      loanTenorMonth=negoArray['subventSchemeLoanTenor']['value']?Number(negoArray['subventSchemeLoanTenor']['value']):0;
      irr=negoArray['subventionSchemeIRR']['value']?Number(negoArray['subventionSchemeIRR']['value']):0;
    }
     let loanBookingDetails=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls'];
     if(!(this.AssetDetailsList[i].schemeType=='S' || this.AssetDetailsList[i].schemeType=='SI')){
        crossSellLoanAmnt=loanBookingDetails['LoanAmountincludingCrossSell']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSell']['value']):0;
      }else{ // if it is Subvention
          crossSellLoanAmnt=loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']):0;
      }
     //crossSellLoanAmnt=loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']):0;
      // enable the below field when it addded
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].value ?
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].setValue(0) : 0;

      let IRR = parseFloat(irr) / 1200;
      let loanAmount = crossSellLoanAmnt;
      let loanTenor = loanTenorMonth;
      if (IRR && loanAmount && loanTenor){
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].setValue(
          Math.round((loanAmount * IRR) / (1 - (Math.pow(1 / (1 + IRR), loanTenor)))));

        this.emiIndexValue = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI']['value']
        //console.log('emiValue-->',this.emiIndexValue)
        if(loanTenor && this.emiIndexValue){
          loanTenor = Number(loanTenor);
         this.repaymentAmnt = (loanTenor)*Number(this.emiIndexValue);
        }
        this.defaultIndexEmiValue(i);
        }
        // Clearing EMi Structure & Structure Related
        this.mockIndex=i;
        let loanBookingValues = this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls'];
        let emiStruVal=loanBookingValues['EMIStructure']['value'];
            emiStruVal=emiStruVal?((emiStruVal=='1EMISTRUCT')?emiStruVal:loanBookingValues['EMIStructure'].setValue('')):emiStruVal;
            loanBookingValues['emiDefaultValue'].setValue('');
            if(emiStruVal && emiStruVal!='1EMISTRUCT'){
            this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm'].get('variableFormArray').controls=[];
            this.formArr.push(this.initRowsDefault(i,false));
            this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
           }

  }

  defaultIndexEmiValue(i){     //nego Enhance
    let loanTenor:any = 0;
    let emiValue:any = 0;
    let crossSellLoanAmnt:any =0;

    let negoArray=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['negotiationformArray']['controls'];
        emiValue = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI']['value'];
        emiValue = emiValue?Number(emiValue):0;

    let loanBookingDetails=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls'];
     
    if(!(this.AssetDetailsList[i].schemeType=='S' || this.AssetDetailsList[i].schemeType=='SI')){
        crossSellLoanAmnt=loanBookingDetails['LoanAmountincludingCrossSell']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSell']['value']):0;
    }else{ // if it is Subvention
        crossSellLoanAmnt=loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']):0;
    }

    if(!(this.AssetDetailsList[i].schemeType=='S' || this.AssetDetailsList[i].schemeType=='SI')){
      loanTenor=negoArray['NegotiatedLoanTenor']['value']?Number(negoArray['NegotiatedLoanTenor']['value']):0;
    }else{ // if it is Subvention
      loanTenor=this.AssetDetailsList[i].subventionTenure?Number(this.AssetDetailsList[i].subventionTenure):0;
    }

    if(emiValue && loanTenor && crossSellLoanAmnt){
      let emiBaseValue = emiValue*(loanTenor); //RepaymentValue;
      emiBaseValue = emiBaseValue - crossSellLoanAmnt;
      emiBaseValue = emiBaseValue / (loanTenor);
      //console.log(emiBaseValue) //base Emi Value for each table
      //round off Values      
        // if(!(emiBaseValue == Math.floor(emiBaseValue))){ //Decimal Number
        //   let a = String(emiBaseValue);
        //   let b = a.split('.');
        //   emiBaseValue=Number(b[0])+1;
        // }
        
      this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanBookingDetails['controls']['emiDefaultValue'].setValue(emiBaseValue?Math.round(emiBaseValue):'');   

    }
    
  }

  validateVarFormArray(i,flag){   //nego Enhance
  
  
    let loanTenorMonth:any = 0;
    let arrVals=this.createNegotiationForm.controls.tickets; 
    let varFormArrayValues=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray'];

    let indexEmiStruVal=arrVals['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure']['value'];
    let keyObj = false;
    (arrVals['controls'][i]['controls']['variableForm'].get('variableFormArray') as FormArray).controls.forEach((formGroup) => {
      if (formGroup['status'] && formGroup['status']=='INVALID') {
        this.toasterService.showError('Please fill All the Values', '');
        keyObj = true;
        return;
      }
    });
    if(keyObj){
      return;``
    }

    if(indexEmiStruVal!='4EMISTRUCT'){
      let totalinstallmentPercent = null;
      for (let k = 0; k < varFormArrayValues['controls'].length; k++) {
        let addTotalinstallmentPercent = varFormArrayValues['controls'][k]['controls']['installmentPercent']['value'];      
        addTotalinstallmentPercent = addTotalinstallmentPercent?Number(addTotalinstallmentPercent):0;
        totalinstallmentPercent  = totalinstallmentPercent + addTotalinstallmentPercent;       
      } 
      if(totalinstallmentPercent!=100){        
        this.toasterService.showError('Total Installment should be equal to 100%', '');
        return;
      }
    }

      let negoArray=arrVals['controls'][i]['controls']['negotiationformArray']['controls'];
          loanTenorMonth=negoArray['NegotiatedLoanTenor']['value']?Number(negoArray['NegotiatedLoanTenor']['value']):0;

  
      let loanEmiVal= (this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI']['value'])?
                      Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI']['value']):0
      
      if(loanTenorMonth && loanEmiVal){ // to Calculate Repayment value
        this.repaymentAmnt = (loanTenorMonth)*loanEmiVal;
       }else{
        this.repaymentAmnt=0;
       }
      
      if(!this.repaymentAmnt && flag){ //To Caluclate Total Emi value
        this.toasterService.showError('kindly Calculate Repayment Amount to Proceed Further','');  
        return;
      }

      let totalEmiVal = 0;

    //  if(indexEmiStruVal=='5EMISTRUCT'){ //Existing Baloon Validation
    //       var emiTotalValue = 0;
    //       var threeMonthsEmi = 0;//last Object
    //       let arrayLength=varFormArrayValues['controls'].length;
    //       let fromMonth=varFormArrayValues['controls'][arrayLength-1]['controls']['fromMonth']['value'];
    //       let toMonth=varFormArrayValues['controls'][arrayLength-1]['controls']['toMonth']['value'];
    //       let lastThreeMonths=(Number(toMonth)-Number(fromMonth))+1;//from month is 1 & to month is 2,total 2months
    //        //console.log(lastThreeMonths)   
    //        if(lastThreeMonths>=3){ // if satisfies in last obje of Array 
    //           emiTotalValue=Number(varFormArrayValues['controls'][arrayLength-1]['controls']['emiAmount']['value']);
    //           threeMonthsEmi =(emiTotalValue)*3;
    //           //console.log(threeMonthsEmi)
    //        }else{
    //         emiTotalValue=Number(varFormArrayValues['controls'][arrayLength-1]['controls']['emiAmount']['value']);
    //         threeMonthsEmi =(emiTotalValue*2); //lastThreeMonths,in last toMonth should not be lesser han from Month,minimum 2 month will be available in all objects
    //         emiTotalValue=Number(varFormArrayValues['controls'][arrayLength-2]['controls']['emiAmount']['value']);
    //         threeMonthsEmi = threeMonthsEmi+emiTotalValue;
    //         //console.log(threeMonthsEmi);
    //        }   
    //        //console.log(threeMonthsEmi)
    //       //last before Object
    //       let loanBookingDetails=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls'];
    //       let crossSellLoan=loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']):0;
         
    //          crossSellLoan = crossSellLoan*25/100; //(52)
    //       if(threeMonthsEmi<crossSellLoan){
    //         //console.log(threeMonthsEmi);
    //         this.toasterService.showError('This installment structure is not matching with Balloon EMI type. Please revise','');  
    //         return;         
    //       }
          
    //   }

    if(varFormArrayValues['controls'].length!=0){
      let arrayLength=varFormArrayValues['controls'].length;
      let toMonth=varFormArrayValues['controls'][arrayLength-1]['controls']['toMonth']['value'];
      if(Number(toMonth)!=(loanTenorMonth)){
        this.toasterService.showError('Tenure Month should not be greater than or lesser than '+ (loanTenorMonth) + 'Months', '');
        return;
      }
    }

      if(indexEmiStruVal=='5EMISTRUCT'){ // new Change Baloon Validation
        var emiTotalValue = 0;
        var threeMonthsEmi = 0;//last Object

        let arrayLength=varFormArrayValues['controls'].length;
        let fromMonth=varFormArrayValues['controls'][arrayLength-1]['controls']['fromMonth']['value'];
        let toMonth=varFormArrayValues['controls'][arrayLength-1]['controls']['toMonth']['value'];
        let installmentPercentage=varFormArrayValues['controls'][arrayLength-1]['controls']['installmentPercent']['value'];

        let lastThreeMonths=(Number(toMonth)-Number(fromMonth))+1;//from month is 1 & to month is 2,total 2months
         if(lastThreeMonths>=3){ // if satisfies in last obje of Array 
          threeMonthsEmi = (installmentPercentage/lastThreeMonths)*3        
         }else{ // when last row holds only 2 months
          //Note : installmentPercentage // last two month percentage value == percentangeValue/2(last two months)*2(last two emis) ==>same Value;
          let lastBeforefromMonth=varFormArrayValues['controls'][arrayLength-2]['controls']['fromMonth']['value'];
          let lastBeforetoMonth=varFormArrayValues['controls'][arrayLength-2]['controls']['toMonth']['value'];
          let lastBeforeInstallmentPercentage=varFormArrayValues['controls'][arrayLength-2]['controls']['installmentPercent']['value'];
          let rowtotalMonths=(Number(lastBeforetoMonth)-Number(lastBeforefromMonth))+1;//from month is 1 & to month is 2,total 2months
          lastBeforeInstallmentPercentage = lastBeforeInstallmentPercentage/rowtotalMonths
          threeMonthsEmi = Number(installmentPercentage)+Number(lastBeforeInstallmentPercentage);
         }         
        if(threeMonthsEmi<25){
          console.log(threeMonthsEmi);
          this.toasterService.showError('This installment structure is not matching with Balloon EMI type. Please revise','');  
          return;         
        }        
    }
  
      for (let x = 0; x < varFormArrayValues['controls'].length; x++) {
        let objFromMonth=Number(varFormArrayValues['controls'][x]['controls']['fromMonth']['value']);
        let objToMonth=Number(varFormArrayValues['controls'][x]['controls']['toMonth']['value']);
        let objEmiValue=Number(varFormArrayValues['controls'][x]['controls']['emiAmount']['value']);
        
        let val = (objToMonth - objFromMonth)+1; //added +1 , bcoz 1 to 4 months
        totalEmiVal = totalEmiVal + (objEmiValue * val);
  
      }

  
  // if((indexEmiStruVal!='4EMISTRUCT') && (totalEmiVal<this.repaymentAmnt) && flag){ // bullet is auto calculated , so not required to check this for bullet alone
  //   this.toasterService.showError('Variable installements are not adding up to Total repayment amount ('+ this.repaymentAmnt +'). Please adjust EMI amount','');  
  // }         
 // else{
        let loanBookingDetails=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls'];
        let crossSellLoan=loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']?Number(loanBookingDetails['LoanAmountincludingCrossSellsubtractSubvent']['value']):0;
        let indexMaxTenorMonth:any = '';
        
          let loanDetailsArray=arrVals['controls'][i]['controls']['loanBookingDetails']['controls'];
          let scheduleCode = loanDetailsArray['SelectAppropriateLMSScheduleCode'].value?loanDetailsArray['SelectAppropriateLMSScheduleCode'].value:'';
          this.mockIndex=i;
          arrVals['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
          this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanAmountBreakup['controls']['gapDaysInterest'].setValue(null); 
      
          if(!(this.AssetDetailsList[i].schemeType=='S' || this.AssetDetailsList[i].schemeType=='I' || this.AssetDetailsList[i].schemeType=='SI')){
            indexMaxTenorMonth=negoArray['NegotiatedLoanTenor']['value']?Number(negoArray['NegotiatedLoanTenor']['value']):0;
          }else{ // if it is Subvention
            indexMaxTenorMonth=negoArray['subventSchemeLoanTenor']['value']?Number(negoArray['subventSchemeLoanTenor']['value']):0;  
          }
      
      var disbursementDay:any = new Date();
      
      if (environment.hostingEnvironment == 'DEV' || environment.hostingEnvironment == 'UAT' || environment.hostingEnvironment == 'SIT') {
      disbursementDay = (environment.lmsSITDate).split('-');
      disbursementDay = disbursementDay[0]+disbursementDay[1]+disbursementDay[2]
      }else{
      let a:any = disbursementDay.getDate();
          a= a+'';
          a = a.length==1?'0'+a:a;
      let b:any = disbursementDay.getMonth()+1;
          b= b+'';
          b = b.length==1?'0'+b:b;
      let c = ''+disbursementDay.getFullYear();
      disbursementDay = c+b+a
      }
    var  LoanFundFlowInput = {
      "generationDate": disbursementDay,
      "interestVarianceType": "A",//hardcode
      "premiumAmount": "0",//hardcode
      "productCode": this.LeadReferenceDetails[0].LMSProductCode,
      "rateChartCode": "708",//hardcode
      "sanctionedAmount": String(crossSellLoan),
      "scheduleTypeCode": scheduleCode,
      "termMonths": String(indexMaxTenorMonth)
     }
  
     var VariableEPISchedule = [];  
if(flag){
  let varArrayControls=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm']['controls']['variableFormArray']['controls']
  for (let y = 0; y < varArrayControls.length; y++) {
      var obj={
        "installmentNumberTo": varArrayControls[y]['controls']['toMonth']['value'],
        "installmentAmount": varArrayControls[y]['controls']['emiAmount']['value'],
        "stageNumber":"2"
      }
      VariableEPISchedule.push(obj);
    }  
    this.mockformArr.push(this.msInitRowsDefault(false,''));
}
  
      this.NegotiationService
        .fundFlowApi(LoanFundFlowInput,VariableEPISchedule
        )
        .subscribe((res: any) => {
          //console.log(res)
          if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
            let mockSchValues = res.ProcessVariables.LoanRepaymentMockSchedule;
            if(mockSchValues.length!=0){ //calculate Gap Day Interest
              this.createNegotiationForm.controls.tickets['controls'][i]['controls'].loanAmountBreakup['controls']['gapDaysInterest'].setValue(mockSchValues[0].installmentAmount); 
            }
  
  
            if(flag){
            let fetchedMockArray = this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm']['controls']['mockSchFormArray'];  
    for (let x = 0; x < mockSchValues.length; x++) {
    
      fetchedMockArray.controls[0].controls.installmentCounter.setValue(mockSchValues[x]['installmentCounter'])
      fetchedMockArray.controls[0].controls.installmentDate.setValue(mockSchValues[x]['installmentDate'])
      fetchedMockArray.controls[0].controls.totalInstallmentAmount.setValue(mockSchValues[x]['totalInstallmentAmount'])
      fetchedMockArray.controls[0].controls.principalAmount.setValue(mockSchValues[x]['principalAmount'])
      fetchedMockArray.controls[0].controls.interestAmount.setValue(mockSchValues[x]['interestAmount'])
      fetchedMockArray.controls[0].controls.principalBalanceAmount.setValue(mockSchValues[x]['principalBalanceAmount'])

      this.mockformArr.push(this.msInitRowsDefault(true,fetchedMockArray.controls[0].controls))
  
    }
    let totalMockTableSize=this.createNegotiationForm['controls']['tickets']['controls'][this.mockIndex]['controls']['mockSchForm']
    if(totalMockTableSize.get('mockSchFormArray').controls.length>0){
      totalMockTableSize['controls']['mockSchFormArray'].removeAt(0);
    }
  }
    
          }
          else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
            this.toasterService.showError(res.ProcessVariables.error.message, '');
            this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
          }
        });
 //  }   
      }

  get formArr() {
    let getArray = this.createNegotiationForm.controls.tickets;
    return getArray['controls'][this.tableObjectIndex]['controls']['variableForm'].get("variableFormArray") as FormArray;
  }

  get mockformArr() {
  let getArray = this.createNegotiationForm.controls.tickets; 
  return getArray['controls'][this.mockIndex]['controls']['mockSchForm'].get("mockSchFormArray") as FormArray;
}

  //Subvention Validations
  subventionValidations(i,flag,val){   //nego Enhance
    let splittedDefaultAmnt:any = 100000;
    let emi =0; 

    if(val==1){
       emi = this.AssetDetailsList[i].emiPerLakh?Number(this.AssetDetailsList[i].emiPerLakh):0; 
    }else if(val==2){
      emi = this.AssetDetailsList[i].subventionPerLakh?Number(this.AssetDetailsList[i].subventionPerLakh):0; 
    }else if(val==3){
      emi = this.AssetDetailsList[i].incentivePerLakh?Number(this.AssetDetailsList[i].incentivePerLakh):0; 
    }

    if(flag){
      let negoArray= this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'];
      let negoLoanAmnt= negoArray['NegotiatedLoanAmount']['value']?Number(negoArray['NegotiatedLoanAmount']['value']):null;
      if(val==1){
        negoArray['subventSchemeEMI'].setValue((emi*negoLoanAmnt)/splittedDefaultAmnt)
      }else if(val==2){
        negoArray['subventAmount'].setValue((emi*negoLoanAmnt)/splittedDefaultAmnt)
      }else if(val==3){
        negoArray['incentiveAmount'].setValue((emi*negoLoanAmnt)/splittedDefaultAmnt)
      }
    }else{ 
       let negoLoanAmnt= Number(this.AssetDetailsList[i].EligibleLoanAmnt)
       let a = (emi*negoLoanAmnt)/splittedDefaultAmnt;
       return a
    }
  }

  // subventionEmiVal(i,flag){
  //   let splittedDefaultAmnt:any = 100000;
  //   let emi = this.AssetDetailsList[i].emiPerLakh?Number(this.AssetDetailsList[i].emiPerLakh):0; 

  //   if(flag){
  //     let negoArray=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'];
  //     let negoLoanAmnt= negoArray['NegotiatedLoanAmount']['value']?Number(negoArray['NegotiatedLoanAmount']['value']):null;
  //    negoArray['subventSchemeEMI'].setValue((emi*negoLoanAmnt)/splittedDefaultAmnt)
  //   }else{ 
  //     let negoLoanAmnt= Number(this.AssetDetailsList[i].EligibleLoanAmnt)
  //      let a = (emi*negoLoanAmnt)/splittedDefaultAmnt;
  //      return a
  //   }
  // }

  // subventionAmntVal(i,flag){
  //   let splittedDefaultAmnt:any = 100000;
  //   let emi = this.AssetDetailsList[i].subventionPerLakh?Number(this.AssetDetailsList[i].subventionPerLakh):0; 

  //   if(flag){
  //     let negoArray=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'];
  //     let negoLoanAmnt= negoArray['NegotiatedLoanAmount']['value']?Number(negoArray['NegotiatedLoanAmount']['value']):null; //1000
  //     negoArray['subventAmount'].setValue((emi*negoLoanAmnt)/splittedDefaultAmnt) 
  //   }else{ 
  //      let negoLoanAmnt= Number(this.AssetDetailsList[i].EligibleLoanAmnt)
  //      let a = (emi*negoLoanAmnt)/splittedDefaultAmnt;
  //      return a
  //   }
  // }

  // incentiveAmntVal(i,flag){
  //   let splittedDefaultAmnt:any = 100000;
  //   let emi = this.AssetDetailsList[i].incentivePerLakh?Number(this.AssetDetailsList[i].incentivePerLakh):0; 

  //   if(flag){
  //     let negoArray=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'];
  //     let negoLoanAmnt= negoArray['NegotiatedLoanAmount']['value']?Number(negoArray['NegotiatedLoanAmount']['value']):null;
  //     negoArray['incentiveAmount'].setValue((emi*negoLoanAmnt)/splittedDefaultAmnt)
  //   }else{ 
  //      let negoLoanAmnt= Number(this.AssetDetailsList[i].EligibleLoanAmnt)
  //      let a = (emi*negoLoanAmnt)/splittedDefaultAmnt;
  //      return a
  //   }
  // }

  //calculatepremiumAmount(event, ins_type_id, i) {
    // const value = event.target.value;
    // this.productCategoryList.forEach(product => {
    //   if (Number(product.insurance_type_id) === ins_type_id) {
    //     if (ins_type_id == 1) {
    //       if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
    //         this.motarButtonFlag[i] = false;
    //       else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
    //         this.motarButtonFlag[i] = true;
    //     }
    //   }
    //   if (Number(product.insurance_type_id) === ins_type_id) {
    //     if (ins_type_id == 2) {
    //       if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
    //         this.PACButtonFlag[i] = false;
    //       else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
    //         this.PACButtonFlag[i] = true;
    //     }
    //   }
    //   if (Number(product.insurance_type_id) === ins_type_id) {
    //     if (ins_type_id == 3) {
    //       if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
    //         this.lifeButtonFlag[i] = false;
    //       else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
    //         this.lifeButtonFlag[i] = true;
    //     }
    //   }
    //   if (Number(product.insurance_type_id) === ins_type_id) {
    //     if (ins_type_id == 4) {
    //       if (Number(product.calculate_premium_api) && product.insurance_provider_id === value)
    //         this.VASButtonFlag[i] = false;
    //       else if ((Number(product.calculate_premium_api) && product.insurance_provider_id != value))
    //         this.VASButtonFlag[i] = true;
    //     }
    //   }
    // });
  //}
  calculateTotal(i) {
    this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
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
      this.negoLoanAmount = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'].NegotiatedLoanAmount.value)
      const subventionAmt= Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventAmount']['value']);
      const loanamount =
      Number(this.PACtemp) +
      Number(this.VAStemp) + Number(this.fastTagtemp) + Number(this.lifeCovertemp) +
      Number(this.MItemp) + this.negoLoanAmount;
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails.get('LoanAmountincludingCrossSell').setValue(loanamount.toString());
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup.get('LoanAmountincludingCrossSell').setValue(loanamount.toString());
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup.get('finalAssetCost').setValue(loanamount.toString());
    const LoanAmountsubtractSubvent = loanamount - ((subventionAmt) ? subventionAmt : 0);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['LoanAmountincludingCrossSellsubtractSubvent'].patchValue(LoanAmountsubtractSubvent);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['LoanAmountincludingCrossSellsubtractSubvent'].patchValue(LoanAmountsubtractSubvent);
    // }
    const formData = this.createNegotiationForm.getRawValue();
    this.totalCrossSellAmt = 0;
    const fastTag = Object.keys(formData.tickets).forEach(key => {
      this.totalCrossSellAmt += Number(formData.tickets[key].loanBookingDetails.LoanAmountincludingCrossSell);
    });
    let percentDeductionValue: Number;
    let selectedIndex;
   
      //this.createNegotiationForm['controls'].LoanAmountincludingCrossSellofalltheassets.patchValue(this.totalCrossSellAmt)
      //this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].patchValue(Number(formData.tickets[i].loanBookingDetails.LoanAmountincludingCrossSell))
      for (let j = 0; j < this.DeductionDetails.length; j++) {
        if (!this.view && this.DeductionDetails[j].DeductionChargeType == "P") {
          percentDeductionValue = (Number(this.DeductionDetails[j].DeductionChargePercentage) / 100) *
            (Number(formData.tickets[i].loanBookingDetails.LoanAmountincludingCrossSell));
          selectedIndex = j;
        }
        else if (this.view && this.DeductionDetails[j].charge_type == "P") {
          percentDeductionValue = (Number(this.DeductionDetails[j].charge_ratio) / 100) *
            (Number(formData.tickets[i].loanBookingDetails.LoanAmountincludingCrossSell));
          selectedIndex = j;
        }
      }
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['DeductionChargefixedRate']
      // [selectedIndex].patchValue({DeductionChargefixedRate: percentDeductionValue})
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['DeductionChargefixedRate'][i].setValue(percentDeductionValue);
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'].
      // DeductionChargefixedRate['controls'][i]['controls'][selectedIndex].patchValue({DeductionChargefixedRate:percentDeductionValue})
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'].
      //   DeductionChargefixedRate['controls'][0]['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: percentDeductionValue })
      //console.log(this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls']);
      this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: (percentDeductionValue).toFixed(2) })
      //console.log(i)
      this.finalAssetCal(i);
      this.loanBookingEmi(i);//whenever Negotiated Amnt Chnages Loan Booking Amnt will get chnage & emi will calaculate again
      this.getNetDisbursementAmount(i);
  }
  calculatededuction(i) {
    let percentDeductionValue: Number;
    let selectedIndex;
    
      for (let j = 0; j < this.DeductionDetails.length; j++) {
        if (!this.view && this.DeductionDetails[j].DeductionChargeType == "P") {
          percentDeductionValue = (Number(this.DeductionDetails[j].DeductionChargePercentage) / 100) *
            (Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value));
          selectedIndex = j;
        }
        else if (this.view && this.DeductionDetails[j].charge_type == "P") {
          percentDeductionValue = (Number(this.DeductionDetails[j].charge_ratio) / 100) *
            (Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value));
          selectedIndex = j;
        }
      }
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'].
      //   DeductionChargefixedRate['controls'][0]['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: percentDeductionValue })
      this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: (percentDeductionValue).toFixed(2) })
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls'].
      // DeductionChargefixedRate['controls'][i]['controls'][selectedIndex].patchValue({DeductionChargefixedRate:percentDeductionValue})
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['DeductionChargefixedRate']
      // [selectedIndex].patchValue({DeductionChargefixedRate: percentDeductionValue})
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['DeductionChargefixedRate'][i].setValue(percentDeductionValue);
    this.getNetDisbursementAmount(i);
  }
  getNetDisbursementAmount(i) {
    //const arrayData = this.createNegotiationForm.controls['tickets1'].value;
    const arrayData = [];
    this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'].forEach(e=>{
      arrayData.push(e.controls) ;
    })
    let sumValue = 0;
    this.PremiumAmntSum = 0;
    this.fastTagAmtSum = 0;
    arrayData.forEach(array => {
      sumValue += Number(array['DeductionChargefixedRate'].value);
    });
    const subventionAmt= Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventAmount']['value']);
    this.subventionAmount = subventionAmt ? subventionAmt : 0;
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].charges.setValue(Math.round(sumValue));
    let am = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']['controls'].MIPremiumAmount.value;
    let ap = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']['controls'].PACPremiumAmount.value;
    let al = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']['controls'].lifeCoverPremiumAmount.value;
    let av = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']['controls'].VASPremiumAmount.value;
    let af = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag['controls'].FASTagAmount.value;

    this.PremiumAmntSum = Number(am) + Number(ap) + Number(al) +Number(av);
    this.fastTagAmtSum = Number(af)
    // this.createNegotiationForm.get('tickets')['controls'].forEach(ticket => {
    //   this.PremiumAmntSum += Number(ticket['controls'].CrossSellInsurance['controls']['motor']['controls'].MIPremiumAmount.value)
    //     + Number(ticket['controls'].CrossSellInsurance['controls']['pac']['controls'].PACPremiumAmount.value)
    //     + Number(ticket['controls'].CrossSellInsurance['controls']['life']['controls'].lifeCoverPremiumAmount.value)
    //     + Number(ticket['controls'].CrossSellInsurance['controls']['vas']['controls'].VASPremiumAmount.value);
    //   this.fastTagAmtSum += Number(ticket['controls'].fastTag['controls'].FASTagAmount.value)
    // })
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].PremiumAmntSum.patchValue(this.PremiumAmntSum);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTagAmtSum.patchValue(this.fastTagAmtSum);
    let gapDaysInterestVal = this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanAmountBreakup']['controls']['gapDaysInterest'].value;
    
    this.gapDaysAmount = gapDaysInterestVal ? Number(gapDaysInterestVal) : 0;
    //this.createNegotiationForm.patchValue({  // GIT Over
    //  NetDisbursementAmount: (Math.round(this.createNegotiationForm.controls.NegotiatedLoanAmount.value) -
    //    Math.round(sumValue + this.fastTagAmtSum + this.PremiumAmntSum)).toFixed(2)
   // });
      const netDisburseAmountValue = Math.round(Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanBookingDetails']['controls']['LoanAmountincludingCrossSell'].value)) - Math.round(Number(sumValue + this.fastTagAmtSum + this.PremiumAmntSum + this.subventionAmount + this.gapDaysAmount));
      this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NetDisbursementAmount'].setValue(netDisburseAmountValue)
  }
  isDecimal = (event) => {
    var charCode = event.keyCode;
    if (charCode == 46 && event.target.value.split('.').length >= 2) {
      return false;
    }
    return true;
  }
  getUIValues(event, isBool, value, i) {
    // if(value == 'MI' && this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']['controls'].motorInsurance.value == '1'){
    //   this.fetchPrmAmount(1,'motor',i)
    // }
    const productCategorySelected = isBool ? event.target.value : event;
    {
      let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].motor['controls']
      let y = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].pac['controls']
      let z = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].vas['controls']
      let a = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'].life['controls']
      let loanBreak = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'];
      
      if (value == 'MI') {
        x.MIPremiumAmount.setValue('') //GIT
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          x.fundingRequiredforMI.setValue(this.FundingRequiredLOV[2].key),
          x.MIPremiumAmount.setValue('0');
          x.fundingRequiredforMI.disable();
          x.MIPremiumAmount.disable();
          x.fundingRequiredforMI.setErrors(null); //GIT
          x.MIPremiumAmount.setErrors(null); //GIT
          
          x.MITenure.setValue(0),
            x.MITenure.disable(),
            x.MITenure.setErrors(null),  //GIT
            y.creditShieldPAC.setValue(productCategorySelected)
          y.fundingRequiredforPAC.setValue(this.FundingRequiredLOV[2].key),
            y.PACPremiumAmount.setValue('0');
          y.creditShieldPAC.disable();
          y.fundingRequiredforPAC.disable();
          y.PACPremiumAmount.disable();
          y.creditShieldPAC.setErrors(null)    //GIT
          y.fundingRequiredforPAC.setErrors(null),  //GIT
            y.PACPremiumAmount.setErrors(null);  //GIT
          z.VAS.setValue(productCategorySelected)
          z.fundingRequiredforVAS.setValue(this.FundingRequiredLOV[2].key),
            z.VASPremiumAmount.setValue('0')
          z.VAS.disable();
          z.fundingRequiredforVAS.disable();
          z.VASPremiumAmount.disable();
          z.VAS.setErrors(null)  //GIT
          z.fundingRequiredforVAS.setErrors(null),  //GIT
            z.VASPremiumAmount.setErrors(null)  //GIT
          loanBreak.MIPremiumAmount.setValue('0');
          loanBreak.PACPremiumAmount.setValue('0');
          loanBreak.VASPremiumAmount.setValue('0');
          let selectedIndex;
        //714 Motor,715 PAC,716 VAS
            for (let j = 0; j < this.DeductionDetails.length; j++) {
              if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "714" || this.DeductionDetails[j].DeductionChargeCode == "715" || this.DeductionDetails[j].DeductionChargeCode == "716" || 
              this.DeductionDetails[j].DeductionChargeCode == "723" || this.DeductionDetails[j].DeductionChargeCode == "726" || this.DeductionDetails[j].DeductionChargeCode == "728")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
              }
              else if (this.view && (this.DeductionDetails[j].charge_code == "714" || this.DeductionDetails[j].charge_code == "715" || this.DeductionDetails[j].charge_code == "716" ||
              this.DeductionDetails[j].charge_code == "723" || this.DeductionDetails[j].charge_code == "726" || this.DeductionDetails[j].charge_code == "728")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
               
              }
            }
          
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          x.fundingRequiredforMI.setValue(this.tempDataFundingRequiredLOV[0].key),
            x.MIPremiumAmount.setValue(null)
          x.fundingRequiredforMI.enable();
          x.MIPremiumAmount.enable();
          y.creditShieldPAC.setValue(productCategorySelected)
          y.fundingRequiredforPAC.setValue(this.tempDataFundingRequiredLOV[0].key),
            y.PACPremiumAmount.setValue(null);
          y.creditShieldPAC.enable();
          y.fundingRequiredforPAC.enable();
          y.PACPremiumAmount.enable();
          z.VAS.setValue(productCategorySelected)
          z.fundingRequiredforVAS.setValue(this.tempDataFundingRequiredLOV[0].key),
            z.VASPremiumAmount.setValue(null);
          z.VAS.enable();
          z.fundingRequiredforVAS.enable();
          z.VASPremiumAmount.enable();
          x.MITenure.setValue('1'),
          this.LeadReferenceDetails[0].ProductCode == "NC" ? x.MITenure.enable() : x.MITenure.disable(),
          loanBreak.MIPremiumAmount.setValue(null);
          loanBreak.PACPremiumAmount.setValue(null);
          loanBreak.VASPremiumAmount.setValue(null);
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
          let selectedIndex;
        //714 Motor,715 PAC,716 VAS
            for (let j = 0; j < this.DeductionDetails.length; j++) {
              if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "714" || this.DeductionDetails[j].DeductionChargeCode == "715" || this.DeductionDetails[j].DeductionChargeCode == "716" || 
              this.DeductionDetails[j].DeductionChargeCode == "723" || this.DeductionDetails[j].DeductionChargeCode == "726" || this.DeductionDetails[j].DeductionChargeCode == "728")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
              }
              else if (this.view && (this.DeductionDetails[j].charge_code == "714" || this.DeductionDetails[j].charge_code == "715" || this.DeductionDetails[j].charge_code == "716" || 
              this.DeductionDetails[j].charge_code == "723" || this.DeductionDetails[j].charge_code == "726" || this.DeductionDetails[j].charge_code == "728")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable() 
              }
            }
        }
        this.motorInsuranceProviderName = event.target.value
      }
      else if (value == 'PAC') {
        y.PACPremiumAmount.setValue('') //GIT
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          y.fundingRequiredforPAC.setValue(this.FundingRequiredLOV[2].key),
            y.PACPremiumAmount.setValue(0);
          y.fundingRequiredforPAC.disable();
          y.PACPremiumAmount.disable();
          y.fundingRequiredforPAC.setErrors(null); //GIT
          y.PACPremiumAmount.setErrors(null); //GIT
          loanBreak.PACPremiumAmount.setValue(0);
          let selectedIndex;
          for (let j = 0; j < this.DeductionDetails.length; j++) {
            if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "715" || this.DeductionDetails[j].DeductionChargeCode == "726")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
            }
            else if (this.view && (this.DeductionDetails[j].charge_code == "715" || this.DeductionDetails[j].charge_code == "726")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
             
            }
          }
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          y.fundingRequiredforPAC.setValue(this.tempDataFundingRequiredLOV[0].key),
            y.PACPremiumAmount.setValue(null)
          y.fundingRequiredforPAC.enable();
          y.PACPremiumAmount.enable();
          loanBreak.PACPremiumAmount.setValue(null);
          let selectedIndex;
          for (let j = 0; j < this.DeductionDetails.length; j++) {
            if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "715" || this.DeductionDetails[j].DeductionChargeCode == "726")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
            }
            else if (this.view && (this.DeductionDetails[j].charge_code == "715" || this.DeductionDetails[j].charge_code == "726")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
             
            }
          }
        }
        this.pACInsuranceProviderName = event.target.value
      }
      else if (value == 'VAS') {
        z.VASPremiumAmount.setValue('')  //GIT
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicable = true;
          z.fundingRequiredforVAS.setValue(this.FundingRequiredLOV[2].key),
            z.VASPremiumAmount.setValue(0)
          z.fundingRequiredforVAS.disable();
          z.VASPremiumAmount.disable();
          z.fundingRequiredforVAS.setErrors(null) //GIT
          z.VASPremiumAmount.setErrors(null)//GIT
          loanBreak.VASPremiumAmount.setValue(0);
          let selectedIndex;
          for (let j = 0; j < this.DeductionDetails.length; j++) {
            if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "716" || this.DeductionDetails[j].DeductionChargeCode == "728")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
            }
            else if (this.view && (this.DeductionDetails[j].charge_code == "716" || this.DeductionDetails[j].charge_code == "728")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
             
            }
          }
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicable = false;
          z.fundingRequiredforVAS.setValue(this.tempDataFundingRequiredLOV[0].key),
            z.VASPremiumAmount.setValue(null)
          z.fundingRequiredforVAS.enable();
          z.VASPremiumAmount.enable();
          loanBreak.VASPremiumAmount.setValue(null);
          let selectedIndex;
          for (let j = 0; j < this.DeductionDetails.length; j++) {
            if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "716" || this.DeductionDetails[j].DeductionChargeCode == "728")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
            }
            else if (this.view && (this.DeductionDetails[j].charge_code == "716" || this.DeductionDetails[j].charge_code == "728")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
             
            }
          }
        }
        this.vASInsuranceProvidersName = event.target.value
      }
      else if (value == 'creditShield') {
        a.lifeCoverPremiumAmount.setValue(null) //GIT
        if (isBool === true && productCategorySelected == 4) {
          this.showapplicableCredit = true;
          a.fundingRequiredforlifeCover.setErrors(null); //GIT
          a.lifeCoverPremiumAmount.setErrors(null);//GIT
          a.fundingforLifeCover.setErrors(null); //GIT
          a.fundingforLifeCover.setValue(this.InsuranceSlabLOV[6].key)
          a.fundingRequiredforlifeCover.setValue(this.FundingRequiredLOV[2].key),
            a.lifeCoverPremiumAmount.setValue('0');
          a.fundingRequiredforlifeCover.disable();
          a.lifeCoverPremiumAmount.disable();
          a.fundingforLifeCover.disable();
          loanBreak.lifeCoverPremiumAmount.setValue(0);
          let selectedIndex;
          for (let j = 0; j < this.DeductionDetails.length; j++) {
            if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "713" || this.DeductionDetails[j].DeductionChargeCode == "720" || this.DeductionDetails[j].DeductionChargeCode == "719")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
            }
            else if (this.view && (this.DeductionDetails[j].charge_code == "713" || this.DeductionDetails[j].charge_code == "720" || this.DeductionDetails[j].charge_code == "719")) {
              selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
             
            }
          }
        }
        else if (isBool === true && productCategorySelected != 4) {
          this.showapplicableCredit = false;
          this.tempDataFundingRequiredLOV = [];
          this.FundingRequiredLOV.forEach((element) => {
            if (element.key != "3FNDREQ") {
              this.tempDataFundingRequiredLOV.push(element)
            }
          });
          a.fundingforLifeCover.setValue(this.InsuranceSlabLOV[0].key)
          a.fundingforLifeCover.enable();
          a.fundingRequiredforlifeCover.setValue(this.tempDataFundingRequiredLOV[0].key),
            a.lifeCoverPremiumAmount.setValue(null)
          a.fundingRequiredforlifeCover.enable();
          a.lifeCoverPremiumAmount.enable();
          loanBreak.lifeCoverPremiumAmount.setValue(null);
          let selectedIndex;
          for (let j = 0; j < this.DeductionDetails.length; j++) {
            if(productCategorySelected == 2){
              if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "713" || this.DeductionDetails[j].DeductionChargeCode == "720")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
              } else if(!this.view && this.DeductionDetails[j].DeductionChargeCode == "719"){
                selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
              } else if (this.view && (this.DeductionDetails[j].charge_code == "713" || this.DeductionDetails[j].charge_code == "720")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
              } else if(this.view && this.DeductionDetails[j].charge_code == "719"){
                selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
              }
            } else if (productCategorySelected == 3){
              if (!this.view && (this.DeductionDetails[j].DeductionChargeCode == "713" || this.DeductionDetails[j].DeductionChargeCode == "719")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
              } else if(!this.view && this.DeductionDetails[j].DeductionChargeCode == "720"){
                selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
              } else if (this.view && (this.DeductionDetails[j].charge_code == "713" || this.DeductionDetails[j].charge_code == "719")) {
                selectedIndex = j;
                this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.enable()
              } else if(this.view && this.DeductionDetails[j].charge_code == "720"){
                selectedIndex = j;
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex].patchValue({ DeductionChargefixedRate: 0 })
              this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
              }
            }
          }
        }
        this.creditShieldInsuranceProviderName = event.target.value
      }
      else if (value == 'fastTag') {
        let b = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag['controls'];
        let loanBreakFasTag = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'];
        if (isBool === true && productCategorySelected == 2) {
          this.showapplicableFastag = true;
          b.fundingRequiredforFASTag.setValue(this.FundingRequiredLOV[2].key),
            b.FASTagAmount.setValue(0)
            loanBreakFasTag.FASTagAmount.setValue(0)
          b.fundingRequiredforFASTag.disable();
          b.FASTagAmount.disable();
          b.FASTagAmount.setErrors(null); //GIT
        }
        else if (isBool === true && productCategorySelected != 2) {
          this.showapplicableFastag = false;
          b.fundingRequiredforFASTag.setValue(this.tempDataFundingRequiredLOV[0].key),
            b.FASTagAmount.setValue(null)
            loanBreakFasTag.FASTagAmount.setValue(null)
          b.fundingRequiredforFASTag.enable();
          b.FASTagAmount.enable();
        }
      }
    }
  }

  validateNegoLoanTenor(event,i){ //Nego Enhance
    let eliTenorMin:any='';
    let eliTenorMax:any='';
    let reqTenor:any='';
    let tenorReq:any=false;
    if(!this.view){
      eliTenorMin = this.AssetDetailsList[i].EligibleTenorMin?this.AssetDetailsList[i].EligibleTenorMin*12:'';
      eliTenorMax = this.AssetDetailsList[i].EligibleTenorMax?this.AssetDetailsList[i].EligibleTenorMax*12:'';
      reqTenor=(this.createNegotiationForm.controls.reqLoanTenor.value)?parseInt(this.createNegotiationForm.controls.reqLoanTenor.value):'';
      if(reqTenor>=eliTenorMin && reqTenor<=eliTenorMax){
        tenorReq=true;
      }else{
        tenorReq=false;
      }
    }
    let enteredValue = event.target.value?Number(event.target.value):null;
    let ctrMinTerm=this.productLoanDetails.ctrMinTerm?Number(this.productLoanDetails.ctrMinTerm):null;
    let ctrMaxTerm=this.productLoanDetails.ctrMaxTerm?Number(this.productLoanDetails.ctrMaxTerm):null;

    if(!(enteredValue>=ctrMinTerm && enteredValue<=ctrMaxTerm)){ // checking the entered value is between min & max Interest
      this.toasterService.showError('Loan Tenor (in months) configured for this product is ' + ctrMinTerm + ' to ' + ctrMaxTerm + '. Please input Tenor within this range', '');
      this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanTenor'].setValue((tenorReq)?this.createNegotiationForm.controls.reqLoanTenor.value:eliTenorMax)
    }

  }

  changeRepaymentFrequency(event,i){
    let value = event.target.value;
    if(value!='1LOSREPAYFRE'){
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure'].setValue('1EMISTRUCT');
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure'].disable();
    }else{//if Repayment function is Monthly
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure'].enable(); 
    }
  }
  getRepayableMonths(i) {
    
      const ab = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value);
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['NoofRepayableMonthsafterMoratorium'].setValue(ab);
  }
  calculateMinMax(value, i) {
    let minmax = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['repaymentMode'].value;
    let pdcvalue = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['NoofPDC'];
    let spdcvalue = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['NoofSPDC'];
    if (value == 'empty') {
      pdcvalue.setValue(null);
      spdcvalue.setValue(null);
      pdcvalue.setErrors(null);
      spdcvalue.setErrors(null);
    }
    if ((minmax == '1LOSREPAY') || (minmax == '2LOSREPAY')) {
      this.minValuePDC = "1"
      this.maxValuePDC = "4"
      this.PDCvalueCheck = [{ rule: pdcvalue => Number(pdcvalue) > Number(this.maxValuePDC), msg: 'Value should be between 1 and 4' },
      { rule: pdcvalue => Number(pdcvalue) < Number(this.minValuePDC), msg: 'Value should be between 1 and 4' }];
      if (value == 'empty') {
        pdcvalue.setValue("1");
        spdcvalue.setValue("5");
        pdcvalue.setErrors(null);
        spdcvalue.setErrors(null);
      }
    }
    else if (minmax == '4LOSREPAY') {
      this.minValuePDC = "0"
      this.maxValuePDC = "4"
      this.PDCvalueCheck = [{ rule: pdcvalue => Number(pdcvalue) > Number(this.maxValuePDC), msg: 'Value should be between 0 and 4' },
      { rule: pdcvalue => Number(pdcvalue) < Number(this.minValuePDC), msg: 'Value should be between 0 and 4' }];
      if (value == 'empty') {
        pdcvalue.setValue("0");
        spdcvalue.setValue("5");
        pdcvalue.setErrors(null);
        spdcvalue.setErrors(null);
      }
    }
    else if (minmax == '3LOSREPAY') {
      let minvalue = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value;
      let maxvalue = (Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value) + 5).toString();
      this.minValuePDC = minvalue;
      this.maxValuePDC = maxvalue;
      this.PDCvalueCheck = [{
        rule: pdcvalue => Number(pdcvalue) > Number(this.maxValuePDC), msg: 'Value should be between' +
          ' ' + minvalue + ' ' + 'to' + ' ' + maxvalue
      },
      {
        rule: pdcvalue => Number(pdcvalue) < Number(this.minValuePDC), msg: 'Value should be between' +
          ' ' + minvalue + ' ' + 'to' + ' ' + maxvalue
      }];
      if (value == 'empty') {
        pdcvalue.setValue(minvalue);
        spdcvalue.setValue("5");
        pdcvalue.setErrors(null);
        spdcvalue.setErrors(null);
      }
    }
    this.minValueSPDC = "5"
    this.maxValueSPDC = "8"
    this.SPDCvalueCheck = [{ rule: spdcvalue => Number(spdcvalue) > Number(this.maxValueSPDC), msg: 'value should be between 5 and 8' },
    { rule: spdcvalue => Number(spdcvalue) < Number(this.minValueSPDC), msg: 'value should be between 5 and 8' }];
    // this.collectedChequeMaxMin(value, i);
    
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofPDC'].setValue(null);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray['controls']['collectedNoofSPDC'].setValue(null);
  }
  setLMSCode(i,val){
    this.tempLMSScheduleLOVData = [];
    this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls']['SelectAppropriateLMSScheduleCode'].setValue('');
    let aR = this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanBookingDetails']['controls']['repaymentFrequency'].value;
    let aE = this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanBookingDetails']['controls']['EMIStructure'].value;
    let aG = this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanBookingDetails']['controls']['PaymentModeforGapDaysInterest'].value;
    
    if(aR && aE && aG){
      const data = {
        "repaymentFrequency": aR,
        "EMIStructure": aE,
        "LMSProductCode": this.LeadReferenceDetails[0].LMSProductCode,
        "LOSProductCode": this.LeadReferenceDetails[0].LOSProductCode,
        "gapDaysMode": aG
          }
          if(data){
            this.LMSScheduleLOVData.forEach(element => {
              if(aE == element.emi_structure && aR == element.repay_frequency && aG == element.gap_days_pay_mode)
              {
              var obj = {
                key: element.schedule_type_code,
                value: element.schedule_type_name
              }
              this.tempLMSScheduleLOVData.push(obj)
            }
            });
            if((val == true) && this.tempLMSScheduleLOVData.length == 1) {
              this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls']['SelectAppropriateLMSScheduleCode'].patchValue(this.tempLMSScheduleLOVData[0].key)
            }
          }
         
    }
    
  }
  setEMIStru(i){   
    let getValue=this.createNegotiationForm.get('tickets')['controls'][i]['controls']['loanBookingDetails']['controls']['PaymentModeforGapDaysInterest'].value;  
    if(getValue=='3GAPDYS'){
      this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls']['EMIStructure'].enable();
    }else{
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['EMIStructure'].setValue('1EMISTRUCT');
      this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls']['EMIStructure'].disable();
    }
  }
  
  getLOV() {
    this.NegotiationService
      .getmotorInsuranceData().subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.motorInsuranceData = res.ProcessVariables         
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
          this.FASTagReqLOV = this.FASTagReqLOV;
          this.MoratoriumDaysLOV = res.ProcessVariables.MoratoriumDaysLOV;
          this.RepaymentLOV = res.ProcessVariables.RepaymentLOV;
          this.RepayFrequencyLOV = res.ProcessVariables.RepayFrequencyLOV;
          this.EMIStructureLOV  = res.ProcessVariables.EMIStructureLOV;
          //console.log('emiLov-->',this.EMIStructureLOV) 
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
  allowSix(event, i) {
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
    
      // if (Number(valueEntered) % 6 == 0) {
      //   this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].setValue(valueEntered.toString());
      // }
      // else {
      //   this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].setValue(null)
      //   this.toasterService.showError(
      //     'Negotiated Loan Tenor should be in multiples of 6.',
      //     'Create Negotiation'
      //   );
      // }
      for (let i = 0; i < this.AssetDetailsList.length; i++) {
        this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']
        let lifecoveramount = this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value;
        if (lifecoveramount && Number(valueEntered) < 24) {
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].setValue(null)
          this.toasterService.showError('Negotiated Loan Tenor should be minimum of 2 Years for credit shield Life Cover', '');
        }
      }
  }
  getEMIDate(i,val) {
    // $('#emidates option').remove();
    this.EMICycleDaysLOV = [];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    //var moratoriumDays = parseInt(this.createNegotiationForm.controls.MoratoriumPeriod.value);
    var moratoriumDays = parseInt(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['MoratoriumPeriod'].value);
    var repaymentDays = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['repaymentFrequency'].value
    
    if ((moratoriumDays == 1 && repaymentDays == '1LOSREPAYFRE') || val == 1) {
      moratoriumDays = 30;
    } else if ((moratoriumDays == 1 && repaymentDays == '2LOSREPAYFRE') || (moratoriumDays == 2 && repaymentDays == '1LOSREPAYFRE')) {
      moratoriumDays = 30;
    } else if (moratoriumDays == 1 && repaymentDays == '3LOSREPAYFRE' || moratoriumDays == 3 && repaymentDays == '1LOSREPAYFRE' || moratoriumDays == 2 && repaymentDays == '2LOSREPAYFRE') {
      moratoriumDays = 60;
    } else if (moratoriumDays == 1 && repaymentDays == '4LOSREPAYFRE' || moratoriumDays == 4 && repaymentDays == '1LOSREPAYFRE' || moratoriumDays == 3 && repaymentDays == '2LOSREPAYFRE' || moratoriumDays == 2 && repaymentDays == '3LOSREPAYFRE') {
      moratoriumDays = 90;
    } else if (moratoriumDays == 2 && repaymentDays == '4LOSREPAYFRE' || moratoriumDays == 3 && repaymentDays == '3LOSREPAYFRE' || moratoriumDays == 4 && repaymentDays == '2LOSREPAYFRE'){
      moratoriumDays = 120;
    } else if (moratoriumDays == 3 && repaymentDays == '4LOSREPAYFRE' || moratoriumDays == 4 && repaymentDays == '3LOSREPAYFRE'){
      moratoriumDays = 150;
    } else if (moratoriumDays == 4 && repaymentDays == '4LOSREPAYFRE'){
      moratoriumDays = 180;
    }

    var disbursementDay = new Date();
    if (environment.hostingEnvironment == 'DEV' || environment.hostingEnvironment == 'UAT' || environment.hostingEnvironment == 'SIT') {
      disbursementDay = new Date(environment.lmsSITDate);
    }
    disbursementDay.setDate(disbursementDay.getDate());
    var d = disbursementDay;
    d.setDate(disbursementDay.getDate() + moratoriumDays);
    for (let i = 15; i < 60; i++) {
      if (i == 15)
        d.setDate(d.getDate() + i);
      else
        d.setDate(d.getDate() + 1);
      if (d.getDate() % 5 == 0 && d.getDate() !== 25 && d.getDate() !== 30) {
        let emidate = d.getDate() + "-" + months[d.getMonth()] + "-" + d.getFullYear();
        // $('#emidates').append(new Option(emidate, emidate));
        let x = 0
        var obj = {
          key: emidate,
          value: emidate
        }
        this.EMICycleDaysLOV.push(obj);
      }
    }
    let EMIStartDate = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls'];
    EMIStartDate['EMIStartDateAfterDisbursement'].setValue(this.EMICycleDaysLOV.length > 0 ? this.EMICycleDaysLOV[0].key : '');
  }
  calculateEMI(i) {
    
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].value ?
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].setValue(0) : 0;
      let IRR = parseFloat(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].value) / 1200;
      let loanAmount = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value ?
        Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value) : null;
      let loanTenor = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value ?
        Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value) : null;
      if (IRR && loanAmount && loanTenor){
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].setValue(
          Math.round((loanAmount * IRR) / (1 - (Math.pow(1 / (1 + IRR), loanTenor)))));
       
        let emiVal=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI']['value']?
        Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI']['value']):null;
        let amtMinInstal=this.productLoanDetails.amtMinInstal?Number(this.productLoanDetails.amtMinInstal):null;
        let amtMaxInstal=this.productLoanDetails.amtMaxInstal?Number(this.productLoanDetails.amtMaxInstal):null;

      if(!(emiVal>=amtMinInstal && emiVal<=amtMaxInstal)){            
              this.toasterService.showError(
                'EMI configured for this product' + (this.productLoanDetails.amtMinInstal) + ' to ' + (this.productLoanDetails.amtMaxInstal) + 'Please input EMI Amount within this range',
                'Create Negotiation'
              );
      }
        }

        // Clearing EMi Structure & Structure Related
        this.mockIndex=i;
        let loanBookingValues = this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls'];
        let emiStruVal=loanBookingValues['EMIStructure']['value'];
        emiStruVal=emiStruVal?((emiStruVal=='1EMISTRUCT')?emiStruVal:loanBookingValues['EMIStructure'].setValue('')):emiStruVal;
        loanBookingValues['emiDefaultValue'].setValue('');
        if(emiStruVal && emiStruVal!='1EMISTRUCT'){
        this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm'].get('variableFormArray').controls=[];
        this.formArr.push(this.initRowsDefault(i,false));
        this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
       }
        
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
	          this.minInterest = res.ProcessVariables.ratMinVar;
            this.maxInterest = res.ProcessVariables.ratMaxVar;
            this.baseInterest = res.ProcessVariables.baseInterest;
            this.fetchValue();
          }
          else {
            this.view = false;
          }
          this.AssetDetailsList = res.ProcessVariables.AssetDetails ? res.ProcessVariables.AssetDetails : [];
          this.LeadReferenceDetails = res.ProcessVariables.LeadReferenceDetails ? res.ProcessVariables.LeadReferenceDetails : [];
          this.DeductionDetails = res.ProcessVariables.DeductionDetails ? res.ProcessVariables.DeductionDetails : [];
          //this.tempDeductionDetails = res.ProcessVariables.DeductionDetails ? res.ProcessVariables.DeductionDetails : [];
          var LMSScheduletemp = res.ProcessVariables.LMSSchedule ? res.ProcessVariables.LMSSchedule : [];
          this.minLoanAmount = res.ProcessVariables.ProductLoanDetails.amtMinLoan;
          this.maxLoanAmount = res.ProcessVariables.ProductLoanDetails.amtMaxLoan;
          this.minEMIAmount = res.ProcessVariables.ProductLoanDetails.amtMinInstal;
          this.maxEMIAmount = res.ProcessVariables.ProductLoanDetails.amtMaxInstal;
          this.minLoanTenor = res.ProcessVariables.ProductLoanDetails.ctrMinTerm;
          this.maxLoanTenor = res.ProcessVariables.ProductLoanDetails.ctrMaxTerm;
          this.minInterest = res.ProcessVariables.ratMinVar;
          this.maxInterest = res.ProcessVariables.ratMaxVar;
          this.baseInterest = res.ProcessVariables.baseInterest;
          this.productLoanDetails= res.ProcessVariables.ProductLoanDetails;
          this.LMSScheduleLOVData = res.ProcessVariables.LMSScheduleLOV;
          this.isSecured=res.ProcessVariables.isSecured;
          if(this.LeadReferenceDetails){
            if(this.LeadReferenceDetails[0].ProductCode == "NCV" || this.LeadReferenceDetails[0].ProductCode == "NC"){
              this.showRegFields = false;
            } else {
              this.showRegFields = true;
            }
            if(this.LeadReferenceDetails[0].ProductCode == "NCV" || this.LeadReferenceDetails[0].ProductCode == "NC" || this.LeadReferenceDetails[0].ProductCode == "NTCR"){
              this.showInsuranceFields = true;
            } else {
              this.showInsuranceFields = false;
            }
          }
          //console.log('getAssetDetails-->', this.AssetDetailsList);
          //console.log('leadReferenceDet-->', this.LeadReferenceDetails)
          //console.log('ProcessVar-->',res.ProcessVariables)
          // this.DeductionDetails
    this.LMSSchedule = [];
           //console.log('lmsLov-->',LMSScheduletemp);
          if (LMSScheduletemp.length != 0) {
            LMSScheduletemp.forEach(element => {
              if(element.isVariableEMI){
                //add the lms lov here
              }
              var obj =
              {
                key: element.ScheduleTypeCode,
                value: element.ScheduleTypeName
              }
              this.LMSSchedule.push(obj)
            })
          }
          for(let i = 0; i < this.AssetDetailsList.length; i++){
            this.AssetDetailsList[i] = Object.assign(this.AssetDetailsList[i],{
              DeductionDetails:this.DeductionDetails
            }) ;
          }
          if (this.view == false){
            for(let j = 0; j < this.AssetDetailsList.length; j++){
              const numberOfTickets1 = this.AssetDetailsList[j].DeductionDetails.length;
              if (this.deductChargesArray.length < numberOfTickets1) {
                for (let k = this.deductChargesArray.length; k < numberOfTickets1; k++) {
                  this.deductionLabel[k] = this.AssetDetailsList[j].DeductionDetails[k].DeductionChargeName;
                  if (this.AssetDetailsList[j].DeductionDetails[k].DeductionChargeType != "P")
                  this.AssetDetailsList[j].DeductionDetails[k].DeductionChargefixedRate = this.AssetDetailsList[j].DeductionDetails[k].DeductionChargefixedRate;
                  this.deductChargesArray.push(this.fb.group({
                    DeductionChargefixedRate: this.AssetDetailsList[j].DeductionDetails[k].DeductionChargefixedRate,
                  }));                  
                };
                if (this.roleType === 5 || this.roleType === 4) {
                  this.deductChargesArray.disable();
                }
              };
            }
          }
          // if(this.view == false){
          //   for(let j = 0; j < this.AssetDetailsList.length; j++){
          //     const numberOfTickets2 = this.AssetDetailsList[j].DeductionDetails.length;
          //     if (this.tempDeductionDetails.length < numberOfTickets2) {
          //       for (let k = this.tempDeductionDetails.length; k < numberOfTickets2; k++) {
          //         this.deductionLabel[k] = this.AssetDetailsList[j].DeductionDetails[k].DeductionChargeName;
          //         if (this.AssetDetailsList[j].DeductionDetails[k].DeductionChargeType != "P")
          //         this.AssetDetailsList[j].DeductionDetails[k].DeductionChargefixedRate = this.AssetDetailsList[j].DeductionDetails[k].DeductionChargefixedRate;
          //         this.tempDeductionDetails.push(this.fb.group({
          //           DeductionChargefixedRate: this.AssetDetailsList[j].DeductionDetails[k].DeductionChargefixedRate,
          //         }));
          //       };
                
          //     };
          //   }
          // }

          const productCode = this.LeadReferenceDetails[0].LMSProductCode + "-"
            + this.LeadReferenceDetails[0].LMSProductName;
          this.createNegotiationForm.patchValue({
            productCode: productCode,
            applicant: this.LeadReferenceDetails[0].FullName,
            CustomerCategory: this.LeadReferenceDetails[0].CustomerCategory,
            reqLoanAmount: this.LeadReferenceDetails[0].RequestLoanAmnt,
            reqLoanTenor: this.LeadReferenceDetails[0].RequestedLoanTenure,
          });
          // for (let i = this.applicant1.length + 1; i < this.LeadReferenceDetails.length; i++) {
          //   if (this.LeadReferenceDetails[i].LoanApplicationRelation == "COAPPAPPRELLEAD") {
          //     this.applicant1.push(this.fb.group({
          //       coApplicant: [{ value: this.LeadReferenceDetails[i].FullName, disabled: true }],
          //       coapplicantCategory: [{ value: this.LeadReferenceDetails[i].CustomerCategory, disabled: true }]
          //     }));
          //   }
          // };
          // for (let i = this.guarantor1.length + 1; i < this.LeadReferenceDetails.length; i++) {
          //   if (this.LeadReferenceDetails[i].LoanApplicationRelation == "GUARAPPRELLEAD") {
          //     this.guarantor1.push(this.fb.group({
          //       guarantor: [{ value: this.LeadReferenceDetails[i].FullName, disabled: true }],
          //       guarantorCategory: [{ value: this.LeadReferenceDetails[i].CustomerCategory, disabled: true }]
          //     }));
          //   }
          // };
          // if (this.viewchange == true) {
          //   while (this.t.length !== 0) {
          //     this.t.removeAt(0)
          //   }
          // }
          if (this.t.length < this.AssetDetailsList.length) {
            for (let i = this.t.length; i < this.AssetDetailsList.length; i++) {
              this.motarButtonFlag.push(false);
              this.PACButtonFlag.push(false);
              this.lifeButtonFlag.push(false);
              this.VASButtonFlag.push(false);
              
                var eliTenorMin = this.AssetDetailsList[i].EligibleTenorMin?this.AssetDetailsList[i].EligibleTenorMin*12:'';
                var eliTenorMax = this.AssetDetailsList[i].EligibleTenorMax?this.AssetDetailsList[i].EligibleTenorMax*12:'';
                var reqTenor=(this.createNegotiationForm.controls.reqLoanTenor.value)?parseInt(this.createNegotiationForm.controls.reqLoanTenor.value):'';
                if(reqTenor>=eliTenorMin && reqTenor<=eliTenorMax){
                  var tenorReq=true;
                }else{
                  var tenorReq=false;
                }

                this.t.push(
                  this.fb.group({
                    PremiumAmntSum:[{ value: ''}],
                    fastTagAmtSum:[{value: ''}],
                    processingFee:[{value: ''}],
                    serviceCharge:[{value: ''}],
                    vehicleModel: [{ value: this.AssetDetailsList[i].VehicleModel, disabled: true }],
                    fundingProgram: [{ value: this.AssetDetailsList[i].FundingProgram, disabled: true }],
                    PromotionScheme: [{ value: this.AssetDetailsList[i].PromotionScheme, disabled: true }],
                    regNo: [{
                      value: this.AssetDetailsList[i].VehicleRegistrationNo ?
                        this.AssetDetailsList[i].VehicleRegistrationNo.toUpperCase() : null, disabled: true
                    }],
                    ManufacturingYear: [{ value: this.AssetDetailsList[i].ManufacturingDate ? this.AssetDetailsList[i].ManufacturingDate.split('/')[2] : null, disabled: true }],
                    ageofAsset: [{ value: this.AssetDetailsList[i].AssetAge, disabled: true }],
                    eligibleLTV: [{ value: this.AssetDetailsList[i].EligibleLTV, disabled: true }],
                    promoCode: [{ value: this.AssetDetailsList[i].VehicleRegistrationNo, disabled: true }],
                    eligibleLoanAmount: [{ value: this.AssetDetailsList[i].EligibleLoanAmnt, disabled: true }],
                    eligibleLoanTenor: [{ value: (this.AssetDetailsList[i].EligibleTenorMin && this.AssetDetailsList[i].EligibleTenorMax) ? this.AssetDetailsList[i].EligibleTenorMin + " " + "To" + " " + this.AssetDetailsList[i].EligibleTenorMax + " " + "Years" : '', disabled: true }],
                    EligibleIRR: [{ value: (this.AssetDetailsList[i].EligibleIRRMin && this.AssetDetailsList[i].EligibleIRRMax) ? this.AssetDetailsList[i].EligibleIRRMin + " " + "To" + " " + this.AssetDetailsList[i].EligibleIRRMax : '', disabled: true }],
                    negotiationformArray: this.fb.group({
                      NegotiatedLoanAmount: [{ value: (this.view == false)?(this.LeadReferenceDetails[0].RequestLoanAmnt):'', disabled: false },[Validators.required]],//8580 , defaulted as requested loan amnount as per mail
                      NegotiatedLoanTenor: [{value:((this.view == false)?((tenorReq)?this.createNegotiationForm.controls.reqLoanTenor.value:eliTenorMax):''),disabled: false}],
                      NegotiatedIRR: [{ value: (this.view == false)?(this.AssetDetailsList[i].EligibleIRRMin):'', disabled: false }],
                      variableIRR:['',],
                      NegotiatedEMI: [{value: '',disabled: true}],
                      subventSchemeLoanTenor: [{ value: this.AssetDetailsList[i].subventionTenure, disabled: true }],
                      subventionSchemeIRR: [{ value: this.AssetDetailsList[i].subventionIRR, disabled: true }],
                      // subventSchemeEMI: [{ value: (this.view == false)?(this.subventionEmiVal(i,false)):'', disabled: true }],
                      // subventAmount: [{ value: (this.view == false)?(this.subventionAmntVal(i,false)):'', disabled: true }],
                      // incentiveAmount: [{ value: (this.view == false)?(this.incentiveAmntVal(i,false)):'', disabled: true }],
                      subventSchemeEMI: [{ value: (this.view == false)?(this.subventionValidations(i,false,1)):'', disabled: true }],
                      subventAmount: [{ value: (this.view == false)?(this.subventionValidations(i,false,2)):'', disabled: true }],
                      incentiveAmount: [{ value: (this.view == false)?(this.subventionValidations(i,false,3)):'', disabled: true }],
                      
                      NetDisbursementAmount: [{value: '',disabled: true},[Validators.required]],
                     
                    }),
                    // ddformArray:this.fb.group({
                    //   DeductionDetails: this.fb.array(this.tempDeductionDetails) ,
                    // }),
                    
                    DeductionChargefixedRate: this.deductChargesArray,
                    // DeductionChargefixedRate: this.fb.array([this.deductChargesArray]),
                    //DeductionChargefixedRate: this.fb.array([this.AssetDetailsList[i].DeductionDetails]),
                    repaymentmodeArray: this.fb.group({
                      repaymentMode: ['',[Validators.required]],
                      NoofPDC: ['',[Validators.required]],
                      NoofSPDC: ['',[Validators.required]],
                      collectedNoofPDC: [''],
                      collectedNoofSPDC: [''],
                    }),

                    approvalForm: this.fb.group({
                      approvedBy: [''],
                      approvalStatus: [{value: '', disabled: true}],
                      deferralDate: ['']
                    }),

                    variableForm : this.fb.group({
                      variableFormArray: ((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='I') || (this.AssetDetailsList[i].schemeType=='SI')) ? this.fb.array([]) : this.fb.array([]) // Validating the whole table Array(formArrayName)
                    }),

                    mockSchForm : this.fb.group({
                      mockSchFormArray: ((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='I') || (this.AssetDetailsList[i].schemeType=='SI')) ? this.fb.array([]) : this.fb.array([this.msInitRowsDefault(false,'')]) // Validating the whole table Array(formArrayName)
                    }),
                    
                    netAssetCost: [{ value: this.AssetDetailsList[i].FinalAssetCost, disabled: true }],
                    CrossSellInsurance: this.fb.group({
                      motor: this.fb.group({
                        //motorInsurance: (this.view == false) ? this.InsuranceProvidersLOV ? this.InsuranceProvidersLOV[0].key : null : null,
                        motorInsurance: [(this.view == false) ? this.AssetDetailsList[i].mi_ins_prov ? this.AssetDetailsList[i].mi_ins_prov : '' : '',[Validators.required]],
                        //MITenure:(this.view == false) ? this.AssetDetailsList[i].mi_ins_prov == 1 ? {value:'1',disabled:true} : null : null,
                        MITenure: [(this.view == false) ? ((this.LeadReferenceDetails[0].ProductCode == "NC") ? {value:'1',disabled:false} : (this.AssetDetailsList[i].mi_ins_prov == 1 ? {value:'1',disabled:true} : null) ) : null,[Validators.required]],
                        fundingRequiredforMI: [(this.view == false) ? '' : null,[Validators.required]],
                        MIPremiumAmount: [(this.view == false) ? '' : null, [Validators.required,Validators.maxLength(10)]],
                        // ['', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]],
                      }),
                      pac: this.fb.group({
                        creditShieldPAC: [(this.view == false) ? '': null,[Validators.required]],
                        PACPremiumAmount: [(this.view == false) ? '' : null, [Validators.required,Validators.maxLength(10)]],
                        fundingRequiredforPAC: [(this.view == false) ? '': null,[Validators.required]],
                      }),
                      life: this.fb.group({
                        creditShieldLifeCover: [(this.view == false) ? this.AssetDetailsList[i].credit_ins_prov ? this.AssetDetailsList[i].credit_ins_prov : '' : '',[Validators.required]],
                        fundingforLifeCover: [(this.view == false) ? this.InsuranceSlabLOV[0].key : '',[Validators.required]],
                        lifeCoverPremiumAmount: [(this.view == false) ? '' : null, [Validators.required,Validators.maxLength(10)]],
                        fundingRequiredforlifeCover: [(this.view == false) ? this.tempDataFundingRequiredLOV[0].key : null,[Validators.required]],
                      }),
                      vas: this.fb.group({
                        VAS: [(this.view == false) ? '' : null,[Validators.required]],
                        VASPremiumAmount: [(this.view == false) ? '' : null, [Validators.required,Validators.maxLength(10)]],
                        fundingRequiredforVAS: [(this.view == false) ? '': null,[Validators.required]],
                      })
                   
                    }),
                    fastTag: this.fb.group({
                      EquitasFASTagRequired: [(this.view == false) ? this.FASTagReqLOV[0].key : null,[Validators.required]],
                      FASTagAmount: [(this.view == false) ? '' : null, [Validators.required,Validators.maxLength(10)]],
                      fundingRequiredforFASTag: [(this.view == false) ? this.tempDataFundingRequiredLOV[0].key : null,[Validators.required]],
                      //LoanAmountincludingCrossSell: [{ value: '', disabled: true }],
                    }),
                    loanBookingDetails: this.fb.group({
                      LoanAmountincludingCrossSell: [{ value: (this.view == false)?(this.AssetDetailsList[i].EligibleLoanAmnt):'', disabled: true },[Validators.required]],
                      //LoanAmountincludingCrossSellsubtractSubvent: [{ value: (this.view == false) ? (this.setcrossSubventAmount(i)):'', disabled: true }],
                      LoanAmountincludingCrossSellsubtractSubvent: [{ value: (this.view == false) ? '':'', disabled: true }],
                      MoratoriumPeriod: [(this.AssetDetailsList[i].subventionMoratoriumDays) ? {value:this.AssetDetailsList[i].subventionMoratoriumDays,disabled:true} : '1MORDAY',[Validators.required]],
                      NoofRepayableMonthsafterMoratorium: [{value:(!((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='I') || (this.AssetDetailsList[i].schemeType=='SI'))?((tenorReq) ? this.createNegotiationForm.controls.reqLoanTenor.value:eliTenorMax) : this.AssetDetailsList[i].subventionTenure),disabled: true},[Validators.required]],
                      EMIStartDateAfterDisbursement: [ '',[Validators.required] ],
                      PaymentModeforGapDaysInterest: ['',[Validators.required]],
                      repaymentFrequency: [((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='I') || (this.AssetDetailsList[i].schemeType=='SI')) ? {value:'1LOSREPAYFRE',disabled:true} : !(this.LeadReferenceDetails[0].ProductCode == 'UTCR' || this.LeadReferenceDetails[0].ProductCode == 'NTCR') ? {value:'1LOSREPAYFRE',disabled:true} : {value:'1LOSREPAYFRE',disabled:false},[Validators.required] ],
                      SelectAppropriateLMSScheduleCode: [{value:'',disabled:false},[Validators.required]],
                      EMIStructure: [{ value: (this.view == false)?'1EMISTRUCT':'', disabled: (this.view == false)?(((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='I') || (this.AssetDetailsList[i].schemeType=='SI'))?true:false):false},[Validators.required]],
                      //loanBookingEMI: [{value: '',disabled: (this.view == false)?((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='SI'))?true:false:false}],
                      loanBookingEMI: [{value: '',disabled: true}],
                      emiDefaultValue:['']
                      //emiDefaultValue:[{value:(this.view ==false)?this.defaultIndexEmiValue(i):0,disabled:true}]
                    }),
                    loanAmountBreakup : this.fb.group({
                      finalAssetCost: [{ value: '', disabled: true }],
                      NegotiatedLoanAmount: [{ value: (this.view == false)?(this.AssetDetailsList[i].EligibleLoanAmnt):'', disabled: true }],
                      LoanAmountincludingCrossSell: [{ value: (this.view == false)?(this.AssetDetailsList[i].EligibleLoanAmnt):'', disabled: true }],
                      LoanAmountincludingCrossSellsubtractSubvent: [{ value: (this.view == false) ? '':'', disabled: true }],
                      finalLTV: [{ value: '', disabled: true }],
                      finalLTVwithoutcrs: [{ value: '', disabled: true }],
                      MIPremiumAmount: [{ value: '', disabled: true }],
                      PACPremiumAmount: [{ value: '', disabled: true }],
                      VASPremiumAmount: [{ value: '', disabled: true }],
                      lifeCoverPremiumAmount: [{ value: '', disabled: true }],
                      FASTagAmount: [{ value: '', disabled: true }],
                      charges: [{ value: '', disabled: true }], 
                      gapDaysInterest: [{ value: '', disabled: true }], 
                    })
                  }));

                  if (this.roleType === 5 || this.roleType === 4) {
                    this.t.disable()
                  }
                  
                  if(this.view == false){
                    if(this.AssetDetailsList[i].mi_ins_prov){
                      this.setCrosSell(i,this.AssetDetailsList[i].mi_ins_prov)
                    }
                    this.AssetDetailsList[i].subventionMoratoriumDays ? (this.getEMIDate(i,this.AssetDetailsList[i].subventionMoratoriumDays)) : this.getEMIDate(i,1);
                    this.setcrossSubventAmount(i)
                    this.finalAssetCal(i);
                    this.fetchLoanBreakValues(i)
                    this.getNetDisbursementAmount(i);
                    this.loanBookingEmi(i);
                    this.defaultIndexEmiValue(i);
                    this.calculateVarianceIRR(i)
                  }
                  if(this.showInsuranceFields && (this.AssetDetailsList[i].IsORPFunding ==  '1')){
                    this.clearValidationORP(i);
                  }
                  
                  if(!((this.AssetDetailsList[i].schemeType=='S') || (this.AssetDetailsList[i].schemeType=='SI'))){
                    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValidators([Validators.required]);
                  }
                  let deferralDate :any = this.utilityService.getDateFormat(this.deferralDate);
                  deferralDate = this.utilityService.getDateFromString(deferralDate)
                  this.createNegotiationForm.get('tickets')['controls'][i]['controls'].approvalForm.patchValue({
                    approvedBy: this.approvedBy ? this.approvedBy.name + ' - ' + this.approvedBy.userId : '',
                    approvalStatus: this.statusApproval ? this.statusApproval.id : '',
                    deferralDate: this.deferralDate ? deferralDate : ''
                  });
                  if(this.isAlreadyApproved) {
                  this.createNegotiationForm.get('tickets')['controls'][i]['controls'].repaymentmodeArray.disable();
                  }
                  console.log('approvedBy', this.createNegotiationForm.get('tickets')['controls'][i]['controls'].approvalForm.value);
                  
                  
                  console.log('deferralDate', this.utilityService.getDateFormat(this.deferralDate), this.deferralDate, this.utilityService.getDateFormat(this.deferralDate));
                  

                  console.log(this.createNegotiationForm.get('tickets')['controls'][i], 'createNegotiationForm', this.approvedBy)

                  if (this.roleType === 5 || this.roleType === 4) {
                    this.t.disable()
                  }

            }
          }
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
        if (this.isLoan360) {
          this.createNegotiationForm.disable();
        }
      });
    //  this.getNetDisbursementAmount(i);
  }
  get f() { return this.createNegotiationForm.controls; }
  get t() { return this.f.tickets as FormArray; }
  get deductChargesArray() { return this.f.tickets1 as FormArray; }
  //get tempDeductionDetails() { return this.t as FormArray; }
  get applicant1() { return this.f.coapplicant as FormArray; }
  get guarantor1() { return this.f.guarantorvalue as FormArray; }
  
clearValidationORP(i){
  let a = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'];
  let b = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup;

  
  a.motor['controls'].MIPremiumAmount.setValue(null);
  a.motor['controls'].MIPremiumAmount.setErrors(null);
  a.motor['controls'].MITenure.setErrors(null);
  a.motor['controls'].fundingRequiredforMI.setErrors(null);
  a.motor['controls'].motorInsurance.setErrors(null);
  
  
  a.pac['controls'].PACPremiumAmount.setValue(null);
  a.pac['controls'].PACPremiumAmount.setErrors(null);
  a.pac['controls'].creditShieldPAC.setErrors(null);
  a.pac['controls'].fundingRequiredforPAC.setErrors(null);

  
  a.vas['controls'].VASPremiumAmount.setValue(null);
  a.vas['controls'].VAS.setErrors(null);
  a.vas['controls'].VASPremiumAmount.setErrors(null);
  a.vas['controls'].fundingRequiredforVAS.setErrors(null);
  
  a.life['controls'].lifeCoverPremiumAmount.setValue(null);
  a.life['controls'].creditShieldLifeCover.setErrors(null);
  a.life['controls'].fundingRequiredforlifeCover.setErrors(null);
  a.life['controls'].fundingforLifeCover.setErrors(null);
  a.life['controls'].lifeCoverPremiumAmount.setErrors(null);

  b['controls'].MIPremiumAmount.setValue(null);
  b['controls'].VASPremiumAmount.setValue(null);
  b['controls'].PACPremiumAmount.setValue(null);
  b['controls'].lifeCoverPremiumAmount.setValue(null);

}
setCrosSell(i,val){
  const setVal = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']
  if(val == 4){
    var fundVal = '3FNDREQ';
    var prmAmount = '0';
    this.showapplicable = true;
    setVal.motor['controls'].MIPremiumAmount.disable();
    setVal.motor['controls'].fundingRequiredforMI.disable();
    setVal.pac['controls'].creditShieldPAC.disable();
    setVal.pac['controls'].PACPremiumAmount.disable();
    setVal.pac['controls'].fundingRequiredforPAC.disable();
    setVal.vas['controls'].VAS.disable();
    setVal.vas['controls'].VASPremiumAmount.disable();
    setVal.vas['controls'].fundingRequiredforVAS.disable();
  }else if(val == '' || val == null || val == undefined) {
    this.showapplicable = false;
    var fundVal = '';
    var prmAmount = '0';
  } else {
    this.showapplicable = false;
    var fundVal = '1FNDREQ';
    var prmAmount = '';
  }

  setVal['motor']['controls'].MIPremiumAmount.setValue(prmAmount)
  setVal['motor']['controls'].fundingRequiredforMI.setValue(fundVal)
  setVal['pac']['controls'].creditShieldPAC.setValue(val)
  setVal['pac']['controls'].PACPremiumAmount.setValue(prmAmount)
  setVal['pac']['controls'].fundingRequiredforPAC.setValue(fundVal)
  setVal['vas']['controls'].VAS.setValue(val)
  setVal['vas']['controls'].VASPremiumAmount.setValue(prmAmount)
  setVal['vas']['controls'].fundingRequiredforVAS.setValue(fundVal)
  





}
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((value) => {
        //console.log('params', value)
      })
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = value.leadId;
        }
        resolve(null);
      });
    });
  }
  setcrossSubventAmount(i){
    //let subventAmount = (Number(this.AssetDetailsList[i].EligibleLoanAmnt) - (this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventAmount']['value'] ? Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventAmount']['value']) : 0))
    let subventAmount = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventAmount']['value']);
    this.loanBookingSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails;
    this.loanBreakupSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup;
    let loanAccrossSubAmount = Number(this.loanBookingSelected['controls'].LoanAmountincludingCrossSell.value) - Number(subventAmount)
    this.loanBookingSelected['controls'].LoanAmountincludingCrossSellsubtractSubvent.setValue(loanAccrossSubAmount);
    this.loanBreakupSelected['controls'].LoanAmountincludingCrossSellsubtractSubvent.setValue(loanAccrossSubAmount);
  }
  allowValuesforNegoIRR(event, i) {
    let negoIRRValue:any = event.target.value?Number(event.target.value):'';
    let baseInterestRate = parseFloat(this.baseInterest).toFixed(2);
    let rateMin = this.minInterest?Number(this.minInterest):null;
    let rateMax = this.maxInterest?Number(this.maxInterest):null;
    let baseIntRateMin = Number(baseInterestRate) + rateMin;
    let baseIntRateMax = Number(baseInterestRate) + rateMax;
  

    if(!(negoIRRValue>=baseIntRateMin && negoIRRValue<=baseIntRateMax)){
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].value ?
        // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValue(Math.round(this.AssetDetailsList[i].EligibleIRRMin)) : null;
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValue(this.AssetDetailsList[i].EligibleIRRMin) : null;
        this.varErrToaster=false;
        this.toasterService.showError(
            'IRR configured for this product is' + (baseIntRateMin) + ' and ' + (baseIntRateMax) + '.',
            'Create Negotiation'
          );
        
           //newly Added
           this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].value ?
           this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].setValue(null) : null;
           this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].value ?
           this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].setValue(null) : null;  
    }
  }

  calculateVarianceIRR(i){
    let iRRValue:any ='';
    let baseInterestRate = parseFloat(this.baseInterest).toFixed(2);
    let rateMin = this.minInterest?Number(this.minInterest):null;
    let rateMax = this.maxInterest?Number(this.maxInterest):null;
    if((this.AssetDetailsList[i].schemeType =='S') || (this.AssetDetailsList[i].schemeType =='I') || (this.AssetDetailsList[i].schemeType =='SI')){
      iRRValue=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].value;
    }else{
      iRRValue=this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].value;        
    }

    this.varianceIRR = (parseFloat(iRRValue) - parseFloat(this.baseInterest)).toFixed(2);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['variableIRR'].setValue(this.varianceIRR);


    if ((Number(this.varianceIRR) > rateMax || Number(this.varianceIRR) < rateMin)) {
        if((this.AssetDetailsList[i].schemeType =='S') || (this.AssetDetailsList[i].schemeType =='I') || (this.AssetDetailsList[i].schemeType =='SI')){
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].setValue(this.AssetDetailsList[i].subventionIRR);
         //newly Added
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].value ?
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].setValue(null) : null;
        }else{
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValue(this.AssetDetailsList[i].EligibleIRRMin); 
         //newly Added
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].value ?
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['loanBookingEMI'].setValue(null) : null
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].value ?
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].setValue(null) : null;      
        }
        if(this.varErrToaster){
          this.toasterService.showError(
            'IRR should be between ' + (rateMin + Number(baseInterestRate)) + ' and ' + (rateMax + Number(baseInterestRate)) + '.',
            'Create Negotiation'        
          );
        }
      
    }else{
      
      if((this.AssetDetailsList[i].schemeType =='S') || (this.AssetDetailsList[i].schemeType =='I') || (this.AssetDetailsList[i].schemeType =='SI')){
        //this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].setValue(Math.round(iRRValue))
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].setValue(iRRValue)
        this.loanBookingEmi(i);
      }else{
        //this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValue(Math.round(iRRValue))
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValue(iRRValue)
        this.calculateEMI(i);
        this.loanBookingEmi(i);//need to calcula
      }
    }
    this.varErrToaster = true;
  }

  allowValuesforNegoEMI(event, i,accVal) {
    if(accVal==1){
      let negoEMIValue:any = event.target.value?Number(event.target.value):'';  
      let amtMinInstal=this.productLoanDetails.amtMinInstal?Number(this.productLoanDetails.amtMinInstal):null;
      let amtMaxInstal=this.productLoanDetails.amtMaxInstal?Number(this.productLoanDetails.amtMaxInstal):null;
  
       if(!(negoEMIValue>=amtMinInstal && negoEMIValue<=amtMaxInstal)){
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].value ?
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedEMI'].setValue(null) : null;
        this.toasterService.showError(
              'EMI configured for this product is ' + (amtMinInstal) + ' and ' + (amtMaxInstal) + '.',
              'Create Negotiation'
            );
        }
    }
    
      //Remove this once auto IRR validation done
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].value ?
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedIRR'].setValue(null) : null;
  
  }
  
  calculateSubventionVarianceIRR(event, i) { //newly Added to get Variance details
    let subventionSchemeIRR:any = event.target.value?Number(event.target.value):'';
    let baseInterestRate = parseFloat(this.baseInterest).toFixed(2);
    let rateMin = this.minInterest?Number(this.minInterest):null;
    let rateMax = this.maxInterest?Number(this.maxInterest):null;
  
    this.varianceIRR = (parseFloat(subventionSchemeIRR) - parseFloat(this.baseInterest)).toFixed(2);
    if ((this.varianceIRR > rateMax || this.varianceIRR < rateMin)) {
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].setValue(null)
      this.toasterService.showError(
        'IRR should be between ' + (rateMin + baseInterestRate) + ' and ' + (rateMax + baseInterestRate) + '.',
        'Create Negotiation'
        
      );
    }else{
      // this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].setValue(Math.round(subventionSchemeIRR))
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['subventionSchemeIRR'].setValue(subventionSchemeIRR)
      this.loanBookingEmi(i);
    }
  }
  allowvaluesforNegoAmount(event,i) { //nego Enhance

    
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['NegotiatedLoanAmount'].patchValue(Math.round(event.target.value))
    let amountMinLoan=this.productLoanDetails.amtMinLoan?Number(this.productLoanDetails.amtMinLoan):null;
    let amountMaxLoan=this.productLoanDetails.amtMaxLoan?Number(this.productLoanDetails.amtMaxLoan):null;
    let enteredValue=event.target.value?Number(event.target.value):null;
    let FinalAssetCost=this.AssetDetailsList[i].FinalAssetCost?Number(this.AssetDetailsList[i].FinalAssetCost):null;
    if(enteredValue<Number(this.AssetDetailsList[i].EligibleLoanAmnt)){ //entered value lesser than loan amnt
      if(enteredValue<amountMinLoan){ // entered value should not be lesser than Amnt Min Loan
        this.toasterService.showError(
          'Negotiated Loan Amount cannot be less than Minimum amount configured for the product',''
        );
        this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].setValue(Math.round(this.AssetDetailsList[i].EligibleLoanAmnt))
      }else{
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['NegotiatedLoanAmount'].patchValue(Math.round(event.target.value))
      }
    }else{
      if(this.isSecured){
        if((enteredValue>FinalAssetCost) || (enteredValue>amountMaxLoan)){
          this.toasterService.showError(
            'Negotiated Loan Amount can neither be greater than 100% of Net Asset Cost nor be greater than Maximum amount configured for the product',''
          );
          this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].setValue(Math.round(this.AssetDetailsList[i].EligibleLoanAmnt))
        }else{
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['NegotiatedLoanAmount'].patchValue(Math.round(event.target.value))
        }
      }else{
        let netAssetCost=FinalAssetCost?FinalAssetCost * 2 :null;
        if((enteredValue>netAssetCost) || (enteredValue>amountMaxLoan)){
          this.toasterService.showError(
            'Negotiated Loan Amount can neither be greater than 200% of Net Asset Cost nor be greater than Maximum amount configured for the product',''
          );
          this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].setValue(Math.round(this.AssetDetailsList[i].EligibleLoanAmnt))
        }else{
          this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['NegotiatedLoanAmount'].patchValue(Math.round(event.target.value))
        }
      }
    }

    this.mockIndex=i;
    let loanBookingValues = this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls'];
    let emiStruVal=loanBookingValues['EMIStructure']['value'];
        emiStruVal=emiStruVal?((emiStruVal=='1EMISTRUCT')?emiStruVal:loanBookingValues['EMIStructure'].setValue('')):emiStruVal;
        loanBookingValues['emiDefaultValue'].setValue('');
        if(emiStruVal && emiStruVal!='1EMISTRUCT'){
        this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm'].get('variableFormArray').controls=[];
        this.formArr.push(this.initRowsDefault(i,false));
        this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
       }
    this.subventionValidations(i,true,1);
    this.subventionValidations(i,true,2);
    this.subventionValidations(i,true,3);
  }
  formatDate = (dateObj) => {
    dateObj = new Date(dateObj);
    return (dateObj) ? dateObj.getFullYear() + '-' + ("0" + (dateObj.getMonth() + 1)).slice(-2) + '-' + ("0" + dateObj.getDate()).slice(-2) : '';
  }

  onSubmit() {
    
    // this.getLeadId();
    this.isDirty = true;
    this.onformsubmit = true;
    for(let i=0; i< this.createNegotiationForm.get('tickets')['controls'].length;i++){
      if(!((this.AssetDetailsList[i].schemeType =='S') || (this.AssetDetailsList[i].schemeType =='I') || (this.AssetDetailsList[i].schemeType =='SI'))){
        //variable Btton Validation     
        let mockArray = this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls
        let getVal=this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls']['EMIStructure'].value
        if(getVal!='1EMISTRUCT' && mockArray.length==0){
          this.toasterService.showError("Kindly Click Validate button to get Mock Schedule in Asset Details" , '');
          return;
        }

        if ((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].value.toString().indexOf('-') != -1) ||
        (this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NetDisbursementAmount'].value.toString().indexOf('-') != -1)) {
        this.toasterService.showError("Amount Field should not be Negative for " + '' + " Asset Details -" +''+ (i+1), ''),
          this.onformsubmit = false;
          return;
        }
        
        else if(Number((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].value) < Number(this.minLoanAmount)) ||
        Number((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].value) > Number(this.maxLoanAmount))) {
          this.toasterService.showError("Negotiated Loan Amount should be within" + ' ' + this.minLoanAmount + ' ' +
          'and' + ' ' + this.maxLoanAmount + ''+ " Asset Details -" +''+ (i+1), ''),
          this.onformsubmit = false;
          return;
        }
        else if(Number((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanTenor'].value) < Number(this.minLoanTenor)) ||
        Number((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanTenor'].value) > Number(this.maxLoanTenor))){
          this.toasterService.showError("Negotiated Loan Tenor should be within" + ' ' + this.minLoanTenor + ' ' +
          'and' + ' ' + this.maxLoanTenor + ''+ " Asset Details -" +''+ (i+1), ''),
          this.onformsubmit = false;
          return;
        }
        else if(Number((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedEMI'].value) < Number(this.minEMIAmount)) ||
        Number((this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedEMI'].value) > Number(this.maxEMIAmount))){
          this.toasterService.showError("Negotiated EMI should be within" + ' ' + this.minEMIAmount + ' ' +
          'and' + ' ' + this.maxEMIAmount + ''+ " Asset Details -" +''+ (i+1), ''),
          this.onformsubmit = false;
          return;
        }
      }
      if(this.showInsuranceFields && (this.AssetDetailsList[i].IsORPFunding ==  '1')){
          this.clearValidationORP(i);
        }
    }
    // if (this.onformsubmit == true && this.createNegotiationForm.valid === true)
    if (this.onformsubmit == true && this.createNegotiationForm.valid === true) {
    this.getLeadId();
    const formData = this.createNegotiationForm.getRawValue();
    //console.log('Savedata',formData);
      if(this.onApproveOrSave != 'approval' && this.isPredDone == 'true') {
        this.onApprovePdcSpdc();
      }
    
    this.Applicants = [];
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
    this.CrossSellInsurance = [];
    this.CrossSellOthers = [];
    var array1 = [];
    var data = {};
    var data1 = {};
    this.finalAsset = [];
    const crossSellIns = formData.tickets.forEach((ticket, index) => {     
      var DeductionsData = [];
            if(formData.tickets[index].DeductionChargefixedRate.length > 0){
              Object.keys(formData.tickets[index].DeductionChargefixedRate).forEach(key => {
                const i = {};
                var DDRatio ='';
                var object ={}; 
                if(this.NegotiationId){
                  if (this.DeductionDetails[key].charge_type == 'P') {
                      this.DeductionDetails[key].charge_ratio = ((Number(ticket.DeductionChargefixedRate[key].DeductionChargefixedRate)) / (Number(this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['negotiationformArray']['controls'].NegotiatedLoanAmount.value))) * 100;
                      DDRatio = parseFloat(this.DeductionDetails[key].charge_ratio).toFixed(2)
                    }
                    if (this.DeductionDetails[key].charge_code == "710") {
                      this.processingFee = Number(ticket.DeductionChargefixedRate[key].DeductionChargefixedRate);
                      this.createNegotiationForm.get('tickets')['controls'][index]['controls'].processingFee.patchValue(this.processingFee);
                    } else {
                      this.serviceCharge += Number(ticket.DeductionChargefixedRate[key].DeductionChargefixedRate);
                      this.createNegotiationForm.get('tickets')['controls'][index]['controls'].serviceCharge.patchValue(this.serviceCharge);
                    }
                   object = {
                    charge_code: this.DeductionDetails[key].charge_code,
                    charge_type: this.DeductionDetails[key].charge_type,
                    charge_amount: ticket.DeductionChargefixedRate[key].DeductionChargefixedRate.toString(),
                    charge_ratio: DDRatio ? DDRatio.toString() : "0",
                    charge_name: this.DeductionDetails[key].charge_name,
                  }
                }else{
                  if (this.DeductionDetails[key].DeductionChargeType == 'P') {
                    this.DeductionDetails[key].DeductionChargeRatio = ((Number(ticket.DeductionChargefixedRate[key].DeductionChargefixedRate)) / (Number(this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['negotiationformArray']['controls'].NegotiatedLoanAmount.value))) * 100;
                    DDRatio = parseFloat(this.DeductionDetails[key].DeductionChargeRatio).toFixed(2);
                  }
                  if (this.DeductionDetails[key].DeductionChargeCode == "710") {
                    this.processingFee = Number(ticket.DeductionChargefixedRate[key].DeductionChargefixedRate);
                    this.createNegotiationForm.get('tickets')['controls'][index]['controls'].processingFee.patchValue(this.processingFee);
                  } else {
                    this.serviceCharge += Number(ticket.DeductionChargefixedRate[key].DeductionChargefixedRate);
                    this.createNegotiationForm.get('tickets')['controls'][index]['controls'].serviceCharge.patchValue(this.serviceCharge);
                  }

                   object = {
                    charge_code: this.DeductionDetails[key].DeductionChargeCode,
                    charge_type: this.DeductionDetails[key].DeductionChargeType,
                    charge_amount: ticket.DeductionChargefixedRate[key].DeductionChargefixedRate.toString(),
                    charge_ratio: DDRatio ? DDRatio.toString() : "0",
                    charge_name: this.DeductionDetails[key].DeductionChargeName,
                  }
                }
                
                DeductionsData.push(object);
              })
            }  
        var obj1 = {
          collateral_id: this.AssetDetailsList[index].CollateralId ? this.AssetDetailsList[index].CollateralId : "",
          lms_collateral_id: this.AssetDetailsList[index].LMSCollaterId ? this.AssetDetailsList[index].LMSCollaterId : "",
          unique_sub_lead_reference_id: this.AssetDetailsList[index].UniqueSubLeadRefId ? this.AssetDetailsList[index].UniqueSubLeadRefId : "",
          scheme_type :  this.AssetDetailsList[index].schemeType,
          //negotiated_loan_amount: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].value,
          //loan_amount_to_be_booked: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].value,
          total_insurance_premium_amount: this.createNegotiationForm.get('tickets')['controls'][index]['controls'].PremiumAmntSum.value,
          total_other_cross_sell_amount: this.createNegotiationForm.get('tickets')['controls'][index]['controls'].fastTagAmtSum.value,
          promotion_scheme: this.AssetDetailsList[index].PromotionScheme ? this.AssetDetailsList[index].PromotionScheme : '',

          // negotiated_irr: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['NegotiatedEMI'].value,
          // negotiated_emi: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['NegotiatedIRR'].value,
          // moratorium_days: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['loanBookingDetails']['controls']['MoratoriumPeriod'].value,
          // negotiated_tenor_months: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['NegotiatedLoanTenor'].value,
          // emi_cycle_day: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['loanBookingDetails']['controls']['EMIStartDateAfterDisbursement'].value,
          // gap_days_payment_mode: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['loanBookingDetails']['controls']['PaymentModeforGapDaysInterest'].value,
          //lms_schedule_code: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['SelectAppropriateLMSScheduleCode'].value,
          // mor_repay_month: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['NoofRepayableMonthsafterMoratorium'].value,
          // emi_cycle_start: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['negotiationformArray']['controls']['EMIStartDateAfterDisbursement'].value,
          cross_sell_ins: [],
          cross_sell_others: {},
          loan_booking_dtls:{},
          variable_emi_grid:[],
          negotiation_dtls:{},
          mock_schedule:[],
          repayment_dtls:{},
          processingFee: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['processingFee'].value ? this.createNegotiationForm.get('tickets')['controls'][index]['controls']['processingFee'].value : '',
          serviceCharge: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['serviceCharge'].value ? this.createNegotiationForm.get('tickets')['controls'][index]['controls']['serviceCharge'].value : '',
          // variance: this.varianceIRR,
          //repaymentMode: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['repaymentmodeArray']['controls']['repaymentMode'].value,
          //NoofPDC: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['repaymentmodeArray']['controls']['NoofPDC'].value,
          //NoofSPDC: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['repaymentmodeArray']['controls']['NoofSPDC'].value,
          deductions:[]
          //deductions: this.createNegotiationForm.get('tickets')['controls'][index]['controls']['DeductionChargefixedRate'],
        }
      var array = [];
      Object.keys(ticket.CrossSellInsurance).forEach(key => {
        const i = {};
        if(this.showInsuranceFields && (this.AssetDetailsList[index].IsORPFunding ==  '1')){
          var object = {
            insurance_code: null,
            fndreinsurance_code: null,
            premium_amount: null,
            insslab: null,
            mi_tenure: null,
          }
        } else {
          var object = {
            insurance_code: ticket.CrossSellInsurance[key].motorInsurance || ticket.CrossSellInsurance[key].creditShieldPAC || ticket.CrossSellInsurance[key].creditShieldLifeCover || ticket.CrossSellInsurance[key].VAS,
            fndreinsurance_code: ticket.CrossSellInsurance[key].fundingRequiredforMI || ticket.CrossSellInsurance[key].fundingRequiredforPAC || ticket.CrossSellInsurance[key].fundingRequiredforVAS || ticket.CrossSellInsurance[key].fundingRequiredforlifeCover,
            premium_amount: ticket.CrossSellInsurance[key].MIPremiumAmount || ticket.CrossSellInsurance[key].PACPremiumAmount || ticket.CrossSellInsurance[key].lifeCoverPremiumAmount || ticket.CrossSellInsurance[key].VASPremiumAmount,
            insslab: ticket.CrossSellInsurance[key].fundingforLifeCover,
            mi_tenure: ticket.CrossSellInsurance[key].MITenure,
          }
        }
        array.push(object);
      })
      const fasttagValue = {
        cross_sell_type: ticket.fastTag.EquitasFASTagRequired,
        fndreq: ticket.fastTag.fundingRequiredforFASTag,
        amount: ticket.fastTag.FASTagAmount,
        loan_amnt_incl_cross_sel: ticket.loanBookingDetails.LoanAmountincludingCrossSell
      }
      const loanBookDetails = {
        loan_amount_incl_cross_sell: ticket.loanBookingDetails.LoanAmountincludingCrossSell,
            loan_amount_incl_cross_sell_subtract_subvention: (ticket.loanBookingDetails.LoanAmountincludingCrossSellsubtractSubvent) ? ticket.loanBookingDetails.LoanAmountincludingCrossSellsubtractSubvent.toString() : '',
            moratorium_days: ticket.loanBookingDetails.MoratoriumPeriod,
            mor_repay_month: ticket.loanBookingDetails.NoofRepayableMonthsafterMoratorium,
            emi_start_date: ticket.loanBookingDetails.EMIStartDateAfterDisbursement,
            gap_days_payment_mode: ticket.loanBookingDetails.PaymentModeforGapDaysInterest,
            repayment_frequency: ticket.loanBookingDetails.repaymentFrequency,
            lms_schedule_code: ticket.loanBookingDetails.SelectAppropriateLMSScheduleCode,
            emi_structure: ticket.loanBookingDetails.EMIStructure,
            emi_default_value: ticket.loanBookingDetails.emiDefaultValue,
            //is_variable_emi: ticket.loanBookingDetails.loanBookingEMI,
            
            emi_after_crossell: ticket.loanBookingDetails.loanBookingEMI,
            final_ltv: ticket.loanAmountBreakup.finalLTV,
            final_ltv_without_crossell: ticket.loanAmountBreakup.finalLTVwithoutcrs,
            final_asset_cost: ticket.loanAmountBreakup.finalAssetCost,
            total_charges: ticket.loanAmountBreakup.charges,
            gap_days_interest: ticket.loanAmountBreakup.gapDaysInterest,
            net_disbursement_amount:ticket.negotiationformArray.NetDisbursementAmount
      }
      var variableGrid = [];
      Object.keys(ticket.variableForm.variableFormArray).forEach(key => {
        const i = {};
        var object = {
          from_month: ticket.variableForm.variableFormArray[key].fromMonth,
          to_month: ticket.variableForm.variableFormArray[key].toMonth,
          installment_Percentage: ticket.variableForm.variableFormArray[key].installmentPercent,          
          emi_amount: ticket.variableForm.variableFormArray[key].emiAmount
        }
        variableGrid.push(object);
      })
      
      const negotiationDetailsData = {
            loan_amount_to_be_booked: ticket.negotiationformArray.NegotiatedLoanAmount,
            negotiated_loan_amount: ticket.negotiationformArray.NegotiatedLoanAmount,
            negotiated_tenor_months: ticket.negotiationformArray.NegotiatedLoanTenor,
            negotiated_irr: ticket.negotiationformArray.NegotiatedIRR,
            variance  : ticket.negotiationformArray.variableIRR,
            negotiated_emi: (ticket.negotiationformArray.NegotiatedEMI) ? ticket.negotiationformArray.NegotiatedEMI.toString() : '',
            subvention_loan_tenor_months: ticket.negotiationformArray.subventSchemeLoanTenor,
            subvention_irr: ticket.negotiationformArray.subventionSchemeIRR,
            subvention_emi: (ticket.negotiationformArray.subventSchemeEMI) ? ticket.negotiationformArray.subventSchemeEMI.toString() : '',
            subvention_amount: (ticket.negotiationformArray.subventAmount) ? ticket.negotiationformArray.subventAmount.toString() : '',
            incentive_amount: (ticket.negotiationformArray.incentiveAmount) ? ticket.negotiationformArray.incentiveAmount.toString() : ''
      }
      // if (this.NegotiationId) {
      //   var DeductionsData = [];
      //   const deductions = formData.tickets[index].DeductionChargefixedRate.forEach((ticket,key) => {
      //     if (this.DeductionDetails[key].charge_type == 'P') {
      //       this.CombinedLoan.DeductionChargefixedRate[key].charge_ratio = ((Number(ticket.DeductionChargefixedRate)) / (Number(this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['negotiationformArray']['controls'].NegotiatedLoanAmount.value))) * 100;
      //     }
      //     if (this.CombinedLoan.DeductionChargefixedRate[key].charge_code == "710") {
      //       this.processingFee = Number(ticket.DeductionChargefixedRate);
      //     } else {
      //       this.serviceCharge += Number(ticket.DeductionChargefixedRate);
      //     }
      //     var obj = {
      //       charge_code: this.CombinedLoan.DeductionChargefixedRate[key].charge_code,
      //       charge_type: this.CombinedLoan.DeductionChargefixedRate[key].charge_type,
      //       charge_amount: ticket.DeductionChargefixedRate.DeductionChargefixedRate,
      //       charge_ratio: this.CombinedLoan.DeductionChargefixedRate[key].charge_ratio ? this.CombinedLoan.DeductionChargefixedRate[key].charge_ratio.toString() : "0",
      //       charge_name: this.CombinedLoan.DeductionChargefixedRate[key].charge_name,
      //     }
      //     DeductionsData.push(obj);
      //   });
      // }

        

      var mockSheduleData = [];
      if(ticket.mockSchForm.mockSchFormArray.length > 0){
        Object.keys(ticket.mockSchForm.mockSchFormArray).forEach(key => {
          const i = {};
          var object = {
                  installment_no: ticket.mockSchForm.mockSchFormArray[key].installmentCounter,
                  due_date: ticket.mockSchForm.mockSchFormArray[key].installmentDate,
                  total_installment_amount: ticket.mockSchForm.mockSchFormArray[key].totalInstallmentAmount,
                  principal_amount: ticket.mockSchForm.mockSchFormArray[key].principalAmount,
                  interest_amount: ticket.mockSchForm.mockSchFormArray[key].interestAmount,
                  principal_outstanding_amount: ticket.mockSchForm.mockSchFormArray[key].principalBalanceAmount
          }
          mockSheduleData.push(object);
        })
      }

      const repaymentDetails = {
        repayment_mode: ticket.repaymentmodeArray.repaymentMode,
        no_of_pdc: ticket.repaymentmodeArray.NoofPDC,
        no_of_spdc: ticket.repaymentmodeArray.NoofSPDC,
        collected_no_of_pdc: ticket.repaymentmodeArray.collectedNoofPDC,
        collected_no_of_spdc: ticket.repaymentmodeArray.collectedNoofSPDC
      }

      
        obj1.cross_sell_others = fasttagValue;
        obj1.cross_sell_ins = array;
        obj1.loan_booking_dtls = loanBookDetails;
        obj1.variable_emi_grid = variableGrid;
        obj1.negotiation_dtls = negotiationDetailsData;
        obj1.deductions = DeductionsData;
        obj1.mock_schedule = mockSheduleData;
        obj1.repayment_dtls = repaymentDetails;
        this.Asset[index] = obj1;
      this.Asset[index].cross_sell_others = fasttagValue;
      this.Asset[index].cross_sell_ins = array;
      this.Asset[index].loan_booking_dtls = loanBookDetails;
      this.Asset[index].variable_emi_grid = variableGrid;
      this.Asset[index].negotiation_dtls = negotiationDetailsData;
      this.Asset[index].deductions = DeductionsData;
      this.Asset[index].mock_schedule = mockSheduleData;
      this.Asset[index].repayment_dtls = repaymentDetails;
      this.finalAsset.push(this.Asset[index])
    });
    const NegotiationDetails = {
      "CombinedLoanJson":"{}",
      "LeadID": this.leadId,
      "NegotiationID": this.NegotiationId,
      "ApplicantJson": JSON.stringify(this.Applicants),
      //"CombinedLoanJson": (this.selectNegotiation == 1) ? JSON.stringify(this.CombinedLoan) : JSON.stringify([]),
      "AssetsJson": JSON.stringify(this.finalAsset),
      "IsCombinedLoan": "N"
    }
    //console.log("hiii", this.createNegotiationForm)
    //console.log("saveObject-->",NegotiationDetails)
    //console.log("fromSubmitVali", this.onformsubmit)
    //console.log("Negoform-->",this.createNegotiationForm.valid)
    //console.log("appJson-->",JSON.stringify(this.Applicants));
    //console.log('assenJson-->',JSON.stringify(this.finalAsset));


    this.NegotiationService
      .submitNegotiation(NegotiationDetails
      )
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.NegotiationId = res.ProcessVariables.NegotiationDetails.NegotiationID;
          this.fetchAssetsJson = JSON.parse(res.ProcessVariables.NegotiationDetails.AssetsJson);
          const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
          this.DeductionDetails = this.fetchAssetsJson[index].deductions;
              for (let i = this.deductChargesArray.length; i < this.DeductionDetails.length; i++) {
                this.deductionLabel[i] = this.DeductionDetails[i].charge_name;
                this.deductChargesArray.push(this.fb.group({
                  DeductionChargefixedRate: this.DeductionDetails[i].charge_amount,
                }));
                
              };
})
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
    // this.createNegotiationForm.controls.EMIStartDateAfterDisbursement.setValue(null);
    this.createNegotiationForm.controls.PaymentModeforGapDaysInterest.setValue(null);
    this.createNegotiationForm.controls.SelectAppropriateLMSScheduleCode.setValue(null);
  }
  fetchValue() {
    this.isDirty = false;
    this.NegotiationService
      .viewNegotiationData(this.leadId).subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.NegotiationId = res.ProcessVariables.NegotiationDetails.NegotiationID;
          //this.combinedLoanvalue = res.ProcessVariables.NegotiationDetails.IsCombinedLoan;
          this.combinedLoanvalue = 'N';
          if (this.combinedLoanvalue == 'N') {
            this.isCombinedLoan = false;
          }
          else
            this.isCombinedLoan = true;
          if (this.isCombinedLoan == true) {
            this.CombinedLoan = JSON.parse(res.ProcessVariables.NegotiationDetails.CombinedLoanJson);

            //console.log('fetchValueCombinedLoan--->',this.CombinedLoan);

            // this.createNegotiationForm.patchValue({
            //   NegotiatedIRR: this.CombinedLoan.negotiated_irr,
            //   NegotiatedLoanAmount: this.CombinedLoan.negotiated_loan_amount,
            //   NegotiatedLoanTenor: this.CombinedLoan.negotiated_tenor_months,
            //   NegotiatedEMI: this.CombinedLoan.negotiated_emi,
            //   SelectAppropriateLMSScheduleCode: this.CombinedLoan.lms_schedule_code,
            //   NetDisbursementAmount: this.CombinedLoan.net_disbursement_amnt,
            //   LoanAmountincludingCrossSellofalltheassets: this.CombinedLoan.tot_cross_sel_amnt_of_all_assert_incl_ln_amnt,
            //   repaymentMode: this.CombinedLoan.repaymentMode,
            //   NoofPDC: this.CombinedLoan.NoofPDC,
            //   NoofSPDC: this.CombinedLoan.NoofSPDC
            // });
            //this.createNegotiationForm.controls.EMIStartDateAfterDisbursement.patchValue(this.CombinedLoan.emi_cycle_day)
            // this.calculateMinMax(this.CombinedLoan.repaymentMode, '')
            //this.DeductionDetails = this.CombinedLoan.deductions;
            // for (let i = this.deductChargesArray.length; i < this.DeductionDetails.length; i++) {
            //   this.deductionLabel[i] = this.DeductionDetails[i].charge_name;
            //   this.deductChargesArray.push(this.fb.group({
            //     DeductionChargefixedRate: this.DeductionDetails[i].charge_amount,
            //   }));
            // };
            this.CrossSellIns = JSON.parse(res.ProcessVariables.NegotiationDetails.AssetsJson);
            const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
              this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['motor']
              this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['pac']
              this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['life']
              this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['vas']
              this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].fastTag;
              this.loanBookingSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].loanBookingDetails;
              this.loanBreakupSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].loanAmountBreakup;
              
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
              this.loanBookingSelected['controls'].LoanAmountincludingCrossSell.setValue(this.CrossSellIns[index].cross_sell_others.loan_amnt_incl_cross_sel);
              this.loanBreakupSelected['controls'].LoanAmountincludingCrossSell.setValue(this.CrossSellIns[index].cross_sell_others.loan_amnt_incl_cross_sel);
              this.loanBreakupSelected['controls'].LoanAmountincludingCrossSellsubtractSubvent.setValue(this.CrossSellIns[index].cross_sell_others.loan_amnt_incl_cross_sel);
              
            })
          }
          else if (this.isCombinedLoan == false) {
            this.AssetsJson = JSON.parse(res.ProcessVariables.NegotiationDetails.AssetsJson);            
            const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
              
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].PremiumAmntSum.patchValue(this.AssetsJson[index].total_insurance_premium_amount),
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].fastTagAmtSum.patchValue(this.AssetsJson[index].total_other_cross_sell_amount),
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].processingFee.patchValue(this.AssetsJson[index].processingFee),
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].serviceCharge.patchValue(this.AssetsJson[index].serviceCharge),
              
              
              this.CrossSellIns = JSON.parse(res.ProcessVariables.NegotiationDetails.AssetsJson);
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].repaymentmodeArray['controls']['repaymentMode'].setValue(this.CrossSellIns[index].repayment_dtls.repayment_mode)
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].repaymentmodeArray['controls']['NoofPDC'].setValue(this.CrossSellIns[index].repayment_dtls.no_of_pdc)
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].repaymentmodeArray['controls']['NoofSPDC'].setValue(this.CrossSellIns[index].repayment_dtls.no_of_spdc)
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].repaymentmodeArray['controls']['collectedNoofPDC'].setValue(this.CrossSellIns[index].repayment_dtls.collected_no_of_pdc)
              this.createNegotiationForm.get('tickets')['controls'][index]['controls'].repaymentmodeArray['controls']['collectedNoofSPDC'].setValue(this.CrossSellIns[index].repayment_dtls.collected_no_of_spdc)
              // const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
                
              this.negotiationSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].negotiationformArray;
              this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['motor']
              this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['pac']
              this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['life']
              this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']['vas']
              this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].fastTag;
              this.loanBookingSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].loanBookingDetails;
              this.loanBreakupSelected = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].loanAmountBreakup;
              
              this.negotiationSelected['controls'].NegotiatedLoanAmount.setValue(this.CrossSellIns[index].negotiation_dtls.negotiated_loan_amount);
              this.negotiationSelected['controls'].NegotiatedLoanTenor.setValue(this.CrossSellIns[index].negotiation_dtls.negotiated_tenor_months);
              this.negotiationSelected['controls'].NegotiatedIRR.setValue(this.CrossSellIns[index].negotiation_dtls.negotiated_irr);
              this.negotiationSelected['controls'].NegotiatedEMI.setValue(this.CrossSellIns[index].negotiation_dtls.negotiated_emi);
              this.negotiationSelected['controls'].subventSchemeLoanTenor.setValue(this.CrossSellIns[index].negotiation_dtls.subvention_loan_tenor_months);
              this.negotiationSelected['controls'].subventionSchemeIRR.setValue(this.CrossSellIns[index].negotiation_dtls.subvention_irr);
              this.negotiationSelected['controls'].subventSchemeEMI.setValue(this.CrossSellIns[index].negotiation_dtls.subvention_emi);
              this.negotiationSelected['controls'].subventAmount.setValue(this.CrossSellIns[index].negotiation_dtls.subvention_amount);
              this.negotiationSelected['controls'].incentiveAmount.setValue(this.CrossSellIns[index].negotiation_dtls.incentive_amount);
              this.negotiationSelected['controls'].variableIRR.setValue(this.CrossSellIns[index].negotiation_dtls.variance);
              this.negotiationSelected['controls'].NetDisbursementAmount.setValue(this.CrossSellIns[index].loan_booking_dtls.net_disbursement_amount);
              
              
              
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
              this.fastTagvalueSelected['controls'].FASTagAmount.setValue((this.CrossSellIns[index].cross_sell_others.amount? this.CrossSellIns[index].cross_sell_others.amount : 0));
              if(this.CrossSellIns[index].cross_sell_ins[0].insurance_code == '4' || this.CrossSellIns[index].cross_sell_ins[2].insurance_code == '4'){
                this.showapplicable = true;
              }
              if(this.CrossSellIns[index].cross_sell_ins[2].insurance_code == '4'){
                this.showapplicableCredit = true;
              }
              if(this.CrossSellIns[index].cross_sell_others.cross_sell_type == '2'){
                this.showapplicableFastag = true;
              }
              this.loanBookingSelected['controls'].LoanAmountincludingCrossSell.setValue(this.CrossSellIns[index].loan_booking_dtls.loan_amount_incl_cross_sell);
              this.loanBookingSelected['controls'].LoanAmountincludingCrossSellsubtractSubvent.setValue(this.CrossSellIns[index].loan_booking_dtls.loan_amount_incl_cross_sell_subtract_subvention);
              this.loanBookingSelected['controls'].MoratoriumPeriod.setValue(this.CrossSellIns[index].loan_booking_dtls.moratorium_days);
              this.getEMIDate(index,this.CrossSellIns[index].loan_booking_dtls.moratorium_days);
              this.loanBookingSelected['controls'].NoofRepayableMonthsafterMoratorium.setValue(this.CrossSellIns[index].loan_booking_dtls.mor_repay_month);
              this.loanBookingSelected['controls'].EMIStartDateAfterDisbursement.setValue(this.CrossSellIns[index].loan_booking_dtls.emi_start_date);
              this.loanBookingSelected['controls'].PaymentModeforGapDaysInterest.setValue(this.CrossSellIns[index].loan_booking_dtls.gap_days_payment_mode);
              this.loanBookingSelected['controls'].repaymentFrequency.setValue(this.CrossSellIns[index].loan_booking_dtls.repayment_frequency);
              this.loanBookingSelected['controls'].EMIStructure.setValue(this.CrossSellIns[index].loan_booking_dtls.emi_structure);
              this.loanBookingSelected['controls'].loanBookingEMI.setValue(this.CrossSellIns[index].loan_booking_dtls.emi_after_crossell);
              this.loanBookingSelected['controls'].emiDefaultValue.setValue(this.CrossSellIns[index].loan_booking_dtls.emi_default_value);
              this.setEMIStru(index);
              if(this.AssetDetailsList[index].schemeType=='S' || this.AssetDetailsList[index].schemeType=='I' || this.AssetDetailsList[index].schemeType=='SI'){
                this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['loanBookingDetails']['controls']['EMIStructure'].disable();
              }
              
              if(this.AssetDetailsList[index].schemeType=='S' || this.AssetDetailsList[index].schemeType=='SI'){
                this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['loanBookingDetails']['controls']['loanBookingEMI'].disable();
              }
              let getloanTenor:any = null;
              let getloanBookingEmi= (this.loanBookingSelected['controls'].loanBookingEMI.value)?Number(this.loanBookingSelected['controls'].loanBookingEMI.value):null;
              if(!(this.AssetDetailsList[index].schemeType=='S' || this.AssetDetailsList[index].schemeType=='I' || this.AssetDetailsList[index].schemeType=='SI')){              
                getloanTenor=(this.negotiationSelected['controls'].NegotiatedLoanTenor.value)?Number(this.negotiationSelected['controls'].NegotiatedLoanTenor.value):null;  
              }else{ // if it is Subvention
                getloanTenor=(this.negotiationSelected['controls'].subventSchemeLoanTenor.value)?Number(this.negotiationSelected['controls'].subventSchemeLoanTenor.value):null;
              }

              if(getloanTenor && getloanBookingEmi){ // to Calculate Repayment value
                this.repaymentAmnt = (getloanTenor)*getloanBookingEmi;
              }

              this.loanBreakupSelected['controls'].finalAssetCost.setValue(this.CrossSellIns[index].loan_booking_dtls.final_asset_cost);
              this.loanBreakupSelected['controls'].NegotiatedLoanAmount.setValue(this.CrossSellIns[index].negotiation_dtls.negotiated_loan_amount);
              this.loanBreakupSelected['controls'].LoanAmountincludingCrossSell.setValue(this.CrossSellIns[index].loan_booking_dtls.loan_amount_incl_cross_sell);
              this.loanBreakupSelected['controls'].LoanAmountincludingCrossSellsubtractSubvent.setValue(this.CrossSellIns[index].loan_booking_dtls.loan_amount_incl_cross_sell_subtract_subvention);
              this.loanBreakupSelected['controls'].finalLTV.setValue(this.CrossSellIns[index].loan_booking_dtls.final_ltv);
              this.loanBreakupSelected['controls'].finalLTVwithoutcrs.setValue(this.CrossSellIns[index].loan_booking_dtls.final_ltv_without_crossell);
              this.loanBreakupSelected['controls'].MIPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[0].premium_amount);
              this.loanBreakupSelected['controls'].PACPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[1].premium_amount);
              this.loanBreakupSelected['controls'].VASPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[3].premium_amount);
              this.loanBreakupSelected['controls'].lifeCoverPremiumAmount.setValue(this.CrossSellIns[index].cross_sell_ins[2].premium_amount);
              this.loanBreakupSelected['controls'].FASTagAmount.setValue(this.CrossSellIns[index].cross_sell_others.amount);
              this.loanBreakupSelected['controls'].charges.setValue(this.CrossSellIns[index].loan_booking_dtls.total_charges);
              this.loanBreakupSelected['controls'].gapDaysInterest.setValue(this.CrossSellIns[index].loan_booking_dtls.gap_days_interest);
              
              if(this.showInsuranceFields && (this.AssetDetailsList[index].IsORPFunding ==  '1')){
                this.clearValidationORP(index);
              }
              if(this.CrossSellIns[index].cross_sell_ins[0].insurance_code == '4'){
                let disableFields = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']
                
                disableFields.motor['controls'].fundingRequiredforMI.disable();
                disableFields.motor['controls'].MIPremiumAmount.disable();
                disableFields.motor['controls'].MITenure.disable(),
                
                disableFields.pac['controls'].creditShieldPAC.disable();
                disableFields.pac['controls'].fundingRequiredforPAC.disable();
                disableFields.pac['controls'].PACPremiumAmount.disable();
                
                disableFields.vas['controls'].VAS.disable();
                disableFields.vas['controls'].fundingRequiredforVAS.disable();
                disableFields.vas['controls'].VASPremiumAmount.disable();
                
                }
                if(this.CrossSellIns[index].cross_sell_ins[2].insurance_code == '4'){
                  let fetchDisableVal = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls'].life['controls']
              
              fetchDisableVal.fundingRequiredforlifeCover.disable();
              fetchDisableVal.lifeCoverPremiumAmount.disable();
              fetchDisableVal.fundingforLifeCover.disable();
              
              }
              if(this.CrossSellIns[index].cross_sell_others.cross_sell_type == '2'){
                let fastagDisable = this.createNegotiationForm.get('tickets')['controls'][index]['controls']['fastTag']['controls'];
            
            fastagDisable.fundingRequiredforFASTag.disable();
                      fastagDisable.FASTagAmount.disable();
            
            }
            if(this.CrossSellIns[index].cross_sell_ins[1].insurance_code == '4'){
              let disablePACFields = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']
              
              disablePACFields.pac['controls'].fundingRequiredforPAC.disable();
              disablePACFields.pac['controls'].PACPremiumAmount.disable();
              
              
              }
              if(this.CrossSellIns[index].cross_sell_ins[3].insurance_code == '4'){
                let disableVASFields = this.createNegotiationForm.get('tickets')['controls'][index]['controls'].CrossSellInsurance['controls']
                
                disableVASFields.vas['controls'].fundingRequiredforVAS.disable();
                disableVASFields.vas['controls'].VASPremiumAmount.disable();
                
                
                }
              if(this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['loanBookingDetails']['value']['EMIStructure']!='1EMISTRUCT'){
                var variableGrid = [];
              Object.keys(this.AssetsJson[index].variable_emi_grid).forEach(key => {
                var object = {
                    fromMonth: this.AssetsJson[index].variable_emi_grid[key].from_month,
                    toMonth: this.AssetsJson[index].variable_emi_grid[key].to_month,
                    installmentPercent: this.AssetsJson[index].variable_emi_grid[key].installment_Percentage,
                    emiAmount: this.AssetsJson[index].variable_emi_grid[key].emi_amount
                }
                variableGrid.push(object);
              })
              let varSchValues = variableGrid;
              let fetchedVarArray = this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['variableForm']['controls']['variableFormArray'];  
              this.mockIndex = index;
              this.tableObjectIndex = index;
              this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['variableForm'].get('variableFormArray').controls=[];
              this.formArr.push(this.initRowsDefault(index,false));
              for (let x = 0; x < varSchValues.length; x++) {

                fetchedVarArray.controls[0].controls.fromMonth.setValue(varSchValues[x]['fromMonth'])
                fetchedVarArray.controls[0].controls.toMonth.setValue(varSchValues[x]['toMonth'])
                fetchedVarArray.controls[0].controls.installmentPercent.setValue(varSchValues[x]['installmentPercent'])
                fetchedVarArray.controls[0].controls.emiAmount.setValue(varSchValues[x]['emiAmount'])
                this.formArr.push(this.initRows(index,x,true,fetchedVarArray.controls[0].controls))
              }
              let totalVarTableSize=this.createNegotiationForm['controls']['tickets']['controls'][this.mockIndex]['controls']['variableForm']
              if(totalVarTableSize.get('variableFormArray').controls.length>0){
                totalVarTableSize['controls']['variableFormArray'].removeAt(0);
              }
              
              var mockSheduleData = [];             
              Object.keys(this.AssetsJson[index].mock_schedule).forEach(key => {
                var object = {
                  installmentCounter: this.AssetsJson[index].mock_schedule[key].installment_no,
                  installmentDate: this.AssetsJson[index].mock_schedule[key].due_date,
                  totalInstallmentAmount: this.AssetsJson[index].mock_schedule[key].total_installment_amount,
                  principalAmount: this.AssetsJson[index].mock_schedule[key].principal_amount,
                  interestAmount: this.AssetsJson[index].mock_schedule[key].interest_amount,
                  principalBalanceAmount: this.AssetsJson[index].mock_schedule[key].principal_outstanding_amount
                }
                mockSheduleData.push(object);
              })
              let mockSchValues = mockSheduleData;
              let fetchedMockArray = this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['mockSchForm']['controls']['mockSchFormArray'];  
              this.createNegotiationForm['controls']['tickets']['controls'][index]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
              this.mockformArr.push(this.msInitRowsDefault(false,''));
              for (let x = 0; x < mockSchValues.length; x++) {

                fetchedMockArray.controls[0].controls.installmentCounter.setValue(mockSchValues[x]['installmentCounter'])
                fetchedMockArray.controls[0].controls.installmentDate.setValue(mockSchValues[x]['installmentDate'])
                fetchedMockArray.controls[0].controls.totalInstallmentAmount.setValue(mockSchValues[x]['totalInstallmentAmount'])
                fetchedMockArray.controls[0].controls.principalAmount.setValue(mockSchValues[x]['principalAmount'])
                fetchedMockArray.controls[0].controls.interestAmount.setValue(mockSchValues[x]['interestAmount'])
                fetchedMockArray.controls[0].controls.principalBalanceAmount.setValue(mockSchValues[x]['principalBalanceAmount'])
              
                this.mockformArr.push(this.msInitRowsDefault(true,fetchedMockArray.controls[0].controls))
              
              }
              let totalMockTableSize=this.createNegotiationForm['controls']['tickets']['controls'][this.mockIndex]['controls']['mockSchForm']
              if(totalMockTableSize.get('mockSchFormArray').controls.length>0){
                totalMockTableSize['controls']['mockSchFormArray'].removeAt(0);
              }
              }

              this.DeductionDetails = this.AssetsJson[index].deductions;
              for (let i = this.deductChargesArray.length; i < this.DeductionDetails.length; i++) {
                this.deductionLabel[i] = this.DeductionDetails[i].charge_name;
                // if (this.DeductionDetails[i].charge_type != "P")
                //   this.DeductionDetails[i].DeductionChargefixedRate = this.DeductionDetails[i].DeductionChargefixedRate;
                this.deductChargesArray.push(this.fb.group({
                  DeductionChargefixedRate: this.DeductionDetails[i].charge_amount,
                }));
                
              };
              let selectedIndex
              for (let j = 0; j < this.DeductionDetails.length; j++) {
                if(this.CrossSellIns[index].cross_sell_ins[2].insurance_code == '4' && (this.DeductionDetails[j].charge_code == "713" || this.DeductionDetails[j].charge_code == "719" || this.DeductionDetails[j].charge_code == "720")){
                  selectedIndex = j;
                  this.createNegotiationForm.get('tickets')['controls'][index]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
                } else if(this.CrossSellIns[index].cross_sell_ins[2].insurance_code == '2' && this.DeductionDetails[j].charge_code == "719"){
                  selectedIndex = j;
                  this.createNegotiationForm.get('tickets')['controls'][index]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
                } else if (this.CrossSellIns[index].cross_sell_ins[2].insurance_code == '3' && this.DeductionDetails[j].charge_code == "720"){
                  selectedIndex = j;
                  this.createNegotiationForm.get('tickets')['controls'][index]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
                 }
                 if((this.CrossSellIns[index].cross_sell_ins[0].insurance_code == '4' && (this.DeductionDetails[j].charge_code == "714" || this.DeductionDetails[j].charge_code == "723")) || 
                 (this.CrossSellIns[index].cross_sell_ins[1].insurance_code == '4' && (this.DeductionDetails[j].charge_code == "715" || this.DeductionDetails[j].charge_code == "726")) || 
                 (this.CrossSellIns[index].cross_sell_ins[3].insurance_code == '4'  && (this.DeductionDetails[j].charge_code == "716" || this.DeductionDetails[j].charge_code == "728"))){
                  selectedIndex = j;
                  this.createNegotiationForm.get('tickets')['controls'][index]['controls']['DeductionChargefixedRate']['controls'][selectedIndex]['controls'].DeductionChargefixedRate.disable()
                 }
              }
              if (this.roleType === 5 || this.roleType === 4) {
                this.deductChargesArray.disable()
              }
              this.setLMSCode(index,false);
              this.loanBookingSelected['controls'].SelectAppropriateLMSScheduleCode.setValue(this.CrossSellIns[index].loan_booking_dtls.lms_schedule_code);              
            })
          }
          this.collectedChequeMaxMin('',0);
        }
      });
      //this.getNetDisbursementAmount(i)  //GIT Above included
      
  }
  validateTenure(event, i) {
    this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
    this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']
    this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']
    this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']
    if (event == 'motor') {
      if (this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value == '') {
        this.toasterService.showError('Enter Negotiated Loan Tenor', '');
        this.valueSelected['controls'].MIPremiumAmount.setValue(null);
        this.premiumAmtvalidation = false;
      }
      else if (this.valueSelected['controls'].motorInsurance.value !='4' && !this.valueSelected['controls'].MITenure.value) {
        this.toasterService.showError('Enter MI Loan Tenor', '');
        this.valueSelected['controls'].MIPremiumAmount.setValue(null);
        this.premiumAmtvalidation = false;
      }
     
      else if (this.valueSelected['controls'].motorInsurance.value !='4' && (Number(this.valueSelected['controls'].MITenure.value) < 0 ||
        Number(this.valueSelected['controls'].MITenure.value) >
        Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value))) {
        this.toasterService.showError('MI Insurance tenor should be >= 1 and <= negotiated loan tenor', '');
        this.valueSelected['controls'].MIPremiumAmount.setValue(null);
        this.premiumAmtvalidation = false;
      }
    }
    else if (event == 'creditShieldInsurance') {
     
        if (this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value == '') {
          this.toasterService.showError('Enter Negotiated Loan Tenor', '');
          this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(null);
          this.premiumAmtvalidation = false;
        }
        else if (Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value) < 24) {
          this.toasterService.showError('Negotiated Loan Tenor should be minimum of 2 Years for credit shield Life Cover', '');
          this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(null);
          this.premiumAmtvalidation = false;
        }
    }
  }
  validateAmount(value, i) {   //Nego Enhance
    this.negoLoanamount = this.createNegotiationForm.get('tickets')['controls'][i]['controls']['negotiationformArray']['controls']['NegotiatedLoanAmount'].value
    if(!this.negoLoanamount){
      this.toasterService.showError("Enter Negotiated Loan Amount", '');
      return;
    }
    //dinesh--> wenever changes emiStructure defaulted to empty & clearing default emi base Value
    this.mockIndex=i;
    let loanBookingValues = this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['loanBookingDetails']['controls'];
    let emiStruVal=loanBookingValues['EMIStructure']['value'];
        emiStruVal=emiStruVal?((emiStruVal=='1EMISTRUCT')?emiStruVal:loanBookingValues['EMIStructure'].setValue('')):emiStruVal;
        loanBookingValues['emiDefaultValue'].setValue('');
        if(emiStruVal && emiStruVal!='1EMISTRUCT'){
        this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['variableForm'].get('variableFormArray').controls=[];
        this.formArr.push(this.initRowsDefault(i,false));
        this.createNegotiationForm['controls']['tickets']['controls'][i]['controls']['mockSchForm'].get('mockSchFormArray').controls=[];
        //this.mockformArr.push(this.msInitRowsDefault(false,''))
       }

    this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
    this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']
    this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']
    this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']
    this.fastTagvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].fastTag
    if (value == 'MIPremiumAmount') {
      if (Number(this.valueSelected['controls'].MIPremiumAmount.value) > Number(this.negoLoanamount) || 
      (Number(this.valueSelected['controls'].MIPremiumAmount.value) < 1)) {
        if(Number(this.valueSelected['controls'].MIPremiumAmount.value) > Number(this.negoLoanamount))
        this.toasterService.showError("MI Premium Amount should be less than Negotiated Loan Amount", '');
        if(Number(this.valueSelected['controls'].MIPremiumAmount.value) < 1)
        this.toasterService.showError("MI Premium Amount should not be less than 1 rupee", '');
        
        this.valueSelected['controls'].MIPremiumAmount.setValue(null);
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['MIPremiumAmount'].setValue(null);
      }
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['MIPremiumAmount'].patchValue(this.valueSelected['controls'].MIPremiumAmount.value);
    }
    else if (value == 'PACPremiumAmount') {
      if (Number(this.PACvalueSelected['controls'].PACPremiumAmount.value) > Number(this.negoLoanamount) || 
      (Number(this.PACvalueSelected['controls'].PACPremiumAmount.value) < 1)) {
        if(Number(this.PACvalueSelected['controls'].PACPremiumAmount.value) > Number(this.negoLoanamount))
        this.toasterService.showError("PAC Premium Amount should be less than Negotiated Loan Amount", '');
        if(Number(this.PACvalueSelected['controls'].PACPremiumAmount.value) < 1)
        this.toasterService.showError("PAC Premium Amount should not be less than 1 rupee", '');

        this.PACvalueSelected['controls'].PACPremiumAmount.setValue(null);
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['PACPremiumAmount'].setValue(null);
      }
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['PACPremiumAmount'].patchValue(this.PACvalueSelected['controls'].PACPremiumAmount.value);
    }
    else if (value == 'VASPremiumAmount') {
      if (Number(this.VASvalueSelected['controls'].VASPremiumAmount.value) > Number(this.negoLoanamount) || 
      (Number(this.VASvalueSelected['controls'].VASPremiumAmount.value) < 1)) {
        if(Number(this.VASvalueSelected['controls'].VASPremiumAmount.value) > Number(this.negoLoanamount))
        this.toasterService.showError("VAS Premium Amount should be less than Negotiated Loan Amount", '');
        if(Number(this.VASvalueSelected['controls'].VASPremiumAmount.value) < 1)
        this.toasterService.showError("VAS Premium Amount should not be less than 1 rupee", '');

        this.VASvalueSelected['controls'].VASPremiumAmount.setValue(null);
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['VASPremiumAmount'].patchValue(null);
      }
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['VASPremiumAmount'].patchValue(this.VASvalueSelected['controls'].VASPremiumAmount.value);
    }
    else if (value == 'lifeCoverPremiumAmount') {
      if (Number(this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value) > Number(this.negoLoanamount) || 
      (Number(this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value) < 1)) {
        if(Number(this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value) > Number(this.negoLoanamount))
        this.toasterService.showError("Life cover Premium Amount should be less than Negotiated Loan Amount", '');
        
        if(Number(this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value) < 1)
        this.toasterService.showError("Life cover Premium Amount should not be less than 1 rupee", '');

        this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.patchValue(null);
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['lifeCoverPremiumAmount'].patchValue(null);
      }
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['lifeCoverPremiumAmount'].patchValue(Math.round(this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.value));
    }
    else if (value == 'fastTag') {
      if (Number(this.fastTagvalueSelected['controls'].FASTagAmount.value) > Number(this.negoLoanamount) || 
      (Number(this.fastTagvalueSelected['controls'].FASTagAmount.value) < 1)) {
        if(Number(this.fastTagvalueSelected['controls'].FASTagAmount.value) > Number(this.negoLoanamount))
        this.toasterService.showError("FASTag Amount should be less than Negotiated Loan Amount", '');
        if(Number(this.fastTagvalueSelected['controls'].FASTagAmount.value) < 1)
        this.toasterService.showError("FASTag Amount should not be less than 1 rupee", '');

        this.fastTagvalueSelected['controls'].FASTagAmount.setValue(null);
        this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['FASTagAmount'].setValue(null);
      }
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['FASTagAmount'].patchValue(this.fastTagvalueSelected['controls'].FASTagAmount.value);
    }
  }
  finalAssetCal(i) { //Mani
    let netAsset = this.createNegotiationForm.get('tickets')['controls'][i]['controls']['netAssetCost'].value;
    let loanAmountIncludeCrossSell = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['LoanAmountincludingCrossSell']['value'];
    let loanAmountwithoutCrossSell = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value;
    if(Number(netAsset) > Number(loanAmountIncludeCrossSell) || (Number(netAsset) < Number(loanAmountIncludeCrossSell) && !this.isSecured)){
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].finalAssetCost.setValue(netAsset)
    }else if ((Number(netAsset) < Number(loanAmountIncludeCrossSell) ) && this.isSecured){
      this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].finalAssetCost.setValue(loanAmountIncludeCrossSell)
    }
    this.ltvPercent(i,this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['finalAssetCost']['value']);

    if(Number(netAsset) > Number(loanAmountwithoutCrossSell) || (Number(netAsset) < Number(loanAmountwithoutCrossSell) && !this.isSecured)){
      //this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].finalAssetCost.setValue(netAsset)
      this.ltvwithoutCrsPercent(i,netAsset);
    }else if ((Number(netAsset) < Number(loanAmountwithoutCrossSell) ) && this.isSecured){
      //this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].finalAssetCost.setValue(loanAmountwithoutCrossSell)
      this.ltvwithoutCrsPercent(i,loanAmountwithoutCrossSell);
    }
  }
  fetchLoanBreakValues(i){
    let valueSet = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'];
    let a = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls'];
    let b = this.createNegotiationForm.get('tickets')['controls'][i]['controls'];
    //const arrayData = this.createNegotiationForm.controls['tickets1'].value;
    const arrayData = [];
    this.createNegotiationForm.get('tickets')['controls'][i]['controls']['DeductionChargefixedRate']['controls'].forEach(e=>{
      arrayData.push(e.controls) ;
    })
    let sumValue = 0;
    arrayData.forEach(array => {
      sumValue += Number(array['DeductionChargefixedRate'].value);
    });
    valueSet.MIPremiumAmount.setValue(a.motor['controls'].MIPremiumAmount.value);
    valueSet.PACPremiumAmount.setValue(a.pac['controls'].PACPremiumAmount.value);
    valueSet.VASPremiumAmount.setValue(a.vas['controls'].VASPremiumAmount.value);
    valueSet.lifeCoverPremiumAmount.setValue(Math.round(a.life['controls'].lifeCoverPremiumAmount.value));
    valueSet.FASTagAmount.setValue(b.fastTag['controls'].FASTagAmount.value);
    valueSet.charges.setValue(Math.round(sumValue));
  }
  ltvPercent(i,val){ 
    let loanAmountIncludeCrossSell = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanBookingDetails['controls']['LoanAmountincludingCrossSell']['value']);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].finalLTV.setValue(((loanAmountIncludeCrossSell/Number(val)) * 100).toFixed(2));
  }
  ltvwithoutCrsPercent(i,val){ 
    let loanAmountwithoutCrossSell = Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value);
    this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls'].finalLTVwithoutcrs.setValue(((loanAmountwithoutCrossSell/Number(val)) * 100).toFixed(2));
  }
  fetchPrmAmount(insuranceType, event, i,fun) {     //Mani
    const crossSellIns = this.createNegotiationForm.controls.tickets['controls'].forEach((ticket, index) => {
      this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
      this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']
      this.lifecovervalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['life']
      this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']
    });
    let x = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']
    let insuranceProviderName: String;
    let insurancePercentage: number;
    let insuranceTenor: number; 
      if (event == 'motor') {
        if (!this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value) {
          this.toasterService.showError('Enter Negotiated Loan Amount', '');
          this.premiumAmtvalidation = false;
        }
        else if (this.valueSelected['controls'].motorInsurance.value !='4' && !this.valueSelected['controls'].MITenure.value) {
          this.toasterService.showError('Enter MI Loan Tenor', '');
          this.premiumAmtvalidation = false;
        }
        else if (this.valueSelected['controls'].motorInsurance.value !='4' && (Number(this.valueSelected['controls'].MITenure.value) <= 0 || Number(this.valueSelected['controls'].MITenure.value) >
          Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value))) {
          this.toasterService.showError('MI Insurance tenor should be >= 1 and <= negotiated loan tenor', '');
          this.premiumAmtvalidation = false;
        }
        else {
          this.premiumAmtvalidation = true;
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
      }
      else if (event == 'creditShieldInsurance') {
        if (!this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value) {
          this.toasterService.showError('Enter Negotiated Loan Amount', '');
          this.premiumAmtvalidation = false;
        }
        else if (this.lifecovervalueSelected['controls'].creditShieldLifeCover.value !='4' && this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanTenor'].value == '') {
          this.toasterService.showError('Enter Negotiated Loan Tenor', '');
          this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(null);
          this.premiumAmtvalidation = false;
        }
        else if (this.lifecovervalueSelected['controls'].creditShieldLifeCover.value !='4' &&(Number(this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']
        ['NegotiatedLoanTenor'].value) < 24)) {
          this.toasterService.showError('Negotiated Loan Tenor should be minimum of 2 Years for credit shield Life Cover', '');
          this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(null);
          this.premiumAmtvalidation = false;
        }
        else {
          this.premiumAmtvalidation = true;
          insuranceProviderName = this.lifecovervalueSelected['controls'].creditShieldLifeCover.value;
          let percentage = this.InsuranceSlabLOV.filter(val =>
            val.key == this.lifecovervalueSelected['controls'].fundingforLifeCover.value)
          insurancePercentage = Number(percentage[0].value.replace('%', ''));
          insuranceTenor =
            Number(this.AssetDetailsList[i].EligibleTenorMax);
        }
    let negoValue = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].negotiationformArray['controls']['NegotiatedLoanAmount'].value
         
    this.valueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['motor']
    this.PACvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['pac']
    this.VASvalueSelected = this.createNegotiationForm.get('tickets')['controls'][i]['controls'].CrossSellInsurance['controls']['vas']
    
    let MIprmAmount = "0";
    let PACprmAmount = "0";
    let VASprmAmount = "0";
    this.valueSelected['controls'].fundingRequiredforMI.value === "1FNDREQ" ?
    MIprmAmount = this.valueSelected['controls'].MIPremiumAmount.value : "0";
    this.PACvalueSelected['controls'].fundingRequiredforPAC.value === "1FNDREQ" ?
    PACprmAmount = this.PACvalueSelected['controls'].PACPremiumAmount.value : "0";
    this.VASvalueSelected['controls'].fundingRequiredforVAS.value === "1FNDREQ" ?
    VASprmAmount = this.VASvalueSelected['controls'].VASPremiumAmount.value : "0";
    
        this.combinedVal = Number(negoValue) + Number(MIprmAmount) + Number(PACprmAmount) + Number(VASprmAmount);
      }
    if((event == 'motor' && this.valueSelected['controls'].motorInsurance.value =='4') || (event == 'creditShieldInsurance' && this.lifecovervalueSelected['controls'].creditShieldLifeCover.value =='4')){
      this.premiumAmtvalidation = false;
    }
    if (this.premiumAmtvalidation == true) {
      const data = {
        insuranceProvider: Number(insuranceProviderName),// Number(this.valueSelected.motorInsurance),//icic chola
        insuranceType: insuranceType, // motor
        // applicantId: this.LeadReferenceDetails[0].ApplicationId,
        leadId: Number(this.leadId),
        collateralId: Number(this.AssetDetailsList[i].CollateralId),
        //loanAmount: Number(this.AssetDetailsList[i].EligibleLoanAmnt),
        loanAmount: (event == 'creditShieldInsurance') ? Number(this.combinedVal) : Number(this.AssetDetailsList[i].EligibleLoanAmnt),
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
              this.valueSelected['controls'].MIPremiumAmount.setValue(Math.round(res.ProcessVariables.miPremiumAmount));
              x.motor['controls'].MIPremiumAmount.disable();
              this.PACvalueSelected['controls'].PACPremiumAmount.setValue
                (Math.round(res.ProcessVariables.pacPremiumAmount));
              x.pac['controls'].PACPremiumAmount.disable();
              this.VASvalueSelected['controls'].VASPremiumAmount.setValue
                (Math.round(res.ProcessVariables.vasPremiumAmount));
              x.vas['controls'].VASPremiumAmount.disable();
            }
            else if (event == 'creditShieldInsurance') {
              this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(Math.round(res.ProcessVariables.premiumAmount));
              this.lifecovervalueSelected['controls'].lifeCoverPremiumAmount.setValue(Math.round(res.ProcessVariables.premiumAmount));
              this.createNegotiationForm.get('tickets')['controls'][i]['controls'].loanAmountBreakup['controls']['lifeCoverPremiumAmount'].patchValue(Math.round(res.ProcessVariables.premiumAmount));
              x.life['controls'].lifeCoverPremiumAmount.disable();
            }
             this.calculateTotal(i)
          }
          else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
            this.toasterService.showError(res.ProcessVariables.error.message, '');
          }
        });
    }
    if(fun == "callFun")
    this.calculateTotal(i)
  }
  onNext() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/credit-conditions`);
    }
    if (this.roleType == '1') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/disbursement`]);
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/check-list`]);
    } else if (this.roleType == '7') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/disbursement`]);
    }
    // this.router.navigateByUrl(`pages/credit-decisions/${this.leadId}/disbursement`)
  }
  onBack() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/disbursement/${this.leadId}`);
    }
    if (this.roleType == '1') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/term-sheet`]);
    } else if (this.roleType == '7') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/sanction-details`]);

    }
    // else if (this.roleType == '2') {
    //   this.router.navigate([`pages/credit-decisions/${this.leadId}/credit-condition`]);
    // } else if (this.roleType == '4') {
    //   this.router.navigate([`pages/cpc-maker/${this.leadId}/sanction-details`]);
    // } else if (this.roleType == '5') {
    //   this.router.navigate([`pages/cpc-checker/${this.leadId}/pdc-details`]);
    // }
  }
  OnApproveRepayment() {
    console.log('Approved');
    
    
  }
}
