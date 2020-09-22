import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators, FormArray } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { DdeStoreService } from '@services/dde-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { ToasterService } from '@services/toaster.service';
import { OtpServiceService } from '@modules/lead-section/services/otp-details.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

@Component({
  selector: 'app-tele-verification-form',
  templateUrl: './tele-verification-form.component.html',
  styleUrls: ['./tele-verification-form.component.css']
})
export class TeleVerificationFormComponent implements OnInit {
  disableSaveBtn: boolean;
  referenceData = [];
  teleVerificationForm: FormGroup;
  otpForm: FormGroup;

  labels: any = {};
  LOV: any = [];
  tvrLov: any = [];
  leadId;
  tvrDetails;
  tvrData: any;
  isAlert: boolean;
  tvrDashboardList: any = [];
  applicantId;
  applicantName: any;
  soName: any;
  dateFormate;
  applicantType: any;
  isDirty: boolean;
  valueChanges: any = {};
  isModal = false;
  referenceNo: any;
  mobileNo: any;
  validationData: any;
  isSaved = false;
  leadDetails: any;
  product: any;
  sourcingChannelDesc: any;
  sourcingTypeDesc: any;
  sourcingCodeDesc: any;
  sourcingCode: any;
  changeLabelsForProposed: any;
  changeLabelsForRoute: any;
  changeLabelsForGoods: any;
  userName: any;
  mobileNumber: any;
  tenure: any;
  assetCost: any;
  eCode: string;

  public dateValue: Date = new Date(2, 10, 2000);
  public toDayDate: Date = new Date();
  public time: any = new Date(new Date().getTime()).toLocaleTimeString();


