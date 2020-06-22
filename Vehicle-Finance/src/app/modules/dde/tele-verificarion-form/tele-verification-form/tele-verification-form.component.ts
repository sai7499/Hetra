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

  public dateValue: Date = new Date(2000, 2, 10);
  public toDayDate: Date = new Date();

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


  initForm() {
    this.teleVerificationForm = this.fb.group({
      leadId: [{value: '', disabled: true}],
      applicantName: [{value: '', disabled: true}],
      soName: [{value: '', disabled: true}],
      assetCost: [''],
      assetType: [''],
      financeAmt: [''],
      tenureInMonth: [''],
      srcOfProposal: [''],
      product: [''],
      emi: [''],
      ndForProposedVehicle: [''],
      route: [''],
      contractDetails: [''],
      typeOfGoods: [''],
      amountRequested: [''],
      fundEndUse: [''],
      tenureRequested: [''],
      residentType: [''],
      otherVehiclesOwned: [''],
      residentPhnNo: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      residentAddress: [''],

      otherLoans: [''],
      otherLoanEmi: [''],
      residentNoOfYrs: [''],
      cc: [''],
      status: [true],
      dob: [''],
      spokenTo: [''],
      familyMembers: [''],
      relationShip: [''],
      tvrDate: [''],
      tvrTime: [''],
      radioAddress: [''],
      residenceStabilityConfirmed: [''],
      customerAvailabilty: [''],
      tvrDoneBy: [''],
      eCode: [''],
      office: [''],
      wrkExperience: [''],
      officePhnNo: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      officePhnExt: [''],
      wrkStability: [''],
      natureOfBusiness: [''],
      typeOfTransaction: [''],
      businessStability: [''],
      compNameAddress: [''],
      designation: [''],
      industryType: [''],
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
          referenceId: 0,
          firstName: [''],
          mobileNo: [''],
          address: [''],
          referenceStatus: ['']
        }),
        reference2: this.fb.group({
          applicantId: this.applicantId,
          referenceId: 0,
          firstName: [''],
          mobileNo: [''],
          address: [''],
          referenceStatus: ['']
        })
      })
    });
  }



  getTvrDetails() {
    const data = {
      applicantId: this.applicantId
    };
    this.tvrService.getTvrDetails(data).subscribe((res: any) => {
      this.tvrData = res.ProcessVariables.tvr;
      if (this.tvrData) {
      this.teleVerificationForm.patchValue(this.tvrData);

      }

      // this.teleVerificationForm.controls['residenceStabilityConfirmed'].setValue(this.tvrData.residenceStabilityConfirmed.toString());
      // this.teleVerificationForm.controls['radioAddress'].setValue(this.tvrData.residenceStabilityConfirmed.toString());
      // this.teleVerificationForm.controls['customerAvailabilty'].setValue(this.tvrData.residenceStabilityConfirmed.toString());
      // this.initForm();
      console.log('tvrResponse', this.tvrData);
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
      // const appiyoError = res.Error;
      // const apiError = res.ProcessVariables.error.code;

      // if (appiyoError === '0' && apiError === '0') {
      //   // alert(response.ProcessVariables.error.message);
      //   this.isAlert = true;
      //   setTimeout(() => {
      //     this.isAlert = false;
      //   }, 3000);
      // }
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
      console.log('TVR-Dashboard_list', this.tvrDashboardList);
    });

  }

  async onSave() {
    // console.log('on save', this.teleVerificationForm.value);
    this.tvrDetails = this.teleVerificationForm.value;
    this.tvrDetails.residenceStabilityConfirmed = parseInt(this.teleVerificationForm.value.residenceStabilityConfirmed)
    this.tvrDetails.radioAddress = parseInt(this.teleVerificationForm.value.radioAddress)
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
    const data =  this.tvrDetails['applicationReferences'];
    console.log(data);
    this.tvrDetails.applicationReferences = [this.tvrDetails['applicationReferences'].reference1,
     this.tvrDetails['applicationReferences'].reference2];
    
    console.log(this.tvrDetails);
    this.saveOrUpdateTvrDetails();
    console.log('TVR_Get_Details', this.tvrData);

    // this.router.navigateByUrl(`pages/dde/${this.leadId}/tvr-details`);
  }




}
