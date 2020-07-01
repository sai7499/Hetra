import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators, FormArray } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { DdeStoreService } from '@services/dde-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-tele-verification-form',
  templateUrl: './tele-verification-form.component.html',
  styleUrls: ['./tele-verification-form.component.css']
})
export class TeleVerificationFormComponent implements OnInit {
  referenceData = [];
  teleVerificationForm: FormGroup;

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

  public dateValue: Date = new Date(2, 10, 2000);
  public toDayDate: Date = new Date();

  maxLenght40 = {
    rule: 40,
  };
  regexPattern = {
    assetFinanceLength: {
      rule: '12',
      msg: ''
    },
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
    namePattern: {
      rule: '^[A-Za-z0-9 ]+$',
      msg: 'Invalid Name /  Special Characters not allowed',
    },
    maxLength: {
      rule: '10',
      msg: 'Maximum Length 10 digits',
    },
    maxLength20: {
      rule: 20,
    },
    maxLength50: {
      rule: 50,
    },
    maxLength100: {
      rule: 100,
    },
    mobile: {
      rule: '^[1-9][0-9]*$',
      msg: 'Numbers only allowed !',
    },
    tenure: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Months / Alphabets and Special Characters not allowed'
    },
    maxLength3: {
      rule: '3',
      msg: ''
    },
    maxLength4: {
      rule: '4',
      msg: ''
    },
    maxLength5: {
      rule: '5',
      msg: ''
    },
    years: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Years / Alphabets and Special Characters not allowed'
    },
    emi: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid EMI / Alphabets and Special Characters not allowed'
    },
    employees: {
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
    private tvrService: TvrDetailsService,
    private toasterService: ToasterService

  ) {
    this.getLOV();

    this.initForm();
    this.leadId = this.route.snapshot.params['leadId'];
    console.log(this.leadId);
    this.applicantId = parseInt(this.route.snapshot.params['applicantId']);
    this.applicantType = this.route.snapshot.params['applicantType'];
    console.log('applicantId', this.applicantId);
  }

  initForm() {
    // this.referenceData =  this.referenceData || [];
    this.teleVerificationForm = this.fb.group({
      leadId: [{ value: this.leadId, disabled: true }],
      applicantName: [{ value: this.applicantName, disabled: true }],
      soName: [{ value: this.soName, disabled: true }],
      assetCost: [''],
      assetType: [''],
      financeAmt: [''],
      tenureInMonth: [''],
      srcOfProposal: [{ value: '', disabled: true }],
      referredBy: [''],
      product: [{ value: '', disabled: true }],
      emi: [''],
      ndForProposedVehicle: [{ value: '', disabled: true }],
      route: [{ value: '', disabled: true }],
      contractDetails: [''],
      typeOfGoods: [{ value: '', disabled: true }],
      amountRequested: [''],
      fundEndUse: [''],
      tenureRequested: [''],
      residentType: [''],
      otherVehiclesOwned: [''],
      residentPhnNo: [''],
      residentAddress: [''],
      otherLoans: [''],
      otherLoanEmi: [''],
      residentNoOfYrs: [''],
      cc: [''],
      tvrStatus: [''],
      dob: [''],
      spokenTo: [''],
      familyMembers: [''],
      relationShip: [''],
      tvrDate: [''],
      tvrTime: [''],
      addressConfirmed: [''],
      residenceStabilityConfirmed: [''],
      customerAvailabilty: [''],
      tvrDoneBy: [{ value: '', disabled: true }],
      eCode: [{ value: '', disabled: true }],
      wrkExperience: [''],
      officePhnNo: [''],
      officePhnExt: [''],
      wrkStability: [''],
      natureOfBusiness: [{ value: '', disabled: true }],
      typeOfTransaction: [''],
      businessStability: [''],
      compNameAddress: [''],
      designation: [''],
      industryType: [{ value: '', disabled: true }],
      yrsInEmployment: [''],
      ifBusiness: [''],
      employees: [''],
      relation: [''],
      monthlyGrossSalary: [''],
      otherIncome: [''],
      decision: [''],
      cibilOverDue: [''],
      cibilClarification: [''],
      remarks: [''],
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
          referenceId: this.referenceData.length > 1 && this.referenceData[1]['referenceId'] ? this.referenceData[1]['referenceId'] : 0,
          firstName: [this.referenceData.length > 1 && this.referenceData[1].firstName ? this.referenceData[1].firstName : ''],
          mobileNo: [this.referenceData.length > 1 && this.referenceData[1].mobileNo ? this.referenceData[1].mobileNo : ''],
          address: [this.referenceData.length > 1 && this.referenceData[1].address ? this.referenceData[1].address : ''],
          // tslint:disable-next-line: max-line-length
          referenceStatus: [this.referenceData.length > 0 && this.referenceData[1].referenceStatus ? this.referenceData[1].referenceStatus : '']
        })
      })
    });

  }

  get teleVerificationFormControls() { return this.teleVerificationForm.controls; }

  // ------NgOnInit-------
  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    // this.setFormValue();
    this.getTvrDetails();
    // this.saveOrUpdateTvrDetails();
    // this.getTvrDetailsList();

  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
    this.valueChanges = this.LOV.LOVS || [];
  }


  // initForm(data?) {
  //   this.referenceData =  this.referenceData || [];
  //   this.teleVerificationForm =  this.fb.group({
  //     leadId: [{ value: data && data.leadId ? data.leadId : this.leadId, disabled: true }],
  //     applicantName: [{ value: data && data.applicantName ? data.applicantName : this.applicantName, disabled: true }],
  //     soName: [{ value: data && data.soName ? data.soName : this.soName, disabled: true }],
  //     assetCost: [data && data.assetCost ? data.assetCost : ''],
  //     assetType: [data && data.assetType ? data.assetType : ''],
  //     // financeAmt: [financeAmt],
  //     financeAmt: [''],
  //     tenureInMonth: [data && data.tenureInMonth ? data.tenureInMonth : ''],
  //     srcOfProposal: [data && data.srcOfProposal ? data.srcOfProposal : ''],
  //     referredBy: [data && data.referredBy ? data.referredBy : ''],
  //     product: [data && data.product ? data.product : ''],
  //     emi: [data && data.emi ? data.emi : ''],
  //     ndForProposedVehicle: [data && data.ndForProposedVehicle ? data.ndForProposedVehicle : ''],
  //     route: [data && data.route ? data.route : ''],
  //     contractDetails: [data && data.contractDetails ? data.contractDetails : ''],
  //     typeOfGoods: [data && data.typeOfGoods ? data.typeOfGoods : ''],
  //     amountRequested: [data && data.amountRequested ? data.amountRequested : ''],
  //     fundEndUse: [data && data.fundEndUse ? data.fundEndUse : ''],
  //     tenureRequested: [data && data.tenureRequested ? data.tenureRequested : ''],
  //     residentType: [data && data.residentType ? data.residentType : ''],
  //     otherVehiclesOwned: [data && data.otherVehiclesOwned ? data.otherVehiclesOwned : ''],
  //     // tslint:disable-next-line: max-line-length
  //     residentPhnNo: [data && data.residentPhnNo ? data.residentPhnNo : ''],
  //     residentAddress: [data && data.residentAddress ? data.residentAddress : ''],

  //     otherLoans: [data && data.otherLoans ? data.otherLoans : ''],
  //     otherLoanEmi: [data && data.otherLoanEmi ? data.otherLoanEmi : ''],
  //     residentNoOfYrs: [data && data.residentNoOfYrs ? data.residentNoOfYrs : ''],
  //     cc: [data && data.cc ? data.cc : ''],
  //     tvrStatus: [true],
  //     dob: [data && data.dob ? this.dateFunction(data.dob) : ''],
  //     spokenTo: [data && data.spokenTo ? data.spokenTo : ''],
  //     familyMembers: [data && data.familyMembers ? data.familyMembers : ''],
  //     relationShip: [data && data.relationShip ? data.relationShip : ''],
  //     tvrDate: [data && data.tvrDate ? this.dateFunction(data.tvrDate) : ''],
  //     tvrTime: [data && data.tvrTime ? data.tvrTime : ''],
  //     addressConfirmed: [data && data.addressConfirmed ? data.addressConfirmed.toString() : ''],
  //     residenceStabilityConfirmed: [data && data.residenceStabilityConfirmed ? data.residenceStabilityConfirmed.toString() : ''],
  //     customerAvailabilty: [data && data.customerAvailabilty ? data.customerAvailabilty : ''],
  //     tvrDoneBy: [data && data.tvrDoneBy ? data.tvrDoneBy : ''],
  //     eCode: [data && data.eCode ? data.eCode : ''],
  //     wrkExperience: [data && data.wrkExperience ? data.wrkExperience : ''],
  //     officePhnNo: [data && data.officePhnNo ? data.officePhnNo : ''],
  //     officePhnExt: [data && data.officePhnExt ? data.officePhnExt : ''],
  //     wrkStability: [data && data.wrkStability ? data.wrkStability : ''],
  //     natureOfBusiness: [data && data.natureOfBusiness ? data.natureOfBusiness : ''],
  //     typeOfTransaction: [data && data.typeOfTransaction ? data.typeOfTransaction : ''],
  //     businessStability: [data && data.businessStability ? data.businessStability : ''],
  //     compNameAddress: [data && data.compNameAddress ? data.compNameAddress : ''],
  //     designation: [data && data.designation ? data.designation : ''],
  //     industryType: [data && data.industryType ? data.industryType : ''],
  //     yrsInEmployment: [data && data.yrsInEmployment ? data.yrsInEmployment : ''],
  //     ifBusiness: [data && data.ifBusiness ? data.ifBusiness : ''],
  //     employees: [data && data.employees ? data.employees : ''],
  //     relation: [data && data.relation ? data.relation : ''],
  //     monthlyGrossSalary: [data && data.monthlyGrossSalary ? data.monthlyGrossSalary : ''],
  //     otherIncome: [data && data.otherIncome ? data.otherIncome : ''],
  //     decision: [data && data.decision ? data.decision : ''],
  //     cibilOverDue: [data && data.cibilOverDue ? data.cibilOverDue : ''],
  //     cibilClarification: [data && data.cibilClarification ? data.cibilClarification : ''],
  //     remarks: [data && data.remarks ? data.remarks : ''],
  //     applicationReferences: this.fb.group({
  //       reference1: this.fb.group({
  //         applicantId: this.applicantId,
  //         referenceId: this.referenceData.length > 0 && this.referenceData[0]['referenceId'] ? this.referenceData[0]['referenceId'] : 0,
  //         firstName: [this.referenceData.length > 0 && this.referenceData[0].firstName ? this.referenceData[0].firstName : ''],
  //         mobileNo: [this.referenceData.length > 0 && this.referenceData[0].mobileNo ? this.referenceData[0].mobileNo : ''],
  //         address: [this.referenceData.length > 0 && this.referenceData[0].address ? this.referenceData[0].address : ''],
  //         referenceStatus: [this.referenceData.length > 0 && this.referenceData[0].referenceStatus ? this.referenceData[0].referenceStatus : '']
  //       }),
  //       reference2: this.fb.group({
  //         applicantId: this.applicantId,
  //         referenceId: this.referenceData.length > 0 && this.referenceData[1]['referenceId'] ? this.referenceData[1]['referenceId'] : 0,
  //         firstName: [this.referenceData.length > 0 && this.referenceData[1].firstName ? this.referenceData[1].firstName : ''],
  //         mobileNo: [this.referenceData.length > 0 && this.referenceData[1].mobileNo ? this.referenceData[1].mobileNo : ''],
  //         address: [this.referenceData.length > 0 && this.referenceData[1].address ? this.referenceData[1].address : ''],
  //         referenceStatus: [this.referenceData.length > 0 && this.referenceData[1].referenceStatus ? this.referenceData[1].referenceStatus : '']
  //       })
  //     })
  //   });
  // }


  dateFunction(newDate) {
    const newDateFormat = newDate.split('/');
    return new Date(newDateFormat[2], newDateFormat[1] - 1, newDateFormat[0]);
  }

  dateToFormate(date) {
    return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
  }



  getTvrDetails() {
    // console.log(this.teleVerificationForm.value);

    const data = {
      applicantId: this.applicantId
    };
    this.tvrService.getTvrDetails(data).subscribe((res: any) => {
      this.applicantName = res.ProcessVariables.applicantName;
      this.soName = res.ProcessVariables.soName;
      this.leadId = res.ProcessVariables.leadId;
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
          referenceId: this.referenceData.length > 0 && this.referenceData[0]['referenceId'] ? this.referenceData[0]['referenceId'] : 0,
          firstName: this.referenceData.length > 0 && this.referenceData[0].firstName ? this.referenceData[0].firstName : '',
          mobileNo: this.referenceData.length > 0 && this.referenceData[0].mobileNo ? this.referenceData[0].mobileNo : '',
          address: this.referenceData.length > 0 && this.referenceData[0].address ? this.referenceData[0].address : '',
          // tslint:disable-next-line: max-line-length
          referenceStatus: this.referenceData.length > 0 && this.referenceData[0].referenceStatus ? this.referenceData[0].referenceStatus : ''
        },
        reference2: {
          applicantId: this.applicantId,
          referenceId: this.referenceData.length > 1 && this.referenceData[1]['referenceId'] ? this.referenceData[1]['referenceId'] : 0,
          firstName: this.referenceData.length > 1 && this.referenceData[1].firstName ? this.referenceData[1].firstName : '',
          mobileNo: this.referenceData.length > 1 && this.referenceData[1].mobileNo ? this.referenceData[1].mobileNo : '',
          address: this.referenceData.length > 1 && this.referenceData[1].address ? this.referenceData[1].address : '',
          // tslint:disable-next-line: max-line-length
          referenceStatus: this.referenceData.length > 1 && this.referenceData[1].referenceStatus ? this.referenceData[1].referenceStatus : ''
        }
      };
      tvr.applicationReferences = applicationReferences ? applicationReferences : '';
      // console.log(tvr);
      if (tvr.dob) {
        this.teleVerificationForm.patchValue(tvr);
        if (this.valueChanges) {
          this.valueChanges.applicantRelationshipWithLead.forEach(element => {
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
          this.valueChanges.relationship.forEach(element => {
            if (tvr && element.value === tvr.relation) {
              this.teleVerificationForm.get('relation').setValue(element.key);
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
            if (applicationReferences && element.value === applicationReferences['reference1'].referenceStatus) {
              // tslint:disable-next-line: max-line-length
              this.teleVerificationForm.controls.applicationReferences['controls']['reference1'].get('referenceStatus').setValue(element.key);
            }
          });
          this.valueChanges.applicationReferenceStatus.forEach(element => {
            if (applicationReferences && element.value === applicationReferences['reference2'].referenceStatus) {
              // tslint:disable-next-line: max-line-length
              this.teleVerificationForm.controls.applicationReferences['controls']['reference2'].get('referenceStatus').setValue(element.key);
            }
          });
        }
      } else {
        this.teleVerificationForm.get('applicantName').setValue(res.ProcessVariables.applicantName);
        this.teleVerificationForm.get('soName').setValue(res.ProcessVariables.soName ? res.ProcessVariables.soName : '');
        this.teleVerificationForm.get('leadId').setValue(res.ProcessVariables.leadId);
      }

      // this.initForm(this.tvrData);
      // if (this.tvrData) {
      //   // this.teleVerificationForm.patchValue(this.tvrData);
      //   // this.teleVerificationForm.get('dob').patchValue(this.dateFunction(res.ProcessVariables.tvr.dob));
      //   // this.teleVerificationForm.controls['applicationReferences'].patchValue(this.referenceData);

      // }

      // this.teleVerificationForm.controls['residenceStabilityConfirmed'].setValue(this.tvrData ? this.tvrData.residenceStabilityConfirmed : '');
      // this.teleVerificationForm.controls['addressConfirmed'].setValue(this.tvrData ? this.tvrData.residenceStabilityConfirmed : '');
      // this.initForm();
      // console.log('tvrResponse', this.tvrData);
      // console.log('applicationReferenceData', this.referenceData);
      // console.log(this.dateFunction(res.ProcessVariables.tvr.dob));

    });
  }

  saveOrUpdateTvrDetails() {
    this.tvrDetails['userId'] = localStorage.getItem('userId');
    this.tvrDetails['applicantId'] = this.applicantId;
    const data = this.tvrDetails;
    this.tvrService.setTvrDetails(data).subscribe((res: any) => {
      const response = res;
      // console.log('saveUpdateTvrDetails', res);
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;

      if (appiyoError === '0' && apiError === '0') {
        this.toasterService.showSuccess('Lead Updated Successfully !', '');
      } else {
        this.toasterService.showError('Please fill all mandatory fields.', 'TVR Details');
      }
    });
  }

  getTvrDetailsList() {
    const data = {
      leadId: parseInt(this.leadId),
      userId: localStorage.getItem('userId')
    };
    this.tvrService.getTvrDetailsList(data).subscribe((res: any) => {
      this.tvrDashboardList = res.ProcessVariables.tvrApplicantsList;
      // const applicantType = this.tvrDashboardList.forEach((ele) => {
      //   if (ele.applicantType === 'Applicant') {
      //     this.applicantType = true;
      //   }
      // });


      // this.initForm();
      // console.log('TVR-Dashboard_list', this.tvrDashboardList);
    });

  }

  async onSave() {
    // console.log('on save', this.teleVerificationForm.value);
    this.tvrDetails = this.teleVerificationForm.value;
    // this.tvrDetails.residenceStabilityConfirmed = parseInt(this.teleVerificationForm.value.residenceStabilityConfirmed)
    // this.tvrDetails.addressConfirmed = parseInt(this.teleVerificationForm.value.addressConfirmed)
    // this.tvrDetails.customerAvailabilty = parseInt(this.teleVerificationForm.value.customerAvailabilty)
    // this.tvrDetails.amountRequested = parseInt(this.teleVerificationForm.value.amountRequested)
    // this.tvrDetails.assetCost = parseInt(this.teleVerificationForm.value.assetCost)
    // this.tvrDetails.otherLoanEmi = parseInt(this.teleVerificationForm.value.otherLoanEmi)
    // this.tvrDetails.emi = parseInt(this.teleVerificationForm.value.emi)
    // this.tvrDetails.employees = parseInt(this.teleVerificationForm.value.employees)
    // this.tvrDetails.financeAmt = parseInt(this.teleVerificationForm.value.financeAmt)
    // this.tvrDetails.monthlyGrossSalary = parseInt(this.teleVerificationForm.value.monthlyGrossSalary)
    // this.tvrDetails.residentNoOfYrs = parseInt(this.teleVerificationForm.value.residentNoOfYrs)
    // this.tvrDetails.tenureInMonth = parseInt(this.teleVerificationForm.value.tenureInMonth)
    // this.tvrDetails.tenureRequested = parseInt(this.teleVerificationForm.value.tenureRequested)
    // this.tvrDetails.wrkExperience = parseInt(this.teleVerificationForm.value.wrkExperience)
    // this.tvrDetails.yrsInEmployment = parseInt(this.teleVerificationForm.value.yrsInEmployment)
    this.tvrDetails.dob = this.dateToFormate(this.tvrDetails.dob);
    this.tvrDetails.tvrDate = this.dateToFormate(this.tvrDetails.tvrDate);
    const data = this.tvrDetails['applicationReferences'];
    this.tvrDetails.applicationReferences = [this.tvrDetails['applicationReferences'].reference1,
    this.tvrDetails['applicationReferences'].reference2];

    // console.log(this.tvrDetails);
    this.saveOrUpdateTvrDetails();
    // console.log('TVR_Get_Details', this.tvrData);

    // this.router.navigateByUrl(`pages/dde/${this.leadId}/tvr-details`);
  }

  onSubmit() {
    this.isModal = true;
  }

}
