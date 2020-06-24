import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoanDetails } from '@model/lead.model';

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


  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private commonLovService: CommomLovService) { }

  ngOnInit() {
    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.loanDetailsLov = value ? value[0].loanDetail[0] : {};
      // this.setFormValue();
    });


  }
  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
  }

  initForm() {
    this.loanDetailsForm = new FormGroup({
      costOfVehicle: new FormControl(''),
      modelType: new FormControl(''),
      reqLoanAmount: new FormControl(''),
      marginMoney: new FormControl(''),
      loanAmtReq: new FormControl(''),
      sourcePurchase: new FormControl(''),
      nameOfFinancer: new FormControl(''),
      awareMarginMoney: new FormControl(''),
      nameOfChannel: new FormControl(''),
      sellerVehicle: new FormControl(''),
      knowAbtVehicle: new FormControl(''),
      moneyInvested: new FormControl(''),
      moneyBorrowed: new FormControl(''),
      marketValue: new FormControl(''),
      purchasedValue: new FormControl(''),
      vehicleCondition: new FormControl(''),
      usageFunds: new FormControl(''),
      vehicleConditions: new FormControl(''),
      remarksOthers: new FormControl(''),
      earlierDriving: new FormControl(''),
      runningAttached: new FormControl(''),
      awareDue: new FormControl(''),
      vehicleMake: new FormControl(''),
      model1: new FormControl(''),
      registrationNo: new FormControl(''),
      regCopyVerified: new FormControl(''),
      hpaNbfc: new FormControl(''),
      engineNumber: new FormControl(''),
      chassisNumber: new FormControl(''),
      permitDate: new FormControl(''),
      fitnessDate1: new FormControl(''),
      taxDate: new FormControl(''),
      insuranceCopy: new FormControl(''),
      insuranceDate: new FormControl(''),
      vehicleVerified: new FormControl(''),
      physicalCondition: new FormControl(''),
      vehicleRoute: new FormControl(''),
      noTrips: new FormControl(''),
      tripAmt: new FormControl(''),
      selfDriver: new FormControl(''),
      remarks: new FormControl('')
    });
  }

  setFormValue() {
    const loanDetailsModal = this.ddeStoreService.getLoanDetails() || {};
    // console.log("customerProfile", customerProfileModal);

    this.loanDetailsForm.patchValue({
      vehicleCost: loanDetailsModal.vehicleCost || '',
      modelType: loanDetailsModal.model || '',
      loanAmt: loanDetailsModal.reqLoanAmount || '',
      marginMoney: loanDetailsModal.marginMoney || '',
      loanAmtReq: loanDetailsModal.usedVehicleLoanAmountReq || '',
      sourcePurchase: loanDetailsModal.sourceOfVehiclePurchase || '',
      nameOfFinancer: loanDetailsModal.marginMoneySource || '',
      awareMarginMoney: loanDetailsModal.coAapplicantAwareMarginMoney || '',
      nameOfChannel: loanDetailsModal.channelSourceName || '',
      sellerVehicle: loanDetailsModal.vehicleSeller || '',
      knowAbtVehicle: loanDetailsModal.proposedVehicle || '',
      moneyInvested: loanDetailsModal.invesmentAmount || '',
      moneyBorrowed: loanDetailsModal.marginMoneyBorrowed || '',
      marketValue: loanDetailsModal.marketValueProposedVehicle || '',
      purchasedValue: loanDetailsModal.purchasePrice || '',
      vehicleCondition: loanDetailsModal.vehicleCondition || '',
      usageFunds: loanDetailsModal.fundsUsage || '',
      vehicleConditions: loanDetailsModal.earlierVehicleApplication || '',
      remarksOthers: loanDetailsModal.remarksOthers || '',
      earlierDriving: loanDetailsModal.drivingVehicleEarlier || '',
      runningAttached: loanDetailsModal.vehicleAttachedPlying || '',
      awareDue: loanDetailsModal.awareDueDateEmiAmount || '',
      vehicleMake: loanDetailsModal.vehicleMake || '',
      model1: loanDetailsModal.modelInYear || '',
      registrationNo: loanDetailsModal.regNo || '',
      regCopyVerified: loanDetailsModal.regCopVfd || '',
      hpaNbfc: loanDetailsModal.vehicleHpaNbfc || '',
      engineNumber: loanDetailsModal.engineNumber || '',
      chassisNumber: loanDetailsModal.chasisNumber || '',
      permitDate: loanDetailsModal.permitValidity || '',
      fitnessDate1: loanDetailsModal.fitnessValidity || '',
      taxDate: loanDetailsModal.taxValidity || '',
      insuranceCopy: loanDetailsModal.insuranceCopyVerified || '',
      insuranceDate: loanDetailsModal.insuranceValidity || '',
      vehicleVerified: loanDetailsModal.vehiclePhsicallyVerified || '',
      physicalCondition: loanDetailsModal.conditionOfVehicle || '',
      vehicleRoute: loanDetailsModal.vehicleRoute || '',
      noTrips: loanDetailsModal.noOfTrips || '',
      tripAmt: loanDetailsModal.amtPerTrip || '',
      selfDriver: loanDetailsModal.selfDrivenOrDriver || '',
      remarks: loanDetailsModal.remarks || ''
    });
  }

  onFormSubmit() {
    const formModal = this.loanDetailsForm.value;
    const loanDetailsModal = { ...formModal };
    // this.ddeStoreService.setLoanDetails(loanDetailsModal);
    // this.router.navigate(['/pages/dde']);

  }

}
