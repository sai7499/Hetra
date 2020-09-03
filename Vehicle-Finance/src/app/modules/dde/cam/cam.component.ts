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
  usedCarCam: boolean;
  applicantDetails: any;
  bankingDetails: any;
  businessIncomeDetails: any;
  decisionSheet: any;
  finalLoanDetails: any;
  finalLoanEligibility: any;
  obligationDetails: any;
  loanEligibilityBasedOnInc: any;
  otherIncomeDetails: any;
  vehicleDetails: any;
  sourcingObj: any;
  manualDeviation: any;
  autoDeviation: any;
  newCvCam: boolean;
  bankingTxnDetails: any;
  cibilEnquiries: any;
  cibilJustification: any;
  detailsOfCibilFiPD: any;
  existingExposure: any;
  fleetDetails: any;
  otherDeviations: any;
  proposedVehiclesDetails: any;
  referenceCheck: any;
  repaymentTrackRecord: any;
  coRecommendationTvrDetails: any;
  customerBackgroundSalesRecommendation: any;
  ncmBhRecommendation: any;
  vehicleDeploymentDetails: any;


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
    } else if (this.productCategoryName == "Used Car") {
      this.usedCarCam = true
      this.getCamUsedCarDetails();
    }else if (this.productCategoryName == "New Commercial Vehicle") {
      this.newCvCam = true
      this.getCamNewCvDetails();
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
      this.autoDeviation = res.ProcessVariables['autoDeviation']
      this.customerSelectionCriteria = res.ProcessVariables['customerSelectionCriteriaObj']
      this.otherDeviation = res.ProcessVariables['otherDeviationsObj']
      this.keyFinancial = res.ProcessVariables['keyFinancialObj']
      this.creditOfficersRemarks = res.ProcessVariables['creditOfficersRemarksObj']
      this.cmRecommendation = res.ProcessVariables['cmRecommendationObj']
      this.acmRecommendation = res.ProcessVariables['acmRecommendationObj']
      this.ncmBhApprovalRecommendation = res.ProcessVariables['ncmBhApprovalRecommendationObj']

      this.camDetailsForm.patchValue({
        proposedVehicleRemarks: this.camDetails.proposedToAnyOtherRemarks ? this.camDetails.proposedToAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        cibilSynopsisRemarks: this.camDetails.cibilSynopsysToAnyOtherRemark ? this.camDetails.cibilSynopsysToAnyOtherRemark : null,
      })
      this.camDetailsForm.patchValue({
        trackValidationRemarks: this.camDetails.trackValidationToAnyOtherRemarks ? this.camDetails.trackValidationToAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        fleetRemarks: this.camDetails.fleetSummaryToAnyOtherRemarks ? this.camDetails.fleetSummaryToAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        keyFinancialRemarks: this.camDetails.keyFinancialObjAnyOtherRemarks ? this.camDetails.keyFinancialObjAnyOtherRemarks : null,
      })
    })
  }

  getCamUsedCarDetails() {
    const data = {
      leadId: this.leadId,
    };
    this.camService.getCamUsedCarDetails(data).subscribe((res: any) => {
      console.log("used car cam", res)
      this.camDetails = res.ProcessVariables
      this.applicantDetails = res.ProcessVariables['applicantDetails'];
      this.bankingDetails = res.ProcessVariables['bankingDetails'];
      this.businessIncomeDetails = res.ProcessVariables['businessIncomeDetails'];
      this.decisionSheet = res.ProcessVariables['decisionSheet'];
      // this.deviation = res.ProcessVariables['deviation']
      this.finalLoanDetails = res.ProcessVariables['finalLoanDetails']
      this.finalLoanEligibility = res.ProcessVariables['finalLoanEligibility']
      this.loanEligibilityBasedOnInc = res.ProcessVariables['loanEligibilityBasedOnInc']
      this.obligationDetails = res.ProcessVariables['obligationDetails']
      this.otherIncomeDetails = res.ProcessVariables['otherIncomeDetails']
      this.sourcingObj = res.ProcessVariables['sourcingObj']
      this.autoDeviation = res.ProcessVariables['autoDeviation']
      this.manualDeviation = res.ProcessVariables['manualDeviation']
      this.vehicleDetails = res.ProcessVariables['vehicleDetails']

    })
  }
  getCamNewCvDetails() {
    const data = {
      leadId: this.leadId,
    };
    this.camService.getCamNewCvDetails(data).subscribe((res: any) => {
      console.log(res);
      this.camDetails = res.ProcessVariables
      this.applicantDetails = res.ProcessVariables['applicantDetails'];
      this.bankingSummary = res.ProcessVariables['bankingSummary']
      this.bankingTxnDetails = res.ProcessVariables['bankingTxnDetails']
      this.cibilEnquiries = res.ProcessVariables['cibilEnquiries']
      this.cibilJustification = res.ProcessVariables['cibilJustification']
      this.customerSelectionCriteria = res.ProcessVariables['customerSelectionCriteria']
      this.detailsOfCibilFiPD = res.ProcessVariables['detailsOfCibilFiPD']
      this.existingExposure = res.ProcessVariables['existingExposure']
      this.autoDeviation = res.ProcessVariables['autoDeviations']
      this.fleetDetails = res.ProcessVariables['fleetDetails']
      this.otherDeviations = res.ProcessVariables['otherDeviations']
      this.proposedVehiclesDetails = res.ProcessVariables['proposedVehiclesDetails']
      this.referenceCheck = res.ProcessVariables['referenceCheck']
      this.repaymentTrackRecord = res.ProcessVariables['repaymentTrackRecord']
      this.sourcingDetails = res.ProcessVariables['sourcingDetails']
      this.acmRecommendation = res.ProcessVariables['acmRecommendation']
      this.cmRecommendation = res.ProcessVariables['cmRecommendation']
      this.coRecommendationTvrDetails = res.ProcessVariables['coRecommendationTvrDetails']
      this.customerBackgroundSalesRecommendation = res.ProcessVariables['customerBackgroundSalesRecommendation']
      this.ncmBhRecommendation = res.ProcessVariables['ncmBhRecommendation']
      this.vehicleDeploymentDetails = res.ProcessVariables['vehicleDeploymentDetails']

     
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
          keyFinancialRemarks: this.camDetailsForm.controls.keyFinancialRemarks.value
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
