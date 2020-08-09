import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { CommomLovService } from "@services/commom-lov-service";
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';

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
  otherDetails: any;
  isDirty: boolean;

  constructor( private labelsData: LabelsService,
               private formBuilder: FormBuilder,
               private router: Router,
               private aRoute: ActivatedRoute,
               private commomLovService: CommomLovService,
               private personalDiscussionService: PersonalDiscussionService,
               private pdDataService: PdDataService,
               private utilityService: UtilityService,
               private toasterService: ToasterService,
               ) { }

   ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getApplicantId();
    this.getLOV();
    this.getPdDetails();
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
    this.otherDetailsForm = this.formBuilder.group({
      agricultureProof: ["", Validators.required],
      income: ["", Validators.required],
      securedLoans: ["", Validators.required],
      unsecuredLoans: ["", Validators.required],
      creditors: ["", Validators.required],
      debtors: ["", Validators.required],
      fixedAssets: ["", Validators.required],
      applicationNo: [{ value: '', disabled: true }],
      area: ["", Validators.required],
      place: ["", Validators.required],
      geoTagInfo: ["", Validators.required],
      routeMap: ["", Validators.required],
      equitasBranchName: [{ value: '', disabled: true }],
      distanceFromEquitas: [{ value: '', disabled: true }],
      pdOfficerName: ["", Validators.required],
      empCode: ["", Validators.required],
      date: ["", Validators.required],
      product: [{ value: '', disabled: true }],
      sourcingChannel: [{ value: '', disabled: true }],
      timeOfVerification: ["", Validators.required],
      loanAmount: ["", Validators.required],
      marginMoney: ["", Validators.required],
      emiAffordability: ["", Validators.required],
      sourceOfMarginMoney: [{ value: '', disabled: true }],
    });
  }

  // GET PD-DETAILS FOR APPLICANT_ID
  getPdDetails() {
    // console.log('pd version', this.version);
    // console.log('pd applicant id', this.applicantId);
    // // if (this.version === 'undefined') {
    // //   this.version = '0';
    // //   console.log('in undefined condition version', this.version);
    // // }
    // const data = {
    //   applicantId: this.applicantId,
    //   pdVersion: this.version,
    // };
    // console.log('in request data version', this.version);
    // this.personalDiscussionService.getPdData(data).subscribe((res: any) => {
    //   const response = res.ProcessVariables;
    //   if (response.error.code === '0') {
    //     this.otherDetails = res.ProcessVariables.otherDetails;
    //     // console.log('Applicant Details in calling get api ', this.otherDetails);
    //     if (this.otherDetails) {
    //       // this.setFormValue();
    //   // this.pdDataService.setCustomerProfile(this.otherDetails);
    //     }
    //   }
    // });
  }

  //PATCH_FORM_VALUES
  setFormValue() {
    // const otherDetailsFormModal = this.otherDetails || {};
    this.otherDetailsForm.patchValue({ 
      agricultureProof: this.otherDetails.agricultureProof || '',
      income: this.otherDetails.income || '',
      securedLoans: this.otherDetails.securedLoans || '',
      unsecuredLoans: this.otherDetails.unsecuredLoans || '',
      creditors: this.otherDetails.creditors || '',
      debtors: this.otherDetails.debtors || '',
      fixedAssets: this.otherDetails.fixedAssets || '',
      applicationNo: this.otherDetails.applicationNo || '',
      area: this.otherDetails.area || '',
      place: this.otherDetails.place || '',
      geoTagInfo: this.otherDetails.geoTagInfo || '',
      routeMap: this.otherDetails.routeMap || '',
      equitasBranchName: this.otherDetails.equitasBranchName || '',
      distanceFromEquitas: this.otherDetails.distanceFromEquitas || '',
      pdOfficerName: this.otherDetails.pdOfficerName || '',
      empCode: this.otherDetails.empCode || '',
      date: this.otherDetails.date ? this.utilityService.getDateFromString(this.otherDetails.date) : '',
      product: this.otherDetails.product || '',
      sourcingChannel: this.otherDetails.sourcingChannel || '',
      timeOfVerification: this.otherDetails.timeOfVerification || '',
      loanAmount: this.otherDetails.loanAmount || '',
      marginMoney: this.otherDetails.marginMoney || '',
      emiAffordability: this.otherDetails.emiAffordability || '',
      sourceOfMarginMoney: this.otherDetails.sourceOfMarginMoney || '',
    });
  }

  //SAVE_OR_UPDATE_OTHER-DETAILS
  saveOrUpdateOtherDetails() {
    const formValues = this.otherDetailsForm.getRawValue();
    console.log("FORMVALUES::::", formValues);
    const data = {
      leadId: this.leadId,
      applicantId: this.applicantId,
      userId: localStorage.getItem('userId'),
      ...formValues,
      date: this.utilityService.convertDateTimeTOUTC(formValues.date, 'DD/MM/YYYY'),
    }
    if (this.otherDetailsForm.valid === true) {
      this.personalDiscussionService.saveOrUpdatePdData(data).subscribe((res: any) => {
          const response = res.ProcessVariables;
          // console.log("RESPONSE_SAVEUPDATE_API::", response)
          if (res.error.code === "0") {
            this.toasterService.showSuccess("Record Saved Successfully", "Other Details");
            // this.toasterService.showSuccess(message, '');
            }
        });
    } else {
      this.toasterService.showError("Please fill all mandatory fields.", "Other Details");
    }

  }
  
  // SUBMIT FORM
  onFormSubmit() {
    this.isDirty = true;
    this.saveOrUpdateOtherDetails();
  }

  onBack() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/reference-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/reference-details`]);
    }
  }

  onNext() {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
  }

}
