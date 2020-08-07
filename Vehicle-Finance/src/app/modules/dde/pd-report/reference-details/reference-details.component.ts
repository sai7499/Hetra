import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      (data) => (this.labels = data),
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
      referrerFirstName: [""],
      referrerMiddleName: [""],
      referrerLastName: [""],
      referrerFullName: [""],
      referrerRelationship: [""],
      referrerOfficePhoneNo: [""],
      referrerAddressLine1: [""],
      referrerAddressLine2: [""],
      referrerAddressLine3: [""],
      pincode: [""],
      city: [""],
      district: [""],
      state: [""],
      country: [""],
      referrerAssetName: [""],
      referenceInfoFirstName: [""],
      refereneceInfoMiddleName: [""],
      referenceInfoLastName: [""],
      referenceInfoFullName: [""],
      referenceInfoAddressLine1: [""],
      referenceInfoAddressLine2: [""],
      referenceInfoAddressLine3: [""],
      referenceInfoOfficeNo: [""],
      referenceRelationship: [""],
      natureOfBusiness: [""],
      selfieWithCustomer: [""],
      uploadImages: [""],
      pdStatus: [""],
      opinionOfPdOfficer: [""],
    });
  }

  onFormSubmit() {

  }

  onBack() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/income-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/income-details`]);
    }
  }

  onNext() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/other-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/other-details`]);
    }
  }

}
