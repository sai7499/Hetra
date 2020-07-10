import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoanDetails } from '@model/dde.model';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { PdDataService } from '../pd-data.service';
import { valHooks } from 'jquery';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

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



  constructor(private labelsData: LabelsService,
    private _fb: FormBuilder,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private personalDiscussion: PersonalDiscussionService,
    private pdDataService: PdDataService,
    private toasterService: ToasterService,
    public sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService) {
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
    console.log("this user roleType", this.roleType)

    // console.log("user id ==>", this.userId)

    // this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.getLOV();
    this.getPdDetails()
    this.RemoveAddControls()
    this.getPdStatus()
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.loanDetailsLov = value ? value[0].loanDetail[0] : {};

    });


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
      this.getLeadSectionData()
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
    console.log("in get lead section data", data)

    const leadDetailsFromLead = data['leadDetails']

    // this.applicantFullName = applicantDetailsFromLead['fullName']
    // this.mobileNo = applicantDetailsFromLead['mobileNumber']
    // console.log("in lead section data", this.applicantFullName, this.mobileNo)
    this.reqLoanAmount = leadDetailsFromLead.reqLoanAmt;
    this.productCatCode = leadDetailsFromLead.productCatCode
    console.log("in lead section data", leadDetailsFromLead)
    console.log("prod cat code", this.productCatCode)
    console.log("req loan amount", this.reqLoanAmount)
  }
  getPdStatus() {
    this.sharedService.pdStatus$.subscribe((value: any) => {

      console.log("in get pd status", value)
    })
  }

  initForm() {

    // controls for new vehicle

    this.loanDetailsForm = new FormGroup({
      newVehicleCost: new FormControl(''),
      newVehicleModel: new FormControl(''),
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
      sourceOfVehiclePurchase: new FormControl('', Validators.compose([Validators.maxLength(40), Validators.pattern(/^[a-zA-Z ]*$/), Validators.required])),
      // marginMoneySource: new FormControl(''),
      marginMoneySource: new FormControl('', Validators.compose([Validators.maxLength(40), Validators.pattern(/^[a-zA-Z ]*$/), Validators.required])),
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
      othersRemarks: new FormControl('', Validators.compose([Validators.maxLength(200), Validators.pattern(/^[a-zA-Z .-]*$/), Validators.required])),
      // othersRemarks: new FormControl(''),
      drivingVehicleEarlier: new FormControl(''),
      vehicleAttachedPlying: new FormControl(''),
      awareDueDateEmiAmount: new FormControl(''),

      // controls for used vehicle asset details

      vehicleMake: new FormControl(''),
      modelInYear: new FormControl(''),
      regNo: new FormControl(''),
      regCopVfd: new FormControl(''),
      vehicleHpaNbfc: new FormControl(''),
      engineNumber: new FormControl(''),
      chasisNumber: new FormControl(''),
      permitValidity: new FormControl('', Validators.compose([Validators.required])),
      fitnessValidity: new FormControl('', Validators.compose([Validators.required])),
      taxValidity: new FormControl('', Validators.compose([Validators.required])),
      insuranceCopyVerified: new FormControl(''),
      insuranceValidity: new FormControl('', Validators.compose([Validators.required])),
      vehiclePhsicallyVerified: new FormControl(''),
      conditionOfVehicle: new FormControl(''),
      vehicleRoute: new FormControl(''),
      noOfTrips: new FormControl(''),
      amtPerTrip: new FormControl(''),
      selfDrivenOrDriver: new FormControl(''),
      // remarks: new FormControl('')
      remarks: new FormControl('', Validators.compose([Validators.maxLength(200), Validators.pattern(/^[a-zA-Z ,-]*$/), Validators.required])),
    })
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

    const formattedDate = day + "/" + month1 + "/" + year;
    return formattedDate;

  }
  RemoveAddControls() {
    const controls = this.loanDetailsForm as FormGroup
    console.log("in remove coontrols", controls)
    console.log("in remove controls", this.productCatCode)

    if (this.productCatCode === 'NCV' || this.productCatCode === 'NC') {

      controls.removeControl('usedVehicleCost')
      controls.removeControl('usedVehModel')
      controls.removeControl('usedVehicleType')
      controls.removeControl('usedVehicleMarginMoney')
      controls.removeControl('usedVehicleLoanAmountReq')
      controls.removeControl('sourceOfVehiclePurchase')
      controls.removeControl('marginMoneySource')
      controls.removeControl('financierName')
      controls.removeControl('coAapplicantAwareMarginMoney')
      controls.removeControl('channelSourceName')
      controls.removeControl('vehicleSeller')
      controls.removeControl('proposedVehicle')
      controls.removeControl('investmentAmount')
      controls.removeControl('marginMoneyBorrowed')
      controls.removeControl('marketValueProposedVehicle')
      controls.removeControl('purchasePrice')
      controls.removeControl('vehicleCondition')
      controls.removeControl('fundsUsage')
      controls.removeControl('earlierVehicleApplication')
      controls.removeControl('othersRemarks')
      controls.removeControl('drivingVehicleEarlier')
      controls.removeControl('vehicleAttachedPlying')
      controls.removeControl('awareDueDateEmiAmount')
      // removing controls for used vehicle asset details
      controls.removeControl('vehicleMake')
      controls.removeControl('modelInYear')
      controls.removeControl('regNo')
      controls.removeControl('regCopVfd')
      controls.removeControl('vehicleHpaNbfc')
      controls.removeControl('engineNumber')
      controls.removeControl('chasisNumber')
      controls.removeControl('permitValidity')
      controls.removeControl('fitnessValidity')
      controls.removeControl('taxValidity')
      controls.removeControl('insuranceCopyVerified')
      controls.removeControl('insuranceValidity')
      controls.removeControl('vehiclePhsicallyVerified')
      controls.removeControl('conditionOfVehicle')
      controls.removeControl('vehicleRoute')
      controls.removeControl('noOfTrips')
      controls.removeControl('amtPerTrip')
      controls.removeControl('selfDrivenOrDriver')
      controls.removeControl('remarks')

      console.log("in remove controls", controls)

    }
    else if (this.productCatCode === 'UCV' || this.productCatCode === 'UC') {

      controls.removeControl('newVehicleCost')
      controls.removeControl('newVehicleModel')
      controls.removeControl('newVehicleType')
      controls.removeControl('newVehicleReqLoanAmount')
      controls.removeControl('newVehicleMarginMoney')

      console.log("in remove controls", controls)

    }

  }

  getPdDetails() {
    console.log("pd version", this.version)

    const data = {

      applicantId: this.applicantId,
      pdVersion: this.version,
    }


    this.personalDiscussion.getPdData(this.data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.newCvDetails = value.ProcessVariables.loanDetailsForNewCv;
        // console.log("new cv details", this.newCvDetails)
        this.usedVehicleDetails = value.ProcessVariables.applicableForUsedVehicle;
        console.log("used vehicle details", this.usedVehicleDetails)
        this.assetDetailsUsedVehicle = value.ProcessVariables.applicableForAssetDetailsUsedVehicle
        console.log("asset details used vehilce", this.assetDetailsUsedVehicle)
        // console.log('calling get api ', this.newCvDetails, this.assetDetailsUsedVehicle, this.usedVehicleDetails);

        this.setFormValue();
        // if (this.loanDetails) {
        // this.setFormValue()
        // this.pdDataService.setLoanDetails(this.loanDetails)
      }
    });
  }
  onNavigateToPdSummary() {


    this.router.navigate([`/pages/dashboard/personal-discussion/my-pd-tasks`]);

  }
  onNavigateNext() {
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/reference-check/${this.version}`]);

    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/reference-check`]);
      // this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/loan-details/${this.applicantId}/${this.version}`]);

    }
  }

  onNavigateBack() {
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/customer-profile/${this.version}`]);

    } else {

      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/customer-profile`]);

    }
  }

  setFormValue() {
    // const loanDetailsModal = this.ddeStoreService.getLoanDetails() || {};

    const newCvModel = this.newCvDetails || {};
    console.log("new cv model", newCvModel);
    const usedVehicleModel = this.usedVehicleDetails || {};
    const assetDetailsUsedVehicleModel = this.assetDetailsUsedVehicle || {}

    if (this.productCatCode == 'NCV' || this.productCatCode === 'NC') {

      this.loanDetailsForm.patchValue({
        // new cv details patching
        newVehicleCost: newCvModel.vehicleCost || '',
        newVehicleModel: newCvModel.model || '',
        newVehicleType: newCvModel.type || '',
        newVehicleReqLoanAmount: newCvModel.reqLoanAmount || '',
        newVehicleMarginMoney: newCvModel.marginMoney || ''
      })
    }
    else if (this.productCatCode == 'UCV' || this.productCatCode === 'UC') {

      this.loanDetailsForm.patchValue({
        // used cv details patching
        usedVehicleCost: usedVehicleModel.vehicleCost ? usedVehicleModel.vehicleCost : '0',
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
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.permitValidity)) : "",
        // fitnessValidity: assetDetailsUsedVehicleModel.fitnessValidity,
        fitnessValidity: assetDetailsUsedVehicleModel.fitnessValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.fitnessValidity)) : "",
        // taxValidity: assetDetailsUsedVehicleModel.taxValidity,
        taxValidity: assetDetailsUsedVehicleModel.taxValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.taxValidity)) : "",
        insuranceCopyVerified: assetDetailsUsedVehicleModel.insuranceCopyVerified,
        // insuranceValidity: assetDetailsUsedVehicleModel.insuranceValidity,
        insuranceValidity: assetDetailsUsedVehicleModel.insuranceValidity ?
          new Date(this.getDateFormat(assetDetailsUsedVehicleModel.insuranceValidity)) : "",
        vehiclePhsicallyVerified: assetDetailsUsedVehicleModel.vehiclePhsicallyVerified || '',
        conditionOfVehicle: assetDetailsUsedVehicleModel.conditionOfVehicle || '',
        vehicleRoute: assetDetailsUsedVehicleModel.vehicleRoute || '',
        noOfTrips: assetDetailsUsedVehicleModel.noOfTrips || '',
        amtPerTrip: assetDetailsUsedVehicleModel.amtPerTrip || '',
        selfDrivenOrDriver: assetDetailsUsedVehicleModel.selfDrivenOrDriver || '',
        remarks: assetDetailsUsedVehicleModel.remarks || ''
      });
      console.log("loan form", this.loanDetailsForm)
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

  onFormSubmit() {
    const formModal = this.loanDetailsForm.value;
    this.isDirty = true;
    console.log(this.loanDetailsForm.controls)
    // working fine now i think
    if (this.loanDetailsForm.invalid) {
      console.log(this.loanDetailsForm)
      return
    }
    const loanDetailsModal = { ...formModal };
    console.log("form data", loanDetailsModal)
    console.log("form data", this.newCvDetails)
    // this.ddeStoreService.setLoanDetails(loanDetailsModal);
    // this.router.navigate(['/pages/dde']);
    if (this.productCatCode === 'NCV' || this.productCatCode === 'NC') {

      console.log("in new vehicle submit pd")
      this.newCvDetails = {

        // new vehicle

        vehicleCost: loanDetailsModal.newVehicleCost,
        model: loanDetailsModal.newVehicleModel,
        // model: loanDetailsModal.newVehicleType, // sending the model and type as same becoz there 
        // is no lov for model
        type: loanDetailsModal.newVehicleType,
        reqLoanAmount: loanDetailsModal.newVehicleReqLoanAmount,
        marginMoney: loanDetailsModal.newVehicleMarginMoney,
      }
      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        loanDetailsForNewCv: this.newCvDetails,
        // applicableForAssetDetailsUsedVehicle: this.assetDetailsUsedVehicle,
        // applicableForUsedVehicle: this.usedVehicleDetails,

      }
      this.personalDiscussion.savePdData(data).subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        if (processVariables.error.code === '0') {
          const message = processVariables.error.message;
          console.log('PD Status', message);
          console.log("response loan details", value.ProcessVariables)
          this.toasterService.showSuccess("new cv loan details saved successfully!", '')
        }
        else {
          console.log("error", processVariables.error.message);
          this.toasterService.showError("invalid loan details", 'message')
        }
      });



    }
    else if (this.productCatCode === 'UCV' || this.productCatCode === 'UC') {

      console.log("in used vehicle submit pd")

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
      }

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
        remarks: loanDetailsModal.remarks
      };

      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        // loanDetailsForNewCv: this.newCvDetails,
        applicableForAssetDetailsUsedVehicle: this.assetDetailsUsedVehicle,
        applicableForUsedVehicle: this.usedVehicleDetails,

      }
      console.log("used vehicle data in request", this.usedVehicleDetails)

      this.personalDiscussion.savePdData(data).subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        if (processVariables.error.code === '0') {
          const message = processVariables.error.message;
          console.log('PD Status', message);
          console.log("response loan details", value.ProcessVariables)
          this.toasterService.showSuccess(" used vehicle loan details saved successfully!", '')
        }
        else {
          console.log("error", processVariables.error.message);
          this.toasterService.showError("invalid loan details", 'message')
        }
      });


    }
  }

}
