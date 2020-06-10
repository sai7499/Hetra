import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { DdeStoreService } from '@services/dde-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';

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
     this.leadId =  this.route.snapshot.params['leadId'];
     console.log(this.leadId);
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
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((value) => {
      this.LOV = value;
      // this.tvrLov = value ? value[0].trackVehicle[0] : {};
    });

    console.log(this.LOV);
  }

  // private defaultTvr = {
  //   leadNumber: '',
  //     applicantName: '',
  //     soName: '',
  //     assetCost: '',
  //     financeAmt: '',
  //     tenureInMonth: '',
  //     srcOfProposal: '',
  //     product: '',
  //     emi: '',
  //       ndForProposedVehicle: '',
  //     route: '',
  //     contractDetails: '',
  //     typeOfGoods: '',
  //     amountRequested: '',
  //     fundEndUse: '',
  //     tenureRequested: '',
  //       residence: '',
  //     otherVehiclesOwned: '',
  //     phoneNo: '',
  //     addressConfirmed: '',
  //     anyOtherLoansAsset: '',
  //     teleVerificationEmi: '',
  //     noOfYears: '',
  //     cc: '',
  //     status: '',
  //     dob: '',
  //     spokenTo: '',
  //     familyMembers: '',
  //     relation: '',
  //     tvrDate: '',
  //     tvrTime: '',
  //     tvrDoneBy: '',
  //     eCode: '',
  //     office: '',
  //     wrkExperience: '',
  //     officePhnNo: '',
  //     extn: '',
  //     wrkStability: '',
  //     natureOfBusiness: '',
  //     typeOfTransaction: '',
  //     businessStability: '',
  //     compNameAddress: '',
  //     designation: '',
  //     industryType: '',
  //     yrsInEmployment: '',
  //     ifBusiness: '',
  //     employees: '',
  //     spokenTo2: '',
  //     // relation: '',
  //     monthlyGrossSalary: '',
  //     otherIncome: '',
  //     decision: ''

  // }

  initForm() {
    this.teleVerificationForm = this.fb.group({
      leadId: [''],
      applicantName: [''],
      soName: [''],
      assetCost: [''],
      assetType: [''],
      financeAmt: [''],
      tenureInMonth:[''],
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
      residentPhnNo: [''],
      residentAddress: [''],

      otherLoans: [''],
      otherLoanEmi: [''],
      residentNoOfYrs: [''],
      cc: [''],
      status: [true],
      dob: [''],
      spokenTo: [''],
      familyMembers: [''],
      relation: [''],
      tvrDate: [''],
      tvrTime: [''],
      radioAddress: [''],
      residenceStabilityConfirmed: [''],
      customerAvailabilty: [''],
      tvrDoneBy: [''],
      eCode: [''],
      office: [''],
      wrkExperience: [''],
      officePhnNo: [''],
      extn: [''],
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
      spokenTo2: [''],
      // relation: ,tion],
      monthlyGrossSalary: [''],
      otherIncome: [''],
      decision: [''],
      cibilOverDue: [''],
      cibilClarification: [''],
      remarks: ['']
    });
  }

  // setFormValue() {
  // //   const tvrModel = this.ddeStoreService.trackvehicle() || {};
  // //   console.log(tvrModel);
  // this.teleVerificationForm = this.fb.group({
  //   leadNumber: [this.tvrData.leadNumber],
  //   applicantName: [this.tvrData.applicantName],
  //   soName: [this.tvrData.soName],
  //   assetCost: [this.tvrData.assetCost],
  //   financeAmt: [this.tvrData.financeAmt],
  //   tenureInMonth: [this.tvrData.tenureInMonth],
  //   srcOfProposal: [this.tvrData.srcOfProposal],
  //   product: [this.tvrData.product],
  //   emi: [this.tvrData.emi],
  //   ndForProposedVehicle: [this.tvrData.ndForProposedVehicle],
  //   route: [this.tvrData.route],
  //   contractDetails: [this.tvrData.contractDetails],
  //   typeOfGoods: [this.tvrData.typeOfGoods],
  //   amountRequested: [this.tvrData.amountRequested],
  //   fundEndUse: [this.tvrData.fundEndUse],
  //   tenureRequested: [this.tvrData.tenureRequested],
  //   residence: [this.tvrData.residence],
  //   otherVehiclesOwned: [this.tvrData.otherVehiclesOwnedOwned],
  //   phoneNo: [this.tvrData.officePhnExt],
  //   addressConfirmed: [this.tvrData.addressConfirmed],
  //   anyOtherLoansAsset: [this.tvrData.anyOtherLoansAsset],
  //   teleVerificationEmi: [this.tvrData.teleVerificationEmi],
  //   noOfYears: [this.tvrData.yrsInEmployment],
  //   cc: [this.tvrData.cc],
  //   status: [this.tvrData.status],
  //   dob: [this.tvrData.dob],
  //   spokenTo: [this.tvrData.spokenTo],
  //   familyMembers: [this.tvrData.familyMembers],
  //   relation: [this.tvrData.relation],
  //   tvrDate: [this.tvrData.tvrDate],
  //   tvrTime: [this.tvrData.tvrTime],
  //   tvrDoneBy: [this.tvrData.tvrDoneBy],
  //   eCode: [this.tvrData.eCode],
  //   office: [this.tvrData.office],
  //   wrkExperience: [this.tvrData.wrkExperience],
  //   officePhnNo: [this.tvrData.officePhnNo],
  //   extn: [this.tvrData.extn],
  //   wrkStability: [this.tvrData.wrkStability],
  //   natureOfBusiness: [this.tvrData.natureOfBusiness],
  //   typeOfTransaction: [this.tvrData.typeOfTransaction],
  //   businessStability: [this.tvrData.businessStability],
  //   compNameAddress: [this.tvrData.compNameAddress],
  //   designation: [this.tvrData.designation],
  //   industryType: [this.tvrData.industryType],
  //   yrsInEmployment: [this.tvrData.yrsInEmployment],
  //   ifBusiness: [this.tvrData.ifBusiness],
  //   employees: [this.tvrData.employees],
  //   spokenTo2: [this.tvrData.spokenTo],
  //   // relation: [this.tvrData.relation],
  //   monthlyGrossSalary: [this.tvrData.monthlyGrossSalary],
  //   otherIncome: [this.tvrData.otherIncome],
  //   decision: [this.tvrData.decision]
  // )}
  // }

  getTvrDetails() {
    // const data = {
    //   applicantId: 43
    // };
    this.tvrService.getTvrDetails().subscribe((res: any) => {
      this.tvrData = res.ProcessVariables.tvr;
      this.teleVerificationForm.patchValue(this.tvrData);
      this.teleVerificationForm.controls['residenceStabilityConfirmed'].setValue(this.tvrData.residenceStabilityConfirmed.toString())
      this.teleVerificationForm.controls['radioAddress'].setValue(this.tvrData.residenceStabilityConfirmed.toString())
      this.teleVerificationForm.controls['customerAvailabilty'].setValue(this.tvrData.residenceStabilityConfirmed.toString())
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
    this.tvrDetails['applicantId'] = 43;
    const data = this.tvrDetails;
    console.log('save tvr details', this.tvrDetails);
    this.tvrService.setTvrDetails(data).subscribe((res: any) => {
      console.log('saveUpdateTvrDetails', res);
      const appiyoError = res.Error;
      const apiError = res.ProcessVariables.error.code;

      if (appiyoError === '0' && apiError === '0') {
        // alert(response.ProcessVariables.error.message);
        this.isAlert = true;
        setTimeout(() => {
          this.isAlert = false;
        }, 3000);
      }
    });
  }

  async onSave() {
    // console.log('on save', this.teleVerificationForm.value);
    this.tvrDetails = this.teleVerificationForm.value;
    this.tvrDetails.residenceStabilityConfirmed = parseInt(this.teleVerificationForm.value.residenceStabilityConfirmed)
    this.tvrDetails.radioAddress = parseInt(this.teleVerificationForm.value.radioAddress)
    this.tvrDetails.customerAvailabilty = parseInt(this.teleVerificationForm.value.customerAvailabilty)
    console.log(this.tvrDetails);
    this.saveOrUpdateTvrDetails();

    // this.router.navigateByUrl(`pages/dde/${this.leadId}/tvr-details`);
  }




}
