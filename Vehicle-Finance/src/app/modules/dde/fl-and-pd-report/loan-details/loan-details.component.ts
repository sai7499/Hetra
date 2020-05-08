import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

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

  constructor(private labelsData: LabelsService, 
              private lovDataService:LovDataService,
              private router: Router,
              private ddeStoreService: DdeStoreService) {}

  ngOnInit() {
    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
      
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.loanDetailsLov = value ? value[0].loanDetail[0] : {};
      this.setFormValue();
    });

  }

  initForm() {
    this.loanDetailsForm = new FormGroup({
        costOfVehicle: new FormControl(''),
        modelType: new FormControl(''),
        loanAmt: new FormControl(''),
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
      costOfVehicle: loanDetailsModal.costOfVehicle || '',
        modelType: loanDetailsModal.modelType || '',
        loanAmt: loanDetailsModal.loanAmt || '',
        marginMoney: loanDetailsModal.marginMoney || '',
        loanAmtReq: loanDetailsModal.loanAmtReq || '',
        sourcePurchase: loanDetailsModal.sourcePurchase || '',
        nameOfFinancer: loanDetailsModal.nameOfFinancer || '',
        awareMarginMoney: loanDetailsModal.awareMarginMoney || '',
        nameOfChannel: loanDetailsModal.nameOfChannel || '',
        sellerVehicle: loanDetailsModal.sellerVehicle || '',
        knowAbtVehicle: loanDetailsModal.knowAbtVehicle || '',
        moneyInvested: loanDetailsModal.moneyInvested || '',
        moneyBorrowed: loanDetailsModal.moneyBorrowed || '',
        marketValue: loanDetailsModal.marketValue || '',
        purchasedValue: loanDetailsModal.purchasedValue || '',
        vehicleCondition: loanDetailsModal.vehicleCondition || '',
        usageFunds: loanDetailsModal.usageFunds || '',
        vehicleConditions: loanDetailsModal.vehicleConditions || '',
        remarksOthers: loanDetailsModal.remarksOthers || '',
        earlierDriving: loanDetailsModal.earlierDriving || '',
        runningAttached: loanDetailsModal.runningAttached || '',
        awareDue: loanDetailsModal.awareDue || '',
        vehicleMake: loanDetailsModal.vehicleMake || '',
        model1: loanDetailsModal.model1 || '',
        registrationNo: loanDetailsModal.registrationNo || '',
        regCopyVerified: loanDetailsModal.regCopyVerified || '',
        hpaNbfc: loanDetailsModal.hpaNbfc || '',
        engineNumber: loanDetailsModal.engineNumber || '',
        chassisNumber: loanDetailsModal.chassisNumber || '',
        permitDate: loanDetailsModal.permitDate || '',
        fitnessDate1: loanDetailsModal.fitnessDate1 || '',
        taxDate: loanDetailsModal.taxDate || '',
        insuranceCopy: loanDetailsModal.insuranceCopy || '',
        insuranceDate: loanDetailsModal.insuranceDate || '',
        vehicleVerified: loanDetailsModal.vehicleVerified || '',
        physicalCondition: loanDetailsModal.physicalCondition || '',
        vehicleRoute: loanDetailsModal.vehicleRoute || '',
        noTrips: loanDetailsModal.noTrips || '',
        tripAmt: loanDetailsModal.tripAmt || '',
        selfDriver: loanDetailsModal.selfDriver || '',
        remarks: loanDetailsModal.remarks || ''
    });
  }

  onFormSubmit() {
    const formModal = this.loanDetailsForm.value;
    const loanDetailsModal = {...formModal};
    // this.ddeStoreService.setLoanDetails(loanDetailsModal);
    this.router.navigate(['/pages/dde']);
  }

}
