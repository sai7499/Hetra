import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoanDetails } from '@model/dde.model';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { PdDataService } from '../pd-data.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

  loanDetailsForm: FormGroup;

  public loanDetailsLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;
  LOV: any = [];
  loanDetails: LoanDetails;
  newCvDetails: any = {};
  usedVehicleDetails: any = {};
  assetDetailsUsedVehicle: any = {};
  leadId: number;
  userId: number;
  roleName: any;
  roles: any = [];
  applicantId: number;
  version: string;
  data: any;
  currentYear = new Date().getFullYear();
  yearCheck = [];
  productCat: any;
  toDayDate: Date = new Date();

  amountPattern = {
    rule: '^[1-9][0-9]*$',
    msg: 'Numbers Only Required',
  };

  maxlength10 = {
    rule: 10,
    msg: '',
  };

  modelPattern = {
    rule: '^[A-Z]*[a-z]*$',
    msg: 'Invalid Model',
  };

  maxlength30 = {
    rule: 30,
    msg: '',
  };
  isDirty: boolean;
  leadData: any;
  reqLoanAmount: any;
  productCatCode: any;
  productCategoryId: any;
  roleId: any;
  roleType: any;
  regStatus: any;
  engChassDisabled: boolean;
  engChassRequired: boolean;
  insuranceStatus: any;
  insRequired: boolean;
  disableSaveBtn: boolean;
  operationType: string;
  insDisabled: boolean;
  vehCondStatus: any;
  vehCondRequired: boolean;



  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private personalDiscussion: PersonalDiscussionService,
    private pdDataService: PdDataService,
    private toasterService: ToasterService,
    public sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private toggleDdeService: ToggleDdeService) {
    this.yearCheck = [{ rule: val => val > this.currentYear, msg: 'Future year not accepted' }];
  }

  async ngOnInit() {

    // accessing lead id from route

    this.leadId = (await this.getLeadId()) as number;
    // console.log("leadID =>", this.leadId)

    // method for getting all vehicle details related to a lead

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);

    // console.log("user id ==>", this.userId)

    // this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data.default;
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data.default;
      },
      error => {
        this.errorMsg = error;
      });
    this.getLOV();
    this.getPdDetails();
    this.RemoveAddControls();
    // this.getPdStatus();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.loanDetailsLov = value ? value[0].loanDetail[0] : {};

    });
    this.operationType = this.toggleDdeService.getOperationType();
    if (this.operationType === '1' || this.operationType === '2') {
      this.loanDetailsForm.disable();
      this.disableSaveBtn = true;
    }
  }

  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }
        resolve(null);
      });
    });
  }

  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
    this.activatedRoute.params.subscribe((value) => {
      this.getLeadSectionData();
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
      console.log('Applicant Id In Loan Details Component', this.applicantId);
    });
  }
  async getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    // console.log('leadSectionData Lead details', leadSectionData);
    this.leadData = { ...leadSectionData };
    const data = this.leadData;
    console.log('in get lead section data', data);

    const leadDetailsFromLead = data['leadDetails'];

    // this.applicantFullName = applicantDetailsFromLead['fullName']
    // this.mobileNo = applicantDetailsFromLead['mobileNumber']
    // console.log("in lead section data", this.applicantFullName, this.mobileNo)
    this.reqLoanAmount = leadDetailsFromLead.reqLoanAmt;
    this.productCatCode = leadDetailsFromLead.productCatCode;
    console.log('in lead section data', leadDetailsFromLead);
    console.log('prod cat code', this.productCatCode);
    console.log('req loan amount', this.reqLoanAmount);
  }
  getPdStatus() {
    this.sharedService.pdStatus$.subscribe((value: any) => {

      console.log('in get pd status', value);
    });
  }


  regCopyVerified(event: any) { // fun for conditional based validation for regcopy verified data field
    console.log(event);
    this.regStatus = event ? event : event;
    if (this.regStatus === '1') {
      this.engChassDisabled = false;
      this.engChassRequired = true;
      this.loanDetailsForm.get('engineNumber').enable();
      this.loanDetailsForm.get('chasisNumber').setValidators(Validators.required);
      this.loanDetailsForm.get('chasisNumber').enable();
      this.loanDetailsForm.get('chasisNumber').setValidators(Validators.required);

    } else if (this.regStatus !== '1') {
      this.engChassDisabled = true;
      this.engChassRequired = false;
      this.loanDetailsForm.get('engineNumber').disable();
      this.loanDetailsForm.get('chasisNumber').clearValidators();
      this.loanDetailsForm.get('chasisNumber').updateValueAndValidity();
      this.loanDetailsForm.get('chasisNumber').disable();
      this.loanDetailsForm.get('chasisNumber').updateValueAndValidity();

    }

  }
  insCopyVerified(event: any) { // fun that triggers when insurance copy field get changes
    this.insuranceStatus = event ? event : event;
    if (this.insuranceStatus === '1') {
      this.insRequired = true;
      this.insDisabled = false;
      this.loanDetailsForm.get('insuranceValidity').enable();
      this.loanDetailsForm.get('insuranceValidity').setValidators(Validators.required);
    } else if (this.insuranceStatus !== '1') {
      this.insRequired = false;
      this.insDisabled = true;
      this.loanDetailsForm.get('insuranceValidity').disable();
      this.loanDetailsForm.get('insuranceValidity').clearValidators();
      this.loanDetailsForm.get('insuranceValidity').updateValueAndValidity();

    }

  }
  vehCondVerified(event: any) { // fun that triggers when vehicle condition verified gets changes
    this.vehCondStatus = event ? event : event;
    if (this.vehCondStatus === '1') {
      this.vehCondRequired = true;
      this.loanDetailsForm.get('conditionOfVehicle').enable();
      this.loanDetailsForm.get('conditionOfVehicle').setValidators(Validators.required);
    } else if (this.vehCondStatus !== '1') {
      this.vehCondRequired = false;
      this.loanDetailsForm.get('conditionOfVehicle').disable();
      this.loanDetailsForm.get('conditionOfVehicle').clearValidators();
      this.loanDetailsForm.get('conditionOfVehicle').updateValueAndValidity();

    }

  }

  initForm() {

    // controls for new vehicle

    this.loanDetailsForm = new FormGroup({
      newVehicleCost: new FormControl(''),
      newVehModel: new FormControl(''),
      newVehicleType: new FormControl(''),
      newVehicleReqLoanAmount: new FormControl(''),
      newVehicleMarginMoney: new FormControl(''),

      // controls for used vehicle

      usedVehicleCost: new FormControl(''),
      usedVehModel: new FormControl(''),
      usedVehicleType: new FormControl(''),
      usedVehicleMarginMoney: new FormControl(''),
      usedVehicleLoanAmountReq: new FormControl(''),
      // sourceOfVehiclePurchase: new FormControl(''),
      sourceOfVehiclePurchase: new FormControl('', Validators.compose([Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z ]*$/), Validators.required])),
      // marginMoneySource: new FormControl(''),
      marginMoneySource: new FormControl('', Validators.compose([Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z ]*$/), Validators.required])),
      financierName: new FormControl(''),
      coAapplicantAwareMarginMoney: new FormControl(''),
      channelSourceName: new FormControl(''),
      vehicleSeller: new FormControl(''),
      proposedVehicle: new FormControl(''),
      investmentAmount: new FormControl(''),
      marginMoneyBorrowed: new FormControl(''),
      marketValueProposedVehicle: new FormControl(''),
      purchasePrice: new FormControl(''),
      vehicleCondition: new FormControl(''),
      fundsUsage: new FormControl(''),
      earlierVehicleApplication: new FormControl(''),
      othersRemarks: new FormControl('', Validators.compose([Validators.maxLength(300),
      Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.required])),
      // othersRemarks: new FormControl(''),
      drivingVehicleEarlier: new FormControl(''),
      vehicleAttachedPlying: new FormControl(''),
      awareDueDateEmiAmount: new FormControl(''),
      vehicleContract: new FormControl(''),

      // controls for used vehicle asset details

      vehicleMake: new FormControl(''),
      modelInYear: new FormControl(''),
      regNo: new FormControl(''),
      regCopVfd: new FormControl(''),
      vehicleHpaNbfc: new FormControl(''),
      engineNumber: new FormControl(''),
      chasisNumber: new FormControl(''),
      permitValidity: new FormControl('', Validators.required),
      fitnessValidity: new FormControl('', Validators.compose([Validators.required])),
      taxValidity: new FormControl('', Validators.compose([Validators.required])),
      insuranceCopyVerified: new FormControl(''),
      insuranceValidity: new FormControl(''),
      vehiclePhsicallyVerified: new FormControl(''),
      conditionOfVehicle: new FormControl(''),
      vehicleRoute: new FormControl(''),
      noOfTrips: new FormControl(''),
      amtPerTrip: new FormControl(''),
      selfDrivenOrDriver: new FormControl(''),
      isPrevExpMatched: new FormControl('', Validators.required),
      // remarks: new FormControl('')
      remarks: new FormControl('', Validators.compose([Validators.maxLength(300),
      Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.required])),
    });
  }


  // checkManufacturingYear(event, i) {
  //   const dateFormat: Date = new Date();
  //   const year = dateFormat.getFullYear();
  //   let modelInYear = parseInt(event.target.value);
  //   if (modelInYear > year) {
  //     // formData.form.controls['email'].setErrors({'incorrect': true});
  //     this.loanDetailsForm.controls['controls']['modelInYear'].setErrors({ 'incorrect': true })
  //     // alert("invalid")
  //   } else {

  //   }
  // }

  getDateFormat(date) {

    // console.log("in getDateFormat", date)

    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);

    // year = dateFormat.getFullYear();
    // month = Number(dateFormat.getMonth()) + 1;
    // let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    // day = dateFormat.getDate().toString();
    // day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    // const formattedDate = year + '-' + month1 + '-' + day;
    // //   const formattedDate = day + '-' + month1 + '-' + year;
    // console.log("formattedDate", formattedDate)
    return dateFormat;
  }

  dateDbFormat(date) {
    // console.log("in dataDbFormat", date)
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = year + '-' + month1 + '-' + day;
    // const formattedDate = day + '-' + month1 + '-' + year;
    // console.log("res", formattedDate)
    return formattedDate;
  }

  sendDate(date) {
    const dateFormat: Date = new Date(date);
    let year = dateFormat.getFullYear();
    let month = Number(dateFormat.getMonth()) + 1;
    let day = dateFormat.getDate().toString();
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result

    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result

    const formattedDate = day + '/' + month1 + '/' + year;
    return formattedDate;

  }
  RemoveAddControls() {
    const controls = this.loanDetailsForm as FormGroup;
    console.log('in remove coontrols', controls);
    console.log('in remove controls', this.productCatCode);

    if (this.productCatCode === 'NCV' || this.productCatCode === 'NC') {

      controls.removeControl('usedVehicleCost');
      controls.removeControl('usedVehModel');
      controls.removeControl('usedVehicleType');
      controls.removeControl('usedVehicleMarginMoney');
      controls.removeControl('usedVehicleLoanAmountReq');
      controls.removeControl('sourceOfVehiclePurchase');
      controls.removeControl('marginMoneySource');
      controls.removeControl('financierName');
      controls.removeControl('coAapplicantAwareMarginMoney');
      controls.removeControl('channelSourceName');
      controls.removeControl('vehicleSeller');
      controls.removeControl('proposedVehicle');
      controls.removeControl('investmentAmount');
      controls.removeControl('marginMoneyBorrowed');
      controls.removeControl('marketValueProposedVehicle');
      controls.removeControl('purchasePrice');
      controls.removeControl('vehicleCondition');
      controls.removeControl('fundsUsage');
      controls.removeControl('earlierVehicleApplication');
      controls.removeControl('othersRemarks');
      controls.removeControl('drivingVehicleEarlier');
      controls.removeControl('vehicleAttachedPlying');
      controls.removeControl('awareDueDateEmiAmount');
      // removing controls for used vehicle asset details
      controls.removeControl('vehicleMake');
      controls.removeControl('modelInYear');
      controls.removeControl('regNo');
      controls.removeControl('regCopVfd');
      controls.removeControl('vehicleHpaNbfc');
      controls.removeControl('engineNumber');
      controls.removeControl('chasisNumber');
      controls.removeControl('permitValidity');
      controls.removeControl('fitnessValidity');
      controls.removeControl('taxValidity');
      controls.removeControl('insuranceCopyVerified');
      controls.removeControl('insuranceValidity');
      controls.removeControl('vehiclePhsicallyVerified');
      controls.removeControl('conditionOfVehicle');
      controls.removeControl('vehicleRoute');
      controls.removeControl('noOfTrips');
      controls.removeControl('amtPerTrip');
      controls.removeControl('selfDrivenOrDriver');
      controls.removeControl('remarks');
      controls.removeControl('vehicleContract');
      controls.removeControl('isPrevExpMatched');

      console.log('in remove controls', controls);

    } else if (this.productCatCode === 'UCV' || this.productCatCode === 'UC') {

      controls.removeControl('newVehicleCost');
      controls.removeControl('newVehModel');
      controls.removeControl('newVehicleType');
      controls.removeControl('newVehicleReqLoanAmount');
      controls.removeControl('newVehicleMarginMoney');

      console.log('in remove controls', controls);

    }

  }

  getPdDetails() {
    console.log('pd version', this.version);

    const data = {

      applicantId: this.applicantId,
      pdVersion: this.version,
    };


    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.newCvDetails = value.ProcessVariables.loanDetailsForNewCv;
        console.log('new cv details', this.newCvDetails);
        this.usedVehicleDetails = value.ProcessVariables.applicableForUsedVehicle;
        // console.log('used vehicle details', this.usedVehicleDetails);
        this.assetDetailsUsedVehicle = value.ProcessVariables.applicableForAssetDetailsUsedVehicle;
        // console.log('asset details used vehilce', this.assetDetailsUsedVehicle);
        // console.log('calling get api ', this.newCvDetails, this.assetDetailsUsedVehicle, this.usedVehicleDetails);

        this.setFormValue();
        if (this.loanDetailsForm.get('regCopVfd') != null) {
          this.regCopyVerified(this.loanDetailsForm.get('regCopVfd').value);
        }
        if (this.loanDetailsForm.get('insuranceCopyVerified') != null) {
          this.insCopyVerified(this.loanDetailsForm.get('insuranceCopyVerified').value);
        }
        if (this.loanDetailsForm.get('vehiclePhsicallyVerified') != null) {
          this.vehCondVerified(this.loanDetailsForm.get('vehiclePhsicallyVerified').value);
        }
      }
    });
  }

  setFormValue() {
    // const loanDetailsModal = this.ddeStoreService.getLoanDetails() || {};
    let newCvModel = null;
    newCvModel = this.newCvDetails || {};
    console.log('new cv model', newCvModel);
    let usedVehicleModel = null;
    usedVehicleModel = this.usedVehicleDetails || {};
    let assetDetailsUsedVehicleModel = null;
    assetDetailsUsedVehicleModel = this.assetDetailsUsedVehicle || {};

    if (this.productCatCode === 'NCV' || this.productCatCode === 'NC') {

      console.log('in value patching', newCvModel);

      this.loanDetailsForm.patchValue({
        // new cv details patching

        newVehicleCost: newCvModel.vehicleCost || '',
        newVehModel: newCvModel.model || '',
        newVehicleType: newCvModel.type || '',
        newVehicleReqLoanAmount: newCvModel.reqLoanAmount || '',
        newVehicleMarginMoney: newCvModel.marginMoney || ''
      });
    } else if (this.productCatCode === 'UCV' || this.productCatCode === 'UC') {

      this.loanDetailsForm.patchValue({
        // used cv details patching
        usedVehicleCost: usedVehicleModel.vehicleCost || '',
        usedVehModel: usedVehicleModel.model || '',
        usedVehicleType: usedVehicleModel.type || '',
        usedVehicleMarginMoney: usedVehicleModel.marginMoney || '',
        usedVehicleLoanAmountReq: usedVehicleModel.usedVehicleLoanAmountReq || '',
        sourceOfVehiclePurchase: usedVehicleModel.sourceOfVehiclePurchase || '',
        marginMoneySource: usedVehicleModel.marginMoneySource || '',
        financierName: usedVehicleModel.financierName || '',
        coAapplicantAwareMarginMoney: usedVehicleModel.coAapplicantAwareMarginMoney || '',
        channelSourceName: usedVehicleModel.channelSourceName || '',
        vehicleSeller: usedVehicleModel.vehicleSeller || '',
        proposedVehicle: usedVehicleModel.proposedVehicle || '',
        investmentAmount: usedVehicleModel.investmentAmount || '',
        marginMoneyBorrowed: usedVehicleModel.marginMoneyBorrowed || '',
        marketValueProposedVehicle: usedVehicleModel.marketValueProposedVehicle || '',
        purchasePrice: usedVehicleModel.purchasePrice || '',
        vehicleCondition: usedVehicleModel.vehicleCondition || '',
        fundsUsage: usedVehicleModel.fundsUsage || '',
        earlierVehicleApplication: usedVehicleModel.earlierVehicleApplication || '',
        othersRemarks: usedVehicleModel.othersRemarks || '',
        drivingVehicleEarlier: usedVehicleModel.drivingVehicleEarlier || '',
        vehicleAttachedPlying: usedVehicleModel.vehicleAttachedPlying || '',
        awareDueDateEmiAmount: usedVehicleModel.awareDueDateEmiAmount || '',
        vehicleContract: usedVehicleModel.vehicleContractKey || '',

        // asset Details for used vehicle values patching

        vehicleMake: assetDetailsUsedVehicleModel.vehicleMake || '',
        modelInYear: assetDetailsUsedVehicleModel.modelInYear || '',
        regNo: assetDetailsUsedVehicleModel.regNo || '',
        regCopyVerified: assetDetailsUsedVehicleModel.regCopVfd || '',
        vehicleHpaNbfc: assetDetailsUsedVehicleModel.vehicleHpaNbfc || '',
        regCopVfd: assetDetailsUsedVehicleModel.regCopVfd || '',
        engineNumber: assetDetailsUsedVehicleModel.engineNumber || '',
        chasisNumber: assetDetailsUsedVehicleModel.chasisNumber || '',

        // permitValidity: assetDetailsUsedVehicleModel.permitValidity,
        permitValidity: assetDetailsUsedVehicleModel.permitValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.permitValidity)) : '',
        // fitnessValidity: assetDetailsUsedVehicleModel.fitnessValidity,
        fitnessValidity: assetDetailsUsedVehicleModel.fitnessValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.fitnessValidity)) : '',
        // taxValidity: assetDetailsUsedVehicleModel.taxValidity,
        taxValidity: assetDetailsUsedVehicleModel.taxValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.taxValidity)) : '',
        insuranceCopyVerified: assetDetailsUsedVehicleModel.insuranceCopyVerified,
        // insuranceValidity: assetDetailsUsedVehicleModel.insuranceValidity,
        insuranceValidity: assetDetailsUsedVehicleModel.insuranceValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.insuranceValidity)) : '',
        vehiclePhsicallyVerified: assetDetailsUsedVehicleModel.vehiclePhsicallyVerified || '',
        conditionOfVehicle: assetDetailsUsedVehicleModel.conditionOfVehicle || '',
        vehicleRoute: assetDetailsUsedVehicleModel.vehicleRoute || '',
        noOfTrips: assetDetailsUsedVehicleModel.noOfTrips || '',
        amtPerTrip: assetDetailsUsedVehicleModel.amtPerTrip || '',
        selfDrivenOrDriver: assetDetailsUsedVehicleModel.selfDrivenOrDriver || '',
        remarks: assetDetailsUsedVehicleModel.remarks || '',
        isPrevExpMatched: assetDetailsUsedVehicleModel.isPrevExpMatched || ''
      });
      console.log('loan form', this.loanDetailsForm);
      if (this.loanDetailsForm.get('regCopyVerified') != null &&
        this.loanDetailsForm.get('insuranceCopyVerified') != null) {
        this.regCopyVerified(this.loanDetailsForm.get('regCopyVerified').value);
        this.insCopyVerified(this.loanDetailsForm.get('insuranceCopyVerified').value);
      }

    }
  }


  // // method for approving pd report

  // approvePd() {
  //   const data = {
  //     applicantId: this.applicantId,
  //     // applicantId: 1,
  //     userId: this.userId
  //   }
  //   this.personalDiscussion.approvePd(data).subscribe((res: any) => {
  //     const processVariables = res.ProcessVariables;
  //     console.log("response approve pd", processVariables)
  //     const message = processVariables.error.message
  //     if (processVariables.error.code === '0') {

  //       this.toasterService.showSuccess("pd report approved successfully", '')
  //       this.router.navigate([`/pages/dde/${this.leadId}/pd-report`]);
  //     }
  //     else {
  //       this.toasterService.showError("", 'message')

  //     }
  //   })

  // }
  // // method for re-initating pd report

  // reinitiatePd() {
  //   const data = {
  //     applicantId: this.applicantId,
  //     // applicantId: 1,
  //     userId: this.userId
  //   }
  //   this.personalDiscussion.reinitiatePd(data).subscribe((res: any) => {
  //     const processVariables = res.ProcessVariables;
  //     console.log("response reinitiate pd", processVariables)
  //     const message = processVariables.error.message
  //     if (processVariables.error.code === '0') {

  //       this.toasterService.showSuccess("pd report reinitiated successfully", '')
  //       this.router.navigate([`/pages/dde/${this.leadId}/pd-report`]);
  //     }
  //     else {
  //       this.toasterService.showError("", 'message')

  //     }
  //   })



  // }

  onFormSubmit(action) {
    const formModal = this.loanDetailsForm.value;
    this.isDirty = true;
    console.log(this.loanDetailsForm.controls);
    // working fine now i think
    if (this.loanDetailsForm.invalid) {
      this.toasterService.showWarning('please enter required details', '');
      console.log(this.loanDetailsForm, 'Loan Form');
      return;
    }
    const loanDetailsModal = { ...formModal };
    console.log('form data', loanDetailsModal);
    console.log('form data', this.newCvDetails);
    // this.ddeStoreService.setLoanDetails(loanDetailsModal);
    // this.router.navigate(['/pages/dde']);
    if (this.productCatCode === 'NCV' || this.productCatCode === 'NC') {

      console.log('in new vehicle submit pd');
      this.newCvDetails = {

        // new vehicle

        vehicleCost: loanDetailsModal.newVehicleCost,
        model: loanDetailsModal.newVehModel,
        // model: loanDetailsModal.newVehicleType, // sending the model and type as same becoz there
        // is no lov for model
        type: loanDetailsModal.newVehicleType,
        reqLoanAmount: loanDetailsModal.newVehicleReqLoanAmount,
        marginMoney: loanDetailsModal.newVehicleMarginMoney,
      };
      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        loanDetailsForNewCv: this.newCvDetails,
        // applicableForAssetDetailsUsedVehicle: this.assetDetailsUsedVehicle,
        // applicableForUsedVehicle: this.usedVehicleDetails,

      };
      this.personalDiscussion.savePdData(data).subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        if (processVariables.error.code === '0') {
          const message = processVariables.error.message;
          console.log('PD Status', message);
          console.log('response loan details', value.ProcessVariables);
          this.toasterService.showSuccess('Record Saved Successfully', '');
          this.getPdDetails();

        } else {
          console.log('error', processVariables.error.message);
          this.toasterService.showError('invalid loan details', 'message');
        }
      });



    } else if (this.productCatCode === 'UCV' || this.productCatCode === 'UC') {

      console.log('in used vehicle submit pd');

      // used  vehicle details

      this.usedVehicleDetails = {

        vehicleCost: loanDetailsModal.usedVehicleCost,
        model: loanDetailsModal.usedVehModel,
        // model: loanDetailsModal.usedVehicleType, // sending model and type as same to backend
        type: loanDetailsModal.usedVehicleType,
        // reqLoanAmount: loanDetailsModal.reqLoanAmount,
        marginMoney: loanDetailsModal.usedVehicleMarginMoney,
        usedVehicleLoanAmountReq: loanDetailsModal.usedVehicleLoanAmountReq,
        sourceOfVehiclePurchase: loanDetailsModal.sourceOfVehiclePurchase,
        marginMoneySource: loanDetailsModal.marginMoneySource,
        financierName: loanDetailsModal.financierName,
        coAapplicantAwareMarginMoney: loanDetailsModal.coAapplicantAwareMarginMoney,
        channelSourceName: loanDetailsModal.channelSourceName,
        vehicleSeller: loanDetailsModal.vehicleSeller,
        proposedVehicle: loanDetailsModal.proposedVehicle,
        investmentAmount: loanDetailsModal.investmentAmount,
        marginMoneyBorrowed: loanDetailsModal.marginMoneyBorrowed,
        marketValueProposedVehicle: loanDetailsModal.marketValueProposedVehicle,
        purchasePrice: loanDetailsModal.purchasePrice,
        vehicleCondition: loanDetailsModal.vehicleCondition,
        fundsUsage: loanDetailsModal.fundsUsage,
        earlierVehicleApplication: loanDetailsModal.earlierVehicleApplication,
        othersRemarks: loanDetailsModal.othersRemarks,
        drivingVehicleEarlier: loanDetailsModal.drivingVehicleEarlier,
        vehicleAttachedPlying: loanDetailsModal.vehicleAttachedPlying,
        awareDueDateEmiAmount: loanDetailsModal.awareDueDateEmiAmount,
        vehicleContract: loanDetailsModal.vehicleContract,
      };

      // for assetDetails used vehicle

      this.assetDetailsUsedVehicle = {

        vehicleMake: loanDetailsModal.vehicleMake,
        modelInYear: loanDetailsModal.modelInYear,
        regNo: loanDetailsModal.regNo,
        regCopVfd: loanDetailsModal.regCopVfd,
        vehicleHpaNbfc: loanDetailsModal.vehicleHpaNbfc,
        engineNumber: loanDetailsModal.engineNumber,
        chasisNumber: loanDetailsModal.chasisNumber,
        // permitValidity: loanDetailsModal.permitValidity,
        permitValidity: this.sendDate(loanDetailsModal.permitValidity),
        fitnessValidity: this.sendDate(loanDetailsModal.fitnessValidity),
        taxValidity: this.sendDate(loanDetailsModal.taxValidity),
        insuranceCopyVerified: loanDetailsModal.insuranceCopyVerified,
        insuranceValidity: this.sendDate(loanDetailsModal.insuranceValidity),
        vehiclePhsicallyVerified: loanDetailsModal.vehiclePhsicallyVerified,
        conditionOfVehicle: loanDetailsModal.conditionOfVehicle,
        vehicleRoute: loanDetailsModal.vehicleRoute,
        noOfTrips: loanDetailsModal.noOfTrips,
        amtPerTrip: loanDetailsModal.amtPerTrip,
        selfDrivenOrDriver: loanDetailsModal.selfDrivenOrDriver,
        isPrevExpMatched: loanDetailsModal.isPrevExpMatched,
        remarks: loanDetailsModal.remarks
      };
      if (this.insuranceStatus !== '1') {
        // tslint:disable-next-line: max-line-length
        delete this.assetDetailsUsedVehicle['insuranceValidity']; // based on insuranceCopyVerified condition this validity field will exists
      }
      console.log('asset details', this.assetDetailsUsedVehicle);


      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        // loanDetailsForNewCv: this.newCvDetails,
        applicableForAssetDetailsUsedVehicle: this.assetDetailsUsedVehicle,
        applicableForUsedVehicle: this.usedVehicleDetails,

      };
      console.log('used vehicle data in request', this.usedVehicleDetails);

      this.personalDiscussion.savePdData(data).subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        const message = processVariables.error.message;
        if (processVariables.error.code === '0') {
          console.log('PD Status', message);
          console.log('response loan details', value.ProcessVariables);
          this.toasterService.showSuccess('Record Saved Successfully', '');
          if (action === 'save') {

            this.getPdDetails();

          } else if (action === 'next') {
            this.onNavigateNext();
          }

        } else {
          console.log('error', processVariables.error.message);
          this.toasterService.showError(message, 'message');
        }
      });


    }
  }

  onNavigateToPdSummary() {


    this.router.navigate([`/pages/dashboard`]);

  }
  onNavigateNext() {
    if (this.version != 'undefined') {

      // tslint:disable-next-line: max-line-length
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/reference-check/${this.version}`]);

    } else {

      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/reference-check`]);

    }
  }

  onNavigateBack() {
    if (this.version != 'undefined') {
      console.log('in routing defined version condition', this.version);
      // tslint:disable-next-line: max-line-length
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/customer-profile/${this.version}`]);

    } else {
      console.log('in routing undefined version condition', this.version);
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/customer-profile`]);

    }
  }


}