  @ViewChild('closeModal', { static: false }) public closeModal: ElementRef;

  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Characters not allowed'
    }
  };

  constructor(
    private fb: FormBuilder,
    // private labelDetails: LabelsService,
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private ddeStoreService: DdeStoreService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private tvrService: TvrDetailsService,
    private toasterService: ToasterService,
    private otpService: OtpServiceService,
    private loginStoreService: LoginStoreService,
    private toggleDdeService: ToggleDdeService,
    private vehicleStoreService: VehicleDataStoreService

  ) {

    this.getLOV();

    this.leadId = this.route.snapshot.params.leadId;
    console.log(this.leadId);
    // tslint:disable-next-line: radix
    this.applicantId = parseInt(this.route.snapshot.params.applicantId);
    this.applicantType = this.route.snapshot.params.applicantType;
    this.leadDetails = this.route.snapshot.data.leadData;
    this.product = this.leadDetails.ProcessVariables.leadDetails.assetProdutName;
    this.tenure = this.leadDetails.ProcessVariables.leadDetails.reqTenure;

    // calculating asset cost
    const vehicleCost = this.leadDetails.ProcessVariables.vehicleCollateral;
    const sum = a => a.reduce((x, y) => x + y);
    this.assetCost = vehicleCost ? sum(vehicleCost.map(x => Number(x.finalAssetCost))) : '';

    if (this.applicantType === 'Applicant') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[0].mobileNumber;
    } else if (this.applicantType === 'Co-Applicant' || this.applicantType === 'Guarantor') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[1].mobileNumber;
    } else if (this.applicantType === 'Guarantor' || this.applicantType === 'Co-Applicant') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[2].mobileNumber;
    } else if (this.applicantType === 'Guarantor' || this.applicantType === 'Co-Applicant') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[3].mobileNumber;
    } else if (this.applicantType === 'Guarantor' || this.applicantType === 'Co-Applicant') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[4].mobileNumber;
    } else if (this.applicantType === 'Guarantor' || this.applicantType === 'Co-Applicant') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[5].mobileNumber;
    } else if (this.applicantType === 'Guarantor' || this.applicantType === 'Co-Applicant') {
      this.mobileNumber = this.leadDetails.ProcessVariables.applicantDetails[6].mobileNumber;
    }

    this.sourcingChannelDesc = this.leadDetails.ProcessVariables.leadDetails.sourcingChannelDesc;
    this.sourcingTypeDesc = this.leadDetails.ProcessVariables.leadDetails.sourcingTypeDesc;
    this.sourcingCodeDesc = this.leadDetails.ProcessVariables.leadDetails.sourcingCodeDesc;

    this.sourcingCode = this.sourcingCodeDesc !== '-' ? `- ${this.sourcingCodeDesc}` : '';

  }


  // InitForm for TVR
  initForm() {
    this.referenceData = this.referenceData || [];
    this.teleVerificationForm = this.fb.group({
      leadId: [{ value: this.leadId, disabled: true }],
      applicantName: [{ value: this.applicantName, disabled: true }],
      soName: [{ value: this.soName, disabled: true }],
      assetCost: [''],
      assetType: ['', Validators.required],
      financeAmt: ['', Validators.required],
      tenureInMonth: [''],
      srcOfProposal: [''],
      referredBy: ['', Validators.required],
      product: [''],
      emi: ['', Validators.required],
      ndForProposedVehicle: ['', Validators.required],
      route: ['', Validators.required],
      contractDetails: ['', Validators.required],
      typeOfGoods: [{ value: '', disabled: true }],
      amountRequested: ['', Validators.required],
      fundEndUse: ['', Validators.required],
      tenureRequested: ['', Validators.required],
      otherVehiclesOwned: ['', Validators.required],
      residentPhnNo: [''],
      residentAddress: ['', Validators.required],
      otherLoans: ['', Validators.required],
      otherLoanEmi: ['', Validators.required],
      otherLoanNoOfEmi: ['', Validators.required],
      residentNoOfYrs: ['', Validators.required],
      cc: ['', Validators.required],
      tvrStatus: ['', Validators.required],
      dob: ['', Validators.required],
      spokenTo: ['', Validators.required],
      familyMembers: ['', Validators.required],
      relationShip: ['', Validators.required],
      tvrDate: [''],
      tvrTime: [''],
      addressConfirmed: ['', Validators.required],
      residenceStabilityConfirmed: ['', Validators.required],
      customerAvailabilty: ['', Validators.required],
      tvrDoneBy: [''],
      eCode: [''],
      wrkExperience: ['', Validators.required],
      officePhnNo: [''],
      officePhnExt: ['', Validators.required],
      wrkStability: ['', Validators.required],
      natureOfBusiness: ['', Validators.required],
      typeOfTransaction: ['', Validators.required],
      businessStability: ['', Validators.required],
      compNameAddress: ['', Validators.required],
      designation: ['', Validators.required],
      industryType: [{ value: '', disabled: true }],
      yrsInEmployment: ['', Validators.required],
      ifBusiness: ['', Validators.required],
      employees: ['', Validators.required],
      monthlyGrossSalary: ['', Validators.required],
      otherIncome: ['', Validators.required],
      decision: ['', Validators.required],
      cibilOverDue: ['', Validators.required],
      cibilClarification: ['', Validators.required],
      remarks: ['', Validators.required],
      applicationReferences: this.fb.group({
        reference1: this.fb.group({
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 0 && this.referenceData[0].referenceId ? this.referenceData[0].referenceId : 0,
          firstName: [this.referenceData.length > 0 && this.referenceData[0].firstName ? this.referenceData[0].firstName : ''],
          mobileNo: [this.referenceData.length > 0 && this.referenceData[0].mobileNo ? this.referenceData[0].mobileNo : ''],
          address: [this.referenceData.length > 0 && this.referenceData[0].address ? this.referenceData[0].address : ''],
          // tslint:disable-next-line: max-line-length
          referenceStatus: [this.referenceData.length > 0 && this.referenceData[0].referenceStatus ? this.referenceData[0].referenceStatus : '']
        }),
        reference2: this.fb.group({
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 1 && this.referenceData[1].referenceId ? this.referenceData[1].referenceId : 0,
          firstName: [this.referenceData.length > 1 && this.referenceData[1].firstName ? this.referenceData[1].firstName : ''],
          mobileNo: [this.referenceData.length > 1 && this.referenceData[1].mobileNo ? this.referenceData[1].mobileNo : ''],
          address: [this.referenceData.length > 1 && this.referenceData[1].address ? this.referenceData[1].address : ''],
          // tslint:disable-next-line: max-line-length
          referenceStatus: [this.referenceData.length > 1 && this.referenceData[1].referenceStatus ? this.referenceData[1].referenceStatus : '']
        })
      })
    });

  }

  get teleVerificationFormControls() { return this.teleVerificationForm.controls; }

  // ------NgOnInit-------
  ngOnInit() {

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.userName = value.userName;
    });
    this.eCode = localStorage.getItem('userId');
    console.log('E Code', this.eCode);

    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
      if (this.product === 'Used Car' || this.product === 'New Car') {
        this.changeLabelsForProposed = this.labels.needForProposedVehicle;
        this.changeLabelsForRoute = this.labels.routeOfOperation;
        this.changeLabelsForGoods = this.labels.typeofGoodsCarried;
      } else {
        this.changeLabelsForProposed = this.labels.needForProposedVehicle + '(applicable for CV)';
        this.changeLabelsForRoute = this.labels.routeOfOperation + '(applicable for CV)';
        this.changeLabelsForGoods = this.labels.typeofGoodsCarried + '(applicable for CV)';
      }

    });

    this.getTvrDetails();
    this.initForm();

    // OTP Reactive form controls
    this.otpForm = this.fb.group({
      otp: [
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('[0-9]*'),
          Validators.required,
        ]),
      ],
    });

  }

  getLOV() {
    this.commonLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
    this.valueChanges = this.LOV.LOVS || [];
  }


  // Date function for TVR Form
  dateFunction(newDate) {
    const newDateFormat = newDate.split('/');
    return new Date(newDateFormat[2], newDateFormat[1] - 1, newDateFormat[0]);
  }

  dateToFormate(date) {
    return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
  }


  // Getting TVR Detaails API method
  getTvrDetails() {

    const data = {
      applicantId: this.applicantId
    };
    this.tvrService.getTvrDetails(data).subscribe((res: any) => {
      this.applicantName = res.ProcessVariables.applicantName;
      this.soName = res.ProcessVariables.soName;
      // this.leadId = res.ProcessVariables.leadId;
      this.tvrData = res.ProcessVariables.tvr;
      this.referenceData = res.ProcessVariables.applicationReferences ? res.ProcessVariables.applicationReferences : [];
      // this.dateFormate = res.ProcessVariables.tvr.dob;
      // const financeAmt = this.tvrData.financeAmt ? this.tvrData.financeAmt.toString() : '';
      const tvr = { ...this.tvrData };
      tvr.dob = this.tvrData && this.tvrData.dob ? this.dateFunction(this.tvrData.dob) : '';
      tvr.tvrDate = this.tvrData && this.tvrData.tvrDate ? this.dateFunction(this.tvrData.tvrDate) : '';
      const applicationReferences = {
        reference1: {
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 0 && this.referenceData[0].referenceId ? this.referenceData[0].referenceId : 0,
          firstName: this.referenceData.length > 0 && this.referenceData[0].firstName ? this.referenceData[0].firstName : '',
          mobileNo: this.referenceData.length > 0 && this.referenceData[0].mobileNo ? this.referenceData[0].mobileNo : '',
          address: this.referenceData.length > 0 && this.referenceData[0].address ? this.referenceData[0].address : '',
          // tslint:disable-next-line: max-line-length
          referenceStatus: this.referenceData.length > 0 && this.referenceData[0].referenceStatus ? this.referenceData[0].referenceStatus : ''
        },
        reference2: {
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 1 && this.referenceData[1].referenceId ? this.referenceData[1].referenceId : 0,
          firstName: this.referenceData.length > 1 && this.referenceData[1].firstName ? this.referenceData[1].firstName : '',
          mobileNo: this.referenceData.length > 1 && this.referenceData[1].mobileNo ? this.referenceData[1].mobileNo : '',
          address: this.referenceData.length > 1 && this.referenceData[1].address ? this.referenceData[1].address : '',
          // tslint:disable-next-line: max-line-length
          referenceStatus: this.referenceData.length > 1 && this.referenceData[1].referenceStatus ? this.referenceData[1].referenceStatus : ''
        }
      };
      tvr.applicationReferences = applicationReferences ? applicationReferences : '';

      // tslint:disable-next-line: max-line-length
      this.teleVerificationForm.get('srcOfProposal').setValue(`${this.sourcingChannelDesc} - ${this.sourcingTypeDesc} ${this.sourcingCode}`);
      this.teleVerificationForm.get('eCode').setValue(this.eCode);
      if (tvr.dob) {
        this.teleVerificationForm.patchValue(tvr);
        if (this.valueChanges) {
          this.valueChanges.relationship.forEach(element => {
            if (tvr && element.value === tvr.relationShip) {
              this.teleVerificationForm.get('relationShip').setValue(element.key);
            }
          });
          this.valueChanges.tvrTranscationType.forEach(element => {
            if (tvr && element.value === tvr.typeOfTransaction) {
              this.teleVerificationForm.get('typeOfTransaction').setValue(element.key);
            }
          });
          this.valueChanges.tvrBusiness.forEach(element => {
            if (tvr && element.value === tvr.ifBusiness) {
              this.teleVerificationForm.get('ifBusiness').setValue(element.key);
            }
          });
          this.valueChanges.tvrDecision.forEach(element => {
            if (tvr && element.value === tvr.decision) {
              this.teleVerificationForm.get('decision').setValue(element.key);
            }
          });
          this.valueChanges.howDidCustomerKnowEquitasBank.forEach(element => {
            if (tvr && element.value === tvr.referredBy) {
              this.teleVerificationForm.get('referredBy').setValue(element.key);
            }
          });
          this.valueChanges.businessType.forEach(element => {
            if (tvr && element.value === tvr.natureOfBusiness) {
              this.teleVerificationForm.get('natureOfBusiness').setValue(element.key);
            }
          });
          this.valueChanges.applicationReferenceStatus.forEach(element => {
            if (applicationReferences && element.value === applicationReferences.reference1.referenceStatus) {
              // tslint:disable-next-line: max-line-length
              // tslint:disable-next-line: no-string-literal
              this.teleVerificationForm.controls.applicationReferences['controls'].reference1.get('referenceStatus').setValue(element.key);
            }
          });
          this.valueChanges.applicationReferenceStatus.forEach(element => {
            if (applicationReferences && element.value === applicationReferences.reference2.referenceStatus) {
              // tslint:disable-next-line: max-line-length
              // tslint:disable-next-line: no-string-literal
              this.teleVerificationForm.controls.applicationReferences['controls'].reference2.get('referenceStatus').setValue(element.key);
            }
          });
        }
      } else {
        this.teleVerificationForm.get('applicantName').setValue(res.ProcessVariables.applicantName);
        this.teleVerificationForm.get('soName').setValue(res.ProcessVariables.soName ? res.ProcessVariables.soName : '');
        this.teleVerificationForm.get('leadId').setValue(this.leadId);
        this.teleVerificationForm.get('tvrDoneBy').setValue(this.userName);
        this.teleVerificationForm.get('tvrTime').setValue(this.time);
        this.teleVerificationForm.get('tvrDate').setValue(this.toDayDate);
        this.teleVerificationForm.get('product').setValue(this.product);
        this.teleVerificationForm.get('residentPhnNo').setValue(this.mobileNumber);
        this.teleVerificationForm.get('officePhnNo').setValue(this.mobileNumber);
        this.teleVerificationForm.get('tenureInMonth').setValue(this.tenure);
        this.teleVerificationForm.get('assetCost').setValue(this.assetCost);
      }

      const operationType = this.toggleDdeService.getOperationType();
      if (operationType === '1') {
        this.teleVerificationForm.disable();
        this.disableSaveBtn = true;
      }

    });
  }

  // Save or Updated Api method for TVR
  saveOrUpdateTvrDetails() {
    this.tvrDetails.userId = localStorage.getItem('userId');
    this.tvrDetails.applicantId = this.applicantId;
    const data = this.tvrDetails;
    this.tvrService.setTvrDetails(data).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;

      if (appiyoError === '0' && apiError === '0') {
        this.toasterService.showSuccess('Record Saved Successfully !', '');
      }
    });
  }

  onBack() {
    this.location.back();
  }

  // Submitting TVR Form Method
  async onSave() {
    console.log(this.teleVerificationForm);

    const tvrDetails = this.teleVerificationForm.getRawValue();
    this.isDirty = true;
    if (this.teleVerificationForm.valid === true) {
      // console.log('success');
      this.tvrDetails = this.teleVerificationForm.value;
      this.tvrDetails.dob = this.dateToFormate(this.tvrDetails.dob);
      this.tvrDetails.tvrDate = this.dateToFormate(this.tvrDetails.tvrDate);
      const data = this.tvrDetails.applicationReferences;
      this.tvrDetails.applicationReferences = [this.tvrDetails.applicationReferences.reference1,
      this.tvrDetails.applicationReferences.reference2];
      this.saveOrUpdateTvrDetails();
      this.isSaved = true;
    } else {
      this.toasterService.showError('Please fill all mandatory fields.', 'TVR Details');
    }

  }

  sendOtp() {
    const data = {
      applicantId: this.applicantId
    };
    this.otpService.sendOtp(data).subscribe((res: any) => {
      const response = res;
      this.referenceNo = res.ProcessVariables.referenceNo;
      this.mobileNo = res.ProcessVariables.mobileNo;

      if (
        // tslint:disable-next-line: triple-equals
        res.ProcessVariables.error.code == '0' &&
        // tslint:disable-next-line: triple-equals
        res.ProcessVariables.referenceNo != ''
      ) {
        this.toasterService.showSuccess('OTP sent successfully !', '');
      } else {
        alert(res.ProcessVariables.error.message);
      }

      console.log('send otp', response);
    });
  }

  validateOtp() {
    const data = {
      applicantId: this.applicantId,
      referenceNo: this.referenceNo,
      otp: this.otpForm.value.otp,
      isTVR: true,
    };

    this.otpService.validateOtp(data).subscribe((res: any) => {
      const response = res;
      console.log('validate otp', response);
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        console.log(res.ProcessVariables.error);
        this.closeModal.nativeElement.click();
        this.toasterService.showSuccess('OTP Verified Successfully !', '');
        this.router.navigate([`pages/dde/${this.leadId}/tvr-details`]);
      } else {
        // alert(res.ProcessVariables.error.message);
        // this.isModal = true;
        this.toasterService.showError('Invalid OTP !', '');
      }
    });
  }

  // Submitting method for OTP Form
  onSubmit() {
    this.sendOtp();
    this.isModal = true;
  }


}
