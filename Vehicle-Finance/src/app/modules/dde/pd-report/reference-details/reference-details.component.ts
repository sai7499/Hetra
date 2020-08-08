import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  referenceDetailsForm: FormGroup;

  leadId: number;
  applicantId: any;
  version: any;
  LOV: any = {};
  labels: any = {};
  valuesToYesNo: any = [{key: 1, value: 'Yes'}, {key: 0, value: 'No'}];

  constructor(private labelsData: LabelsService,
              private formBuilder: FormBuilder,
              private router: Router,
              private aRoute: ActivatedRoute,
              private commomLovService: CommomLovService) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getApplicantId();
    this.getLOV();
    this.initForm();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data)
    );
  }

  // GET LEADID FROM URL
  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log("LEADID::", this.leadId);
  }

  //GET APPLICANTID
  getApplicantId() {
    this.aRoute.params.subscribe((value: any) => {
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
    });
    console.log('ApplicantId::', this.applicantId);
    console.log('Version::', this.version);
  }
  
    //GET ALL LOVS
    getLOV() {
      this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
      console.log('LOV::', this.LOV);
    }

  //FORMGROUP
  initForm() {
    this.referenceDetailsForm = this.formBuilder.group({
      referrerFirstName: ["", Validators.required],
      referrerMiddleName: ["", Validators.required],
      referrerLastName: ["", Validators.required],
      referrerFullName: [{ value: '', disabled: true }],
      referrerRelationship: ["", Validators.required],
      referrerOfficePhoneNo: ["", Validators.required],
      referrerAddressLine1: ["", Validators.required],
      referrerAddressLine2: ["", Validators.required],
      referrerAddressLine3: ["", Validators.required],
      pincode: ["", Validators.required],
      city: ["", Validators.required],
      district: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      referrerAssetName: ["", Validators.required],
      referenceInfoFirstName: ["", Validators.required],
      refereneceInfoMiddleName: ["", Validators.required],
      referenceInfoLastName: ["", Validators.required],
      referenceInfoFullName: [{ value: '', disabled: true }],
      referenceInfoAddressLine1: ["", Validators.required],
      referenceInfoAddressLine2: ["", Validators.required],
      referenceInfoAddressLine3: ["", Validators.required],
      referenceInfoOfficeNo: ["", Validators.required],
      referenceRelationship: ["", Validators.required],
      natureOfBusiness: ["", Validators.required],
      selfieWithCustomer: ["", Validators.required],
      uploadImages: ["", Validators.required],
      pdStatus: ["", Validators.required],
      opinionOfPdOfficer: ["", Validators.required],
    });
  }

  onFormSubmit() {

  }

  onBack() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/income-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/income-details`]);
    }
  }

  onNext() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/other-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/other-details`]);
    }
  }

}
