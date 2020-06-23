import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
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
  leadId: number;
  userId: number;
  custProfileDetails: any = [];

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private personalDiscusionService: PersonalDiscussionService,
    private toasterService: ToasterService) { }

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

  saveOrUpdatePdData() {

    const data = {

      leadId: 83,
      userId: "1001",
      applicantId: 63,
      customerProfileDetails: this.custProfileDetails
    }
    this.personalDiscusionService.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log("save or update PD Response", res)
      this.toasterService.showSuccess("customer Profle Details saved !", '')
    })

  }

  onFormSubmit() {
    this.customerProfileForm.value.addressRecord = parseInt(this.customerProfileForm.value.addressRecord);
    const formModal = this.customerProfileForm.value;
    formModal.noEmployees = parseInt(formModal.noEmployees);
    formModal.nameBoardSeen = parseInt(formModal.nameBoardSeen);
    formModal.selfieWithHouse = parseInt(formModal.selfieWithHouse);
    formModal.ownershipProof = parseInt(formModal.ownershipProof);
    formModal.metCustomer = parseInt(formModal.metCustomer);
    const customerProfileModal = { ...formModal };
    console.log("profile form", this.customerProfileForm);
    this.custProfileDetails = this.customerProfileForm.value;

    this.saveOrUpdatePdData();

    // this.router.navigate(['/pages/fl-and-pd-report/loan-details']);
  }

}
