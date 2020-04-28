import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

@Component({
    templateUrl: './applicant-details.component.html',
    styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailComponent implements OnInit {
  
  applicantForm: FormGroup;

  public applicantLov: any = {};
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
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
      console.log('applicantLov', this.applicantLov);
      this.setFormValue();
    });

  }

  initForm() {
    this.applicantForm = new FormGroup({
        applicantName: new FormControl(''),
        fatherName: new FormControl(''),
        gender: new FormControl(''),
        maritalStatus: new FormControl(''),
        physicallyChallenged: new FormControl(''),
        residenceNo: new FormControl(''),
        officeNo: new FormControl(''),
        mobile: new FormControl(''),
        residenceAddress: new FormControl(''),
        bankName: new FormControl(''),
        accountNo: new FormControl(''),
        landmark: new FormControl(''),
        locate: new FormControl(''),
        locality: new FormControl(''),
        residentialType: new FormControl(''),
        standardHouse: new FormControl(''),
        sizeOfHouse: new FormControl(''),
        stdOfLiving: new FormControl(''),
        houseOwnership: new FormControl(''),
        ratingBySo: new FormControl('')
    });
  }

  setFormValue() {
    const applicantModal = this.ddeStoreService.getApplicantDetails() || {};
    console.log("Applicant Model", applicantModal);
    
    this.applicantForm.patchValue({
      applicantName: applicantModal.applicantName  || '',
      fatherName: applicantModal.fatherName || '',
      gender: applicantModal.gender || '',
      maritalStatus: applicantModal.maritalStatus  || '',
      physicallyChallenged: applicantModal.physicallyChallenged || '',
      residenceNo: applicantModal.residenceNo  || '',
      officeNo: applicantModal.officeNo || '',
      mobile: applicantModal.mobile || '',
      residenceAddress: applicantModal.residenceAddress || '',
      bankName: applicantModal.bankName || '',
      accountNo: applicantModal.accountNo  || '',
      landmark: applicantModal.landmark || '',
      locate: applicantModal.locate || '',
      locality: applicantModal.locality || '',
      residentialType: applicantModal.residentialType  || '',
      standardHouse: applicantModal.standardHouse  || '',
      sizeOfHouse: applicantModal.sizeOfHouse  || '',
      stdOfLiving: applicantModal.stdOfLiving  || '',
      houseOwnership: applicantModal.houseOwnership || '',
      ratingBySo: applicantModal.ratingBySo || ''
    });
  }

  onFormSubmit() {
    const formModal = this.applicantForm.value;
    const applicantFormModal = {...formModal};
    // this.ddeStoreService.setApplicantDetails(applicantFormModal);
    this.router.navigate(['/pages/fl-and-pd-report/customer-profile']);
  }

}
