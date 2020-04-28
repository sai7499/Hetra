import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

@Component({
  selector: 'app-customer-profile-details',
  templateUrl: './customer-profile-details.component.html',
  styleUrls: ['./customer-profile-details.component.css']
})
export class CustomerProfileDetailsComponent implements OnInit {

  customerProfileForm: FormGroup;

  public customerProfileLov: any = {};
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
      this.customerProfileLov = value ? value[0].customerProfile[0] : {};
      // console.log('customerProfileLov', this.customerProfileLov);
      this.setFormValue();
    });

  }

  initForm() {
    this.customerProfileForm = new FormGroup({
        addressRecord: new FormControl(''),
        noEmployees: new FormControl(''),
        nameBoardSeen: new FormControl(''),
        officePremises: new FormControl(''),
        sizeOfOffice: new FormControl(''),
        ratingBySo: new FormControl(''),
        mismatchAddress: new FormControl(''),
        selfieWithHouse: new FormControl(''),
        ownershipProof: new FormControl(''),
        metCustomer: new FormControl('')
    });
  }

  setFormValue() {
    const customerProfileModal = this.ddeStoreService.getCustomerProfile() || {};
    // console.log("customerProfile", customerProfileModal);

    this.customerProfileForm.patchValue({
      addressRecord: customerProfileModal.addressRecord || '',
      noEmployees: customerProfileModal.noEmployees || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeOfOffice: customerProfileModal.sizeOfOffice || '',
      ratingBySo: customerProfileModal.ratingBySo || '',
      mismatchAddress: customerProfileModal.mismatchAddress || '',
      selfieWithHouse: customerProfileModal.selfieWithHouse || '',
      ownershipProof: customerProfileModal.ownershipProof || '',
      metCustomer: customerProfileModal.metCustomer || ''
    });
  }

  onFormSubmit() {
    const formModal = this.customerProfileForm.value;
    const customerProfileModal = {...formModal};
    // this.ddeStoreService.setCustomerProfile(customerProfileModal);
    this.router.navigate(['/pages/fl-and-pd-report/loan-details']);
  }

}
