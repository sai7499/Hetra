import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators, FormArray } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { DdeStoreService } from '@services/dde-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { Reference } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-tele-verification-form',
  templateUrl: './tele-verification-form.component.html',
  styleUrls: ['./tele-verification-form.component.css']
})
export class TeleVerificationFormComponent implements OnInit {
  teleVerificationForm: FormGroup;
  labels: any = {};
  LOV: any = [];
  tvrLov: any = [];
  leadId;
  tvrDetails;
  tvrData: any;
  isAlert: boolean;
  tvrDashboardList;
  applicantId;
  referenceData = [];
  applicantName;
  so_name;
  dateFormate;
  applicantType;

  public dateValue: Date = new Date(2, 10, 2000);
  public toDayDate: Date = new Date();

  maxLenght40 = {
    rule: 40,
  };
  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed'
    },
    amountLength: {
      rule: '10',
      msg: ''
    },
    nameLength: {
      rule: '30',
      msg: ''
    },
    maxLength: {
      rule: '10',
      msg: 'Maximum Length 10 digits',
    },
    maxLength40 : {
      rule: 40,
    },
    mobile: {
      rule: '^[1-9][0-9]*$',
      msg: 'Numbers only allowed !',
    },
    tenure : {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Months / Alphabets and Special Characters not allowed'
    },
    maxLength3: {
      rule: '3',
      msg: ''
    },
    noOfYears: {
      rule: '2',
      msg: ''
    },
    years : {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Years / Alphabets and Special Characters not allowed'
    },
    emi : {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid EMI / Alphabets and Special Characters not allowed'
    },
    employees : {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid employees / Alphabets and Special Characters not allowed'
    }
  };

  constructor(
    private fb: FormBuilder,
    private labelDetails: LabelsService,
    private commomLovService: CommomLovService,
    private ddeStoreService: DdeStoreService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private tvrService: TvrDetailsService

  ) {
    this.leadId = this.route.snapshot.params['leadId'];
    console.log(this.leadId);
    this.applicantId = parseInt(this.route.snapshot.params['applicantId']);
    console.log('applicantId', this.applicantId);
  }

  get teleVerificationFormControls() { return this.teleVerificationForm.controls; }

  // ------NgOnInit-------
  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.initForm();
    this.getLOV();
    // this.setFormValue();
    this.getTvrDetails();
    // this.saveOrUpdateTvrDetails();
    this.getTvrDetailsList();
  }



  getLOV() {
    this.commomLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
  }


  initForm(data?) {

    this.teleVerificationForm = this.fb.group({
      leadId: [{ value: data && data.leadId ? data.leadId : this.leadId, disabled: true }],
      applicantName: [{ value: data && data.applicantName ? data.applicantName : this.applicantName, disabled: true }],
      soName: [{ value: data && data.soName ? data.soName : this.so_name, disabled: true }],
      assetCost: [data && data.assetCost ? data.assetCost : ''],
      assetType: [data && data.assetType ? data.assetType : ''],
      financeAmt: [data && data.financeAmt ? data.financeAmt : ''],
      tenureInMonth: [data && data.tenureInMonth ? data.tenureInMonth : ''],
      srcOfProposal: [data && data.srcOfProposal ? data.srcOfProposal : ''],
      referredBy: [data && data.referredBy ? data.referredBy : ''],
      product: [data && data.product ? data.product : ''],
      emi: [data && data.emi ? data.emi : ''],
      ndForProposedVehicle: [data && data.ndForProposedVehicle ? data.ndForProposedVehicle : ''],
      route: [data && data.route ? data.route : ''],
      contractDetails: [data && data.contractDetails ? data.contractDetails : ''],
      typeOfGoods: [data && data.typeOfGoods ? data.typeOfGoods : ''],
      amountRequested: [data && data.amountRequested ? data.amountRequested : ''],
      fundEndUse: [data && data.fundEndUse ? data.fundEndUse : ''],
      tenureRequested: [data && data.tenureRequested ? data.tenureRequested : ''],
      residentType: [data && data.residentType ? data.residentType : ''],
      otherVehiclesOwned: [data && data.otherVehiclesOwned ? data.otherVehiclesOwned : ''],
      // tslint:disable-next-line: max-line-length
      residentPhnNo: [data && data.residentPhnNo ? data.residentPhnNo : ''],
      residentAddress: [data && data.residentAddress ? data.residentAddress : ''],

      otherLoans: [data && data.otherLoans ? data.otherLoans : ''],
      otherLoanEmi: [data && data.otherLoanEmi ? data.otherLoanEmi : ''],
      residentNoOfYrs: [data && data.residentNoOfYrs ? data.residentNoOfYrs : ''],
      cc: [data && data.cc ? data.cc : ''],
      tvrStatus: [true],
      dob: [data && data.dob ? this.dateFunction(data.dob) : ''],
      spokenTo: [data && data.spokenTo ? data.spokenTo : ''],
      familyMembers: [data && data.familyMembers ? data.familyMembers : ''],
      relationShip: [data && data.relationShip ? data.relationShip : ''],
      tvrDate: [data && data.tvrDate ? this.dateFunction(data.tvrDate) : ''],
      tvrTime: [data && data.tvrTime ? data.tvrTime : ''],
      addressConfirmed: [data && data.addressConfirmed ? data.addressConfirmed.toString() : ''],
      residenceStabilityConfirmed: [data && data.residenceStabilityConfirmed ? data.residenceStabilityConfirmed.toString() : ''],
      customerAvailabilty: [data && data.customerAvailabilty ? data.customerAvailabilty : ''],
      tvrDoneBy: [data && data.tvrDoneBy ? data.tvrDoneBy : ''],
      eCode: [data && data.eCode ? data.eCode : ''],
      wrkExperience: [data && data.wrkExperience ? data.wrkExperience : ''],
      officePhnNo: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      officePhnExt: [data && data.officePhnExt ? data.officePhnExt : ''],
      wrkStability: [data && data.wrkStability ? data.wrkStability : ''],
      natureOfBusiness: [data && data.natureOfBusiness ? data.natureOfBusiness : ''],
      typeOfTransaction: [data && data.typeOfTransaction ? data.typeOfTransaction : ''],
      businessStability: [data && data.businessStability ? data.businessStability : ''],
      compNameAddress: [data && data.compNameAddress ? data.compNameAddress : ''],
      designation: [data && data.designation ? data.designation : ''],
      industryType: [data && data.industryType ? data.industryType : ''],
      yrsInEmployment: [data && data.yrsInEmployment ? data.yrsInEmployment : ''],
      ifBusiness: [data && data.ifBusiness ? data.ifBusiness : ''],
      employees: [data && data.employees ? data.employees : ''],
      relation: [data && data.relation ? data.relation : ''],
      monthlyGrossSalary: [data && data.monthlyGrossSalary ? data.monthlyGrossSalary : ''],
      otherIncome: [data && data.otherIncome ? data.otherIncome : ''],
      decision: [data && data.decision ? data.decision : ''],
      cibilOverDue: [data && data.cibilOverDue ? data.cibilOverDue : ''],
      cibilClarification: [data && data.cibilClarification ? data.cibilClarification : ''],
      remarks: [data && data.remarks ? data.remarks : ''],
      applicationReferences: this.fb.group({
        reference1: this.fb.group({
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 0 && this.referenceData[0]['referenceId'] ? this.referenceData[0]['referenceId'] : 0,
          firstName: [this.referenceData.length > 0 && this.referenceData[0].firstName ? this.referenceData[0].firstName : ''],
          mobileNo: [this.referenceData.length > 0 && this.referenceData[0].mobileNo ? this.referenceData[0].mobileNo : ''],
          address: [this.referenceData.length > 0 && this.referenceData[0].address ? this.referenceData[0].address : ''],
          // tslint:disable-next-line: max-line-length
          referenceStatus: [this.referenceData.length > 0 && this.referenceData[0].referenceStatus ? this.referenceData[0].referenceStatus : '']
        }),
        reference2: this.fb.group({
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 0 && this.referenceData[1]['referenceId'] ? this.referenceData[1]['referenceId'] : 0,
          firstName: [this.referenceData.length > 0 && this.referenceData[1].firstName ? this.referenceData[1].firstName : ''],
          mobileNo: [this.referenceData.length > 0 && this.referenceData[1].mobileNo ? this.referenceData[1].mobileNo : ''],
          address: [this.referenceData.length > 0 && this.referenceData[1].address ? this.referenceData[1].address : ''],
          // tslint:disable-next-line: max-line-length
          referenceStatus: [this.referenceData.length > 0 && this.referenceData[1].referenceStatus ? this.referenceData[1].referenceStatus : '']
        })
      })
    });
  }

  dateFunction(newDate) {
    const newDateFormat = newDate.split('/');
    return new Date(newDateFormat[2], newDateFormat[1], newDateFormat[0]);
  }

  dateToFormate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }



  getTvrDetails() {
    const data = {
      applicantId: this.applicantId
    };
    this.tvrService.getTvrDetails(data).subscribe((res: any) => {
      this.tvrData = res.ProcessVariables.tvr;
      this.referenceData = res.ProcessVariables.applicationReferences ? res.ProcessVariables.applicationReferences : [];
      // this.dateFormate = res.ProcessVariables.tvr.dob;
      this.initForm(this.tvrData);
      if (this.tvrData) {
        // this.teleVerificationForm.patchValue(this.tvrData);
        // this.teleVerificationForm.get('dob').patchValue(this.dateFunction(res.ProcessVariables.tvr.dob));
        // this.teleVerificationForm.controls['applicationReferences'].patchValue(this.referenceData);

      }

      // this.teleVerificationForm.controls['residenceStabilityConfirmed'].setValue(this.tvrData.residenceStabilityConfirmed.toString());
      // this.teleVerificationForm.controls['addressConfirmed'].setValue(this.tvrData.residenceStabilityConfirmed.toString());
      // this.teleVerificationForm.controls['customerAvailabilty'].setValue(this.tvrData.residenceStabilityConfirmed.toString());
      // this.initForm();
      console.log('tvrResponse', this.tvrData);
      console.log('applicationReferenceData', this.referenceData);
      // console.log(this.dateFunction(res.ProcessVariables.tvr.dob));

    });
  }

  saveOrUpdateTvrDetails() {
    // const data = {
    //   userId: localStorage.getItem('userId'),
    //   applicantId: 43,
    //   tvrDetails: this.tvrDetails
    // };
    this.tvrDetails['userId'] = localStorage.getItem('userId');
    this.tvrDetails['applicantId'] = this.applicantId;
    const data = this.tvrDetails;
    console.log('save tvr details', this.tvrDetails);
    this.tvrService.setTvrDetails(data).subscribe((res: any) => {
      console.log('saveUpdateTvrDetails', res);
    });
  }

  getTvrDetailsList() {
    const data = {
      leadId: parseInt(this.leadId),
      userId: localStorage.getItem('userId')
    };
    this.tvrService.getTvrDetailsList(data).subscribe((res: any) => {
      this.tvrDashboardList = res.ProcessVariables.tvrApplicantsList;
      this.applicantId = res.ProcessVariables.tvrApplicantsList[0].applicantId;
      this.applicantName = res.ProcessVariables.tvrApplicantsList[0].applicantName;
      this.so_name = res.ProcessVariables.tvrApplicantsList[0].so_name;
      this.applicantType = res.ProcessVariables.tvrApplicantsList[0].applicantType;
      this.initForm();
      console.log('TVR-Dashboard_list', this.tvrDashboardList);
    });

  }

  async onSave() {
    // console.log('on save', this.teleVerificationForm.value);
    this.tvrDetails = this.teleVerificationForm.value;
    this.tvrDetails.residenceStabilityConfirmed = parseInt(this.teleVerificationForm.value.residenceStabilityConfirmed)
    this.tvrDetails.addressConfirmed = parseInt(this.teleVerificationForm.value.addressConfirmed)
    this.tvrDetails.customerAvailabilty = parseInt(this.teleVerificationForm.value.customerAvailabilty)
    this.tvrDetails.amountRequested = parseInt(this.teleVerificationForm.value.amountRequested)
    this.tvrDetails.assetCost = parseInt(this.teleVerificationForm.value.assetCost)
    this.tvrDetails.otherLoanEmi = parseInt(this.teleVerificationForm.value.otherLoanEmi)
    this.tvrDetails.emi = parseInt(this.teleVerificationForm.value.emi)
    this.tvrDetails.employees = parseInt(this.teleVerificationForm.value.employees)
    this.tvrDetails.financeAmt = parseInt(this.teleVerificationForm.value.financeAmt)
    this.tvrDetails.monthlyGrossSalary = parseInt(this.teleVerificationForm.value.monthlyGrossSalary)
    this.tvrDetails.residentNoOfYrs = parseInt(this.teleVerificationForm.value.residentNoOfYrs)
    this.tvrDetails.tenureInMonth = parseInt(this.teleVerificationForm.value.tenureInMonth)
    this.tvrDetails.tenureRequested = parseInt(this.teleVerificationForm.value.tenureRequested)
    this.tvrDetails.wrkExperience = parseInt(this.teleVerificationForm.value.wrkExperience)
    this.tvrDetails.yrsInEmployment = parseInt(this.teleVerificationForm.value.yrsInEmployment)
    this.tvrDetails.dob = this.dateToFormate(this.tvrDetails.dob);
    this.tvrDetails.tvrDate = this.dateToFormate(this.tvrDetails.tvrDate);
    const data = this.tvrDetails['applicationReferences'];
    this.tvrDetails.applicationReferences = [this.tvrDetails['applicationReferences'].reference1,
    this.tvrDetails['applicationReferences'].reference2];

    console.log(this.tvrDetails);
    this.saveOrUpdateTvrDetails();
    console.log('TVR_Get_Details', this.tvrData);

    // this.router.navigateByUrl(`pages/dde/${this.leadId}/tvr-details`);
  }




}
