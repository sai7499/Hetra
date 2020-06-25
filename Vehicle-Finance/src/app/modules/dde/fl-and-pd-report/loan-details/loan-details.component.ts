import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private personalDiscussion: PersonalDiscussionService,
    private pdDataService: PdDataService,
    private toasterService: ToasterService) { }

  ngOnInit() {

    // accessing lead id from route

    // this.leadId = (await this.getLeadId()) as number;
    // console.log("leadID =>", this.leadId)

    // method for getting all vehicle details related to a lead

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;

    // console.log("user id ==>", this.userId)

    this.initForm();

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
    // console.log('LOVs', this.LOV);
  }

  initForm() {
    this.loanDetailsForm = new FormGroup({
      vehicleCost: new FormControl(''),
      model: new FormControl(''),
      reqLoanAmount: new FormControl(''),
      marginMoney: new FormControl(''),
      usedVehicleLoanAmountReq: new FormControl(''),
      sourceOfVehiclePurchase: new FormControl(''),
      marginMoneySource: new FormControl(''),
      financierName: new FormControl(''),
      coAapplicantAwareMarginMoney: new FormControl(''),
      channelSourceName: new FormControl(''),
      vehicleSeller: new FormControl(''),
      proposedVehicle: new FormControl(''),
      invesmentAmount: new FormControl(''),
      marginMoneyBorrowed: new FormControl(''),
      marketValueProposedVehicle: new FormControl(''),
      purchasePrice: new FormControl(''),
      vehicleCondition: new FormControl(''),
      fundsUsage: new FormControl(''),
      earlierVehicleApplication: new FormControl(''),
      othersRemarks: new FormControl(''),
      drivingVehicleEarlier: new FormControl(''),
      vehicleAttachedPlying: new FormControl(''),
      awareDueDateEmiAmount: new FormControl(''),
      vehicleMake: new FormControl(''),
      modelInYear: new FormControl(''),
      regNo: new FormControl(''),
      regCopVfd: new FormControl(''),
      vehicleHpaNbfc: new FormControl(''),
      engineNumber: new FormControl(''),
      chasisNumber: new FormControl(''),
      permitValidity: new FormControl(''),
      fitnessValidity: new FormControl(''),
      taxValidity: new FormControl(''),
      insuranceCopyVerified: new FormControl(''),
      insuranceValidity: new FormControl(''),
      vehiclePhsicallyVerified: new FormControl(''),
      conditionOfVehicle: new FormControl(''),
      vehicleRoute: new FormControl(''),
      noOfTrips: new FormControl(''),
      amtPerTrip: new FormControl(''),
      selfDrivenOrDriver: new FormControl(''),
      remarks: new FormControl('')
    });
  }
  getPdDetails() {
    const data = {
      applicantId: 6,
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.newCvDetails = value.ProcessVariables.loanDetailsForNewCv;
        // console.log("new cv details", this.newCvDetails)
        this.usedVehicleDetails = value.ProcessVariables.applicableForUsedVehicle;
        // console.log("used vehicle details", this.usedVehicleDetails)
        this.assetDetailsUsedVehicle = value.ProcessVariables.applicableForAssetDetailsUsedVehicle
        // console.log("asset details used vehilce", this.assetDetailsUsedVehicle)
        console.log('calling get api ', this.newCvDetails, this.assetDetailsUsedVehicle, this.usedVehicleDetails);

        this.setFormValue();
        // if (this.loanDetails) {
        // this.setFormValue()
        // this.pdDataService.setLoanDetails(this.loanDetails)
      }
    });
  }

  setFormValue() {
    // const loanDetailsModal = this.ddeStoreService.getLoanDetails() || {};
    const newCvModel = this.newCvDetails || {};
    console.log("new cv model", newCvModel);
    const usedVehicleModel = this.usedVehicleDetails || {};
    const assetDetailsUsedVehicleModel = this.assetDetailsUsedVehicle || {}

    this.loanDetailsForm.patchValue({
      // new cv details patching

      vehicleCost: newCvModel.vehicleCost,
      model: newCvModel.model,
      // type: loanDetailsModal.model,
      reqLoanAmount: newCvModel.reqLoanAmount,
      marginMoney: newCvModel.marginMoney,

      // used vehicle details patching
      usedVehicleLoanAmountReq: usedVehicleModel.usedVehicleLoanAmountReq,
      sourceOfVehiclePurchase: usedVehicleModel.sourceOfVehiclePurchase,
      marginMoneySource: usedVehicleModel.marginMoneySource,
      financierName: usedVehicleModel.financierName,
      coAapplicantAwareMarginMoney: usedVehicleModel.coAapplicantAwareMarginMoney,
      channelSourceName: usedVehicleModel.channelSourceName,
      vehicleSeller: usedVehicleModel.vehicleSeller,
      proposedVehicle: usedVehicleModel.proposedVehicle,
      invesmentAmount: usedVehicleModel.invesmentAmount,
      marginMoneyBorrowed: usedVehicleModel.marginMoneyBorrowed,
      marketValueProposedVehicle: usedVehicleModel.marketValueProposedVehicle,
      purchasePrice: usedVehicleModel.purchasePrice,
      vehicleCondition: usedVehicleModel.vehicleCondition,
      fundsUsage: usedVehicleModel.fundsUsage,
      earlierVehicleApplication: usedVehicleModel.earlierVehicleApplication,
      othersRemarks: usedVehicleModel.othersRemarks,
      drivingVehicleEarlier: usedVehicleModel.drivingVehicleEarlier,
      vehicleAttachedPlying: usedVehicleModel.vehicleAttachedPlying,
      awareDueDateEmiAmount: usedVehicleModel.awareDueDateEmiAmount,

      // assedDetails for used vehicle values patching

      vehicleMake: assetDetailsUsedVehicleModel.vehicleMake,
      modelInYear: assetDetailsUsedVehicleModel.modelInYear,
      regNo: assetDetailsUsedVehicleModel.regNo,
      regCopyVerified: assetDetailsUsedVehicleModel.regCopVfd,
      vehicleHpaNbfc: assetDetailsUsedVehicleModel.vehicleHpaNbfc,
      regCopVfd: assetDetailsUsedVehicleModel.regCopVfd,
      engineNumber: assetDetailsUsedVehicleModel.engineNumber,
      chasisNumber: assetDetailsUsedVehicleModel.chasisNumber,
      permitValidity: assetDetailsUsedVehicleModel.permitValidity,
      fitnessValidity: assetDetailsUsedVehicleModel.fitnessValidity,
      taxValidity: assetDetailsUsedVehicleModel.taxValidity,
      insuranceCopyVerified: assetDetailsUsedVehicleModel.insuranceCopyVerified,
      insuranceValidity: assetDetailsUsedVehicleModel.insuranceValidity,
      vehiclePhsicallyVerified: assetDetailsUsedVehicleModel.vehiclePhsicallyVerified,
      conditionOfVehicle: assetDetailsUsedVehicleModel.conditionOfVehicle,
      vehicleRoute: assetDetailsUsedVehicleModel.vehicleRoute,
      noOfTrips: assetDetailsUsedVehicleModel.noOfTrips,
      amtPerTrip: assetDetailsUsedVehicleModel.amtPerTrip,
      selfDrivenOrDriver: assetDetailsUsedVehicleModel.selfDrivenOrDriver,
      remarks: assetDetailsUsedVehicleModel.remarks
    });
  }

  onFormSubmit() {
    const formModal = this.loanDetailsForm.value;
    const loanDetailsModal = { ...formModal };
    console.log("form data", loanDetailsModal)
    // this.ddeStoreService.setLoanDetails(loanDetailsModal);
    // this.router.navigate(['/pages/dde']);

    this.newCvDetails = {

      // new vehicle

      vehicleCost: loanDetailsModal.vehicleCost,
      model: loanDetailsModal.model,
      type: loanDetailsModal.model,
      reqLoanAmount: loanDetailsModal.reqLoanAmount,
      marginMoney: loanDetailsModal.marginMoney,

    }

    // used  vehicle details

    this.usedVehicleDetails = {

      usedVehicleLoanAmountReq: loanDetailsModal.usedVehicleLoanAmountReq,
      sourceOfVehiclePurchase: loanDetailsModal.sourceOfVehiclePurchase,
      marginMoneySource: loanDetailsModal.marginMoneySource,
      financierName: loanDetailsModal.financierName,
      coAapplicantAwareMarginMoney: loanDetailsModal.coAapplicantAwareMarginMoney,
      channelSourceName: loanDetailsModal.channelSourceName,
      vehicleSeller: loanDetailsModal.vehicleSeller,
      proposedVehicle: loanDetailsModal.proposedVehicle,
      invesmentAmount: loanDetailsModal.invesmentAmount,
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
      permitValidity: loanDetailsModal.permitValidity,
      fitnessValidity: loanDetailsModal.fitnessValidity,
      taxValidity: loanDetailsModal.taxValidity,
      insuranceCopyVerified: loanDetailsModal.insuranceCopyVerified,
      insuranceValidity: loanDetailsModal.insuranceValidity,
      vehiclePhsicallyVerified: loanDetailsModal.vehiclePhsicallyVerified,
      conditionOfVehicle: loanDetailsModal.conditionOfVehicle,
      vehicleRoute: loanDetailsModal.vehicleRoute,
      noOfTrips: loanDetailsModal.noOfTrips,
      amtPerTrip: loanDetailsModal.amtPerTrip,
      selfDrivenOrDriver: loanDetailsModal.selfDrivenOrDriver,
      remarks: loanDetailsModal.remarks
    };

    const data = {
      leadId: 1,
      applicantId: 6,
      userId: this.userId,
      loanDetailsForNewCv: this.newCvDetails,
      applicableForAssetDetailsUsedVehicle: this.assetDetailsUsedVehicle,
      applicableForUsedVehicle: this.usedVehicleDetails

    }

    this.personalDiscussion.savePdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        const message = processVariables.error.message;
        console.log('PD Status', message);
        console.log("response loan details", value.ProcessVariables)
        this.toasterService.showSuccess("loan details saved successfully!", '')
      }
    });


  }

}
