import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CamService } from '@services/cam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoginStoreService } from '@services/login-store.service';
import { Location } from '@angular/common';
import html2pdf from 'html2pdf.js';
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
  productCategoryCode: string;
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
  recommendation: any;
  disableSaveBtn: boolean;
  isCamGeneratedValue;
  isCamDetails: boolean;
  generateCam: boolean = false;
  roleId: any;
  roleType: any;
  salesResponse = 'false';
  currentUrl: string;
  showSave: boolean = false;
  pdfId:string;
  constructor(private labelsData: LabelsService,
    private camService: CamService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private loginStoreService: LoginStoreService,
    private router: Router,
    private location: Location,



  ) {
    this.salesResponse = localStorage.getItem('salesResponse');
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;

      console.log('role Type', this.roleType);
     

    });

  }

  ngOnInit() {

    // console.log(this.recommend)
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
    this.productCategoryCode = leadSectionData.leadDetails['productCatCode'];
    console.log('getting productCategoryCode...>', this.productCategoryCode);
    console.log(this.isCamGeneratedValue)
    if (this.productCategoryCode == "UC") {
      const body = {
        "leadId": this.leadId,
        "generateCam": this.generateCam
      }
      this.camService.getCamUsedCarDetails(body).subscribe((res: any) => {
        console.log(res);
        this.isCamGeneratedValue = res.ProcessVariables['isCamGenerated']
        console.log(this.isCamGeneratedValue);
        if (this.isCamGeneratedValue == false) {
          console.log(this.isCamDetails);

          this.isCamDetails = true
          console.log(this.isCamDetails);

        } else if (this.isCamGeneratedValue == true) {
          this.isCamDetails = false
          this.usedCarCam = true
          this.generateCam = true
          this.getCamUsedCarDetails(this.generateCam)
        }
      })
    }
    if (this.productCategoryCode == "UCV") {
      const body = {
        "leadId": this.leadId,
        "generateCam": this.generateCam
      }
      this.camService.getCamUsedCvDetails(body).subscribe((res: any) => {
        console.log(res);
        this.isCamGeneratedValue = res.ProcessVariables['isCamGenerated']
        console.log(this.isCamGeneratedValue);
        if (this.isCamGeneratedValue == false) {
          console.log(this.isCamDetails);

          this.isCamDetails = true
          console.log(this.isCamDetails);

        } else if (this.isCamGeneratedValue == true) {
          this.isCamDetails = false
          this.usedCvCam = true
          this.generateCam = true
          this.getCamUsedCvDetails(this.generateCam)
        }
      })
    }
    if (this.productCategoryCode == "NCV") {
      const body = {
        "leadId": this.leadId,
        "generateCam": this.generateCam
      }
      this.camService.getCamNewCvDetails(body).subscribe((res: any) => {
        console.log(res);
        this.isCamGeneratedValue = res.ProcessVariables['isCamGenerated']
        console.log(this.isCamGeneratedValue);
        if (this.isCamGeneratedValue == false) {
          console.log(this.isCamDetails);

          this.isCamDetails = true
          console.log(this.isCamDetails);

        } else if (this.isCamGeneratedValue == true) {
          this.isCamDetails = false
          this.newCvCam = true
          this.generateCam = true
          this.getCamNewCvDetails(this.generateCam)
        }
      })
    }

    if (this.productCategoryCode == "UCV") {

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
        concernsAndRisks: new FormControl(null, [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(
            /^[a-zA-Z0-9 ]*$/
          ),
        ]),
        strengthAndMitigates: new FormControl(null, [
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
        commentsOnBankingIfAny: new FormControl(),
        commentsOnRtr: new FormControl(),
      })
    } else if (this.productCategoryCode == "NCV") {
      this.camDetailsForm = this.formBuilder.group({
        proposedVehicleRemarks: [],
        cibilSynopsisRemarks: [],
        trackValidationRemarks: [],
        fleetRemarks: [],
        concernsAndRisks: [],
        strengthAndMitigates: [],
        keyFinancialRemarks: [],
        commentsOnBankingIfAny: new FormControl(null, [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(
            /^[a-zA-Z0-9 ]*$/
          ),
        ]),
        commentsOnRtr: new FormControl(null, [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(
            /^[a-zA-Z0-9 ]*$/
          ),
        ]),

      })
    }

    const operationType = this.toggleDdeService.getOperationType();
    if (operationType === '1') {
      this.disableSaveBtn = true;
    }
    
    this.currentUrl = this.location.path();
    if (this.currentUrl.includes('credit-decisions')  ) {
      this.camDetailsForm.disable();
      this.showSave = false
      console.log(this.showSave);
    }else if(this.currentUrl.includes('dde')){
      this.showSave = true

    }
  }

  showCamDetails() {
    if (this.productCategoryCode == "UC") {
      this.usedCarCam = true
      this.isCamDetails = false
      this.generateCam = true
      this.getCamUsedCarDetails(this.generateCam)
      this.pdfId="UCpdfgeneration" // pdf generation 
    } else
      if (this.productCategoryCode == "UCV") {
        this.usedCvCam = true
        this.isCamDetails = false
        this.generateCam = true
        this.getCamUsedCvDetails(this.generateCam)
        this.pdfId="UCVpdfgeneration" // pdf generation
      } else
        if (this.productCategoryCode == "NCV") {
          this.newCvCam = true
          this.isCamDetails = false
          this.generateCam = true
          this.getCamNewCvDetails(this.generateCam)
         this.pdfId="NCVpdfgeneration" // pdf generation
        }
  }
  getCamUsedCvDetails(generateCam) {
    const data = {
      "leadId": this.leadId,
      "generateCam": generateCam,
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
      this.recommendation = res.ProcessVariables['recommendation']
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
        keyFinancialRemarks: this.camDetails.keyFinancialAnyOtherRemarks ? this.camDetails.keyFinancialAnyOtherRemarks : null,
      })
      this.camDetailsForm.patchValue({
        concernsAndRisks: this.camDetails.concernsAndRisks ? this.camDetails.concernsAndRisks : null,
      })
      this.camDetailsForm.patchValue({
        strengthAndMitigates: this.camDetails.strengthAndMitigates ? this.camDetails.strengthAndMitigates : null,
      })
    })
  }

  getCamUsedCarDetails(generateCam) {
    console.log(generateCam);

    const data = {
      "leadId": this.leadId,
      "generateCam": generateCam,
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
      this.recommendation = res.ProcessVariables['recommendation']

    })
    
  }
  getCamNewCvDetails(generateCam) {
    const data = {
      "leadId": this.leadId,
      "generateCam": generateCam,
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
      this.recommendation = res.ProcessVariables['recommendation']
      this.camDetailsForm.patchValue({
        commentsOnBankingIfAny: this.camDetails.commentsOnBankingIfAny ? this.camDetails.commentsOnBankingIfAny : null,
      })
      this.camDetailsForm.patchValue({
        commentsOnRtr: this.camDetails.commentsOnRtr ? this.camDetails.commentsOnRtr : null,
      })

    })
  }
  onSubmit() {
    console.log(this.camDetailsForm);
    console.log(this.camDetailsForm);

    this.submitted = true;
    // stop here if form is invalid
    if (this.camDetailsForm.invalid) {
      if (this.productCategoryCode == "UCV") {
        this.toasterService.showError(
          "Fields Missing Or Invalid Pattern Detected",
          "UCV Details"
        );
        return;
      } else
        if (this.productCategoryCode == "NCV") {
          this.toasterService.showError(
            "Fields Missing Or Invalid Pattern Detected",
            "NCV Details"
          );
          return;
        }

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
          keyFinancialRemarks: this.camDetailsForm.controls.keyFinancialRemarks.value,
          concernsAndRisks: this.camDetailsForm.controls.concernsAndRisks.value,
          strengthAndMitigates: this.camDetailsForm.controls.strengthAndMitigates.value,
          commentsOnBankingIfAny: this.camDetailsForm.controls.commentsOnBankingIfAny.value,
          commentsOnRtr: this.camDetailsForm.controls.commentsOnRtr.value
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
          if (this.productCategoryCode == "UCV") {
            this.generateCam = true
            this.getCamUsedCvDetails(this.generateCam);
          } else
            if (this.productCategoryCode == "NCV") {
              this.generateCam = true
              this.getCamNewCvDetails(this.generateCam);
            }
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
  onBack() {
    if (this.roleType == '2' && this.currentUrl.includes('dde')) {
      this.router.navigate([`pages/dde/${this.leadId}/score-card`]);
    } else if (this.roleType == '2' && this.salesResponse == 'true' ) {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '2' && this.salesResponse == 'false') {
      this.router.navigate([`pages/dashboard`]);
    }
  }
  onNext() {
    if (this.roleType == '2' && this.currentUrl.includes('dde')) {
      this.router.navigate([`pages/dde/${this.leadId}/deviations`]);
    } else if (this.roleType == '2' && this.salesResponse == 'true') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/deviations`]);
    } else if (this.roleType == '2' && this.salesResponse == 'false') {
      this.router.navigate([`pages/credit-decisions/${this.leadId}/deviations`]);
    }
  }
  downloadpdf()
  { 
    var options = {
      margin:.25,
      filename: `CamDetails_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
  }
  html2pdf().from(document.getElementById(this.pdfId)).set(options).save();

  }
}
