import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators, FormArray } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { DdeStoreService } from '@services/dde-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { ToasterService } from '@services/toaster.service';
import { OtpServiceService } from '@modules/lead-section/services/otp-details.service';
import { CreateLeadService } from '@modules/lead-creation/service/creatLead.service';
import { log } from 'console';

@Component({
  selector: 'app-tele-verification-form',
  templateUrl: './tele-verification-form.component.html',
  styleUrls: ['./tele-verification-form.component.css']
})
export class TeleVerificationFormComponent implements OnInit {
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

  public dateValue: Date = new Date(2, 10, 2000);
  public toDayDate: Date = new Date();
  public time: any =  new Date(new Date().getTime()).toLocaleTimeString();


  @ViewChild('closeModal', {static: false}) public closeModal: ElementRef;

  constructor(
    private fb: FormBuilder,
    // private labelDetails: LabelsService,
    private labelService: LabelsService,
    private commomLovService: CommomLovService,
    private ddeStoreService: DdeStoreService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private tvrService: TvrDetailsService,
    private toasterService: ToasterService,
    private otpService: OtpServiceService,
    private createLeadService: CreateLeadService

  ) {

    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });
    // );
    this.getLOV();

    this.leadId = this.route.snapshot.params.leadId;
    console.log(this.leadId);
    this.applicantId = parseInt(this.route.snapshot.params.applicantId);
    this.applicantType = this.route.snapshot.params.applicantType;
    this.leadDetails = this.route.snapshot.data.leadData;
    this.product = this.leadDetails.ProcessVariables.leadDetails.assetProdutName;
    this.sourcingChannelDesc = this.leadDetails.ProcessVariables.leadDetails.sourcingChannelDesc;
    this.sourcingTypeDesc = this.leadDetails.ProcessVariables.leadDetails.sourcingTypeDesc;
    this.sourcingCodeDesc = this.leadDetails.ProcessVariables.leadDetails.sourcingCodeDesc;

    this.sourcingCode = this.sourcingCodeDesc !== '-' ? `- ${this.sourcingCodeDesc}` : '';

  }

  initForm() {
    this.referenceData =  this.referenceData || [];
    this.teleVerificationForm = this.fb.group({
      leadId: [{ value: this.leadId, disabled: true }],
      applicantName: [{ value: this.applicantName, disabled: true }],
      soName: [{ value: this.soName, disabled: true }],
      assetCost: ['', Validators.required],
      assetType: [''],
      financeAmt: ['', Validators.required],
      tenureInMonth: ['', Validators.required],
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
      residentPhnNo: ['', Validators.required],
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
      addressConfirmed: [''],
      residenceStabilityConfirmed: [''],
      customerAvailabilty: [''],
      tvrDoneBy: [''],
      eCode: [''],
      wrkExperience: ['', Validators.required],
      officePhnNo: ['', Validators.required],
      officePhnExt: ['', Validators.required],
      wrkStability: ['', Validators.required],
      natureOfBusiness: [{ value: '', disabled: true }],
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

    this.getTvrDetails();
    this.initForm();
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
    this.commomLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
    this.valueChanges = this.LOV.LOVS || [];
  }



  dateFunction(newDate) {
    const newDateFormat = newDate.split('/');
    return new Date(newDateFormat[2], newDateFormat[1] - 1, newDateFormat[0]);
  }

  dateToFormate(date) {
    return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
  }

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
      // tvr.financeAmt = financeAmt;
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
      // console.log(tvr);
      this.teleVerificationForm.get('srcOfProposal').setValue(`${this.sourcingChannelDesc} - ${this.sourcingTypeDesc} ${this.sourcingCode}`);

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
          this.valueChanges.applicationReferenceStatus.forEach(element => {
            if (applicationReferences && element.value === applicationReferences.reference1.referenceStatus) {
              // tslint:disable-next-line: max-line-length
              this.teleVerificationForm.controls.applicationReferences['controls'].reference1.get('referenceStatus').setValue(element.key);
            }
          });
          this.valueChanges.applicationReferenceStatus.forEach(element => {
            if (applicationReferences && element.value === applicationReferences.reference2.referenceStatus) {
              // tslint:disable-next-line: max-line-length
              this.teleVerificationForm.controls.applicationReferences['controls'].reference2.get('referenceStatus').setValue(element.key);
            }
          });
        }
      } else {
        this.teleVerificationForm.get('applicantName').setValue(res.ProcessVariables.applicantName);
        this.teleVerificationForm.get('soName').setValue(res.ProcessVariables.soName ? res.ProcessVariables.soName : '');
        this.teleVerificationForm.get('leadId').setValue(this.leadId);
        this.teleVerificationForm.get('tvrDoneBy').setValue(res.ProcessVariables.applicantName);
        this.teleVerificationForm.get('tvrTime').setValue(this.time);
        this.teleVerificationForm.get('tvrDate').setValue(this.toDayDate);
        this.teleVerificationForm.get('product').setValue(this.product);
      }

    });
  }

  saveOrUpdateTvrDetails() {
    this.tvrDetails.userId = localStorage.getItem('userId');
    this.tvrDetails.applicantId = this.applicantId;
    const data = this.tvrDetails;
    this.tvrService.setTvrDetails(data).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;

      if (appiyoError === '0' && apiError === '0') {
        this.toasterService.showSuccess('Lead Updated Successfully !', '');
      }
    });
  }

  onBack() {
    this.location.back();
  }

  async onSave() {
    // console.log('on save', this.teleVerificationForm.value);
    // this.tvrDetails = this.teleVerificationForm.value;
    const tvrDetails = this.teleVerificationForm.getRawValue();
    this.isDirty = true;
    if (this.teleVerificationForm.valid === true) {
      console.log('success');
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
        res.ProcessVariables.error.code == '0' &&
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

  onSubmit() {
    this.sendOtp();
    this.isModal = true;
  }


}
