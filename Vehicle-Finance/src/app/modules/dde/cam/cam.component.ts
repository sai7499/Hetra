import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CamService } from '@services/cam.service';
import { ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { ToasterService } from '@services/toaster.service';
@Component({
  selector: 'app-cam',
  templateUrl: './cam.component.html',
  styleUrls: ['./cam.component.css']
})
export class CamComponent implements OnInit {
  labels: any = {};
  leadId: number;
  basicDetails: any;
  sourcingDetails: any;
  proposedVehicleDetails: any;
  partyToAgreement: any;
  partyToAnyOtherRemarks: any;
  proposedToAnyOtherRemarks: any;
  cibilSynopsys: any;
  cibilSynopsysToAnyOtherRemark: any;
  bankingSummary: any;
  camDetails: any;
  fleetSummary: any;
  trackValidation: any;
  keyFinancial: any;
  creditOfficersRemarks: any;
  cmRecommendation: any;
  acmRecommendation: any;
  ncmBhApprovalRecommendation: any;
  usedCvCam: boolean;
  productCategoryName: string;
  otherDeviation: any;
  camDetailsForm: any;
  submitted: boolean;
  userId: string;
  customerSelectionCriteria: any;

  constructor(private labelsData: LabelsService,
    private camService: CamService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
      }
    );
    this.getLeadId();
    this.userId = localStorage.getItem("userId");
    const leadData = this.createLeadDataService.getLeadSectionData();
    const leadSectionData = leadData as any;
    console.log('getting lead data...>', leadSectionData);
    this.productCategoryName = leadSectionData.leadDetails['productCatName'];
    console.log('getting productCategoryName...>', this.productCategoryName);

    // this.getCamUsedCvDetails();
    if (this.productCategoryName == "Used Commercial Vehicle") {
      this.usedCvCam = true;
      this.getCamUsedCvDetails();
    }

    this.camDetailsForm = this.formBuilder.group({
      proposedVehicleRemarks: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(
          /^[a-zA-Z0-9 ]*$/
        ),
      ]),
      cibilSynopsisRemarks: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(
          /^[a-zA-Z0-9 ]*$/
        ),
      ]),
      trackValidationRemarks: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(
          /^[a-zA-Z0-9 ]*$/
        ),
      ]),
      fleetRemarks: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(
          /^[a-zA-Z0-9 ]*$/
        ),
      ]),
      keyFinancialRemarks: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(
          /^[a-zA-Z0-9 ]*$/
        ),
      ]),
      

    })
  }
  getCamUsedCvDetails() {
    // this.usedCvCam = true
    const data = {
      leadId: this.leadId,
    };
    this.camService.getCamUsedCvDetails(data).subscribe((res: any) => {
      console.log(res)
      this.camDetails = res.ProcessVariables
      this.basicDetails = res.ProcessVariables['basicDetailsObj'];
      this.sourcingDetails = res.ProcessVariables['sourcingObj'];
      this.proposedVehicleDetails = res.ProcessVariables['proposedVehiclesObj'];
      this.partyToAgreement = res.ProcessVariables['partyToAgreementObj'];
      this.cibilSynopsys = res.ProcessVariables['cibilSynopsysObj'];
      this.bankingSummary = res.ProcessVariables['bankingSummaryObj']
      this.fleetSummary = res.ProcessVariables['fleetSummaryObj']
      this.trackValidation = res.ProcessVariables['trackValidationObj']
      this.customerSelectionCriteria = res.ProcessVariables['customerSelectionCriteriaObj']
      this.otherDeviation = res.ProcessVariables['otherDeviationsObj']
      this.keyFinancial = res.ProcessVariables['keyFinancialObj']
      this.creditOfficersRemarks = res.ProcessVariables['creditOfficersRemarksObj']
      this.cmRecommendation = res.ProcessVariables['cmRecommendationObj']
      this.acmRecommendation = res.ProcessVariables['acmRecommendationObj']
      this.ncmBhApprovalRecommendation = res.ProcessVariables['ncmBhApprovalRecommendationObj']
      
      this.camDetailsForm.patchValue({
        proposedVehicleRemarks:this.camDetails.proposedToAnyOtherRemarks? this.camDetails.proposedToAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        cibilSynopsisRemarks:this.camDetails.cibilSynopsysToAnyOtherRemark? this.camDetails.cibilSynopsysToAnyOtherRemark : null,
      })
      this.camDetailsForm.patchValue({
        trackValidationRemarks:this.camDetails.trackValidationToAnyOtherRemarks? this.camDetails.trackValidationToAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        fleetRemarks:this.camDetails.fleetSummaryToAnyOtherRemarks? this.camDetails.fleetSummaryToAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        keyFinancialRemarks:this.camDetails.keyFinancialObjAnyOtherRemarks? this.camDetails.keyFinancialObjAnyOtherRemarks : null,
      })
    })
  }
  onSubmit() {
    console.log(this.camDetailsForm);

    this.submitted = true;
    // stop here if form is invalid
    if (this.camDetailsForm.invalid) {
      this.toasterService.showError(
        "Fields Missing Or Invalid Pattern Detected",
        "OD Details"
      );
      return;
    } else {
      this.submitted = true;

      const body = {
        leadId: this.leadId,
        userId: this.userId,

        anyOtherRemarks: {
          proposedVehicleRemarks: this.camDetailsForm.controls.proposedVehicleRemarks.value,
          cibilSynopsisRemarks: this.camDetailsForm.controls
            .cibilSynopsisRemarks.value,
          trackValidationRemarks: this.camDetailsForm.controls.trackValidationRemarks.value,
          fleetRemarks: this.camDetailsForm.controls.fleetRemarks.value,
          keyFinancialRemarks:this.camDetailsForm.controls.keyFinancialRemarks.value
        }
      };

      this.camService.saveCamRemarks(body).subscribe((res: any) => {
        console.log(res);

        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == "0") {
          // tslint:disable-next-line: prefer-const
          this.toasterService.showSuccess(
            "Saved Successfully",
            "Cam Remarks"
          );
          this.getCamUsedCvDetails();

        }
      });
    }
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }
}
