import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { CommomLovService } from "@services/commom-lov-service";

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.css']
})
export class OtherDetailsComponent implements OnInit {
  otherDetailsForm: FormGroup;

  leadId: number;
  applicantId: any;
  version: any;
  labels: any = {};
  LOV: any = {};

  constructor( private labelsData: LabelsService,
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
    this.aRoute.parent.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
      this.version = value.version;
      console.log('ApplicantId::', this.applicantId);
      console.log('Version::', this.version);
    });
  }

  //GET ALL LOVS
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOV::', this.LOV);
  }

  //FORMGROUP
  initForm() {
    this.otherDetailsForm = this.formBuilder.group({
      agricultureProof: [""],
      income: [""],
      securedLoans: [""],
      unSecuredLoans: [""],
      creditors: [""],
      debtors: [""],
      fixedAssets: [""],
      applicationNo: [""],
      area: [""],
      place: [""],
      geotagInformation: [""],
      routeMap: [""],
      equitasBranchName: [""],
      distanceEquitasAssetBranch: [""],
      soName: [""],
      employeeCode: [""],
      date: [""],
      product: [""],
      sourcingChannel: [""],
      tomeOfVerification: [""]
    });
  }

  //SUBMIT FORM
  onFormSubmit() {
  }

  onBack() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/reference-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/reference-details`]);
    }
  }

  onNext() {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list`]);
  }

}
