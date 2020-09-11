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
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';
import { map } from 'rxjs/operators';
import { DocumentDetails } from '@model/upload-model';
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
  isCamGeneratedValue:boolean;
  isCamDetails: boolean;
  generateCam: boolean = false;
  roleId: any;
  roleType: any;
  salesResponse = 'false';
  currentUrl: string;
  showSave: boolean = false;
  pdfId: string;
  newCamHtml: boolean;
  showCamHtml: boolean;
  errorGenerated: boolean = false;
  errorMessage: string;

  docsDetails: any = {};
  vehicleDetailsArray: any = [];
  isDocumentId: boolean;

  constructor(private labelsData: LabelsService,
    private camService: CamService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private loginStoreService: LoginStoreService,
    private router: Router, private uploadService: UploadService,
    private location: Location, private utilityService: UtilityService,
  ) {
    this.salesResponse = localStorage.getItem('salesResponse');
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
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
    this.vehicleDetailsArray = leadData['vehicleCollateral'];
    this.productCategoryCode = leadSectionData.leadDetails['productCatCode'];
    if (this.productCategoryCode == "UC") {
      const body = {
        "leadId": this.leadId,
        "generateCam": this.generateCam
      }
      this.camService.getCamUsedCarDetails(body).subscribe((res: any) => {
        this.isCamGeneratedValue = res.ProcessVariables['isCamGenerated']
        if (this.isCamGeneratedValue == false) {

          this.isCamDetails = true
          this.showSave = false

        } else if (this.isCamGeneratedValue == true) {
          this.isCamDetails = false
          this.usedCarCam = true
          this.generateCam = true
          this.getCamUsedCarDetails(this.generateCam)
          this.showCamHtml = true
          this.showSave = true

        }
      })
    }
    if (this.productCategoryCode == "UCV") {
      const body = {
        "leadId": this.leadId,
        "generateCam": this.generateCam
      }
      this.camService.getCamUsedCvDetails(body).subscribe((res: any) => {
        this.isCamGeneratedValue = res.ProcessVariables['isCamGenerated']
        if (this.isCamGeneratedValue == false) {
          this.isCamDetails = true
          this.showSave = false


        } else if (this.isCamGeneratedValue == true) {
          this.isCamDetails = false
          this.usedCvCam = true
          this.generateCam = true
          this.getCamUsedCvDetails(this.generateCam)
          this.showCamHtml = true
          this.showSave = true


        }
      })
    }
    if (this.productCategoryCode == "NCV") {
      const body = {
        "leadId": this.leadId,
        "generateCam": this.generateCam
      }
      this.camService.getCamNewCvDetails(body).subscribe((res: any) => {

        this.isCamGeneratedValue = res.ProcessVariables['isCamGenerated']
        if (this.isCamGeneratedValue == false) {

          this.isCamDetails = true
          this.showSave = false


        } else if (this.isCamGeneratedValue == true) {
          this.isCamDetails = false
          this.newCvCam = true
          this.generateCam = true
          this.getCamNewCvDetails(this.generateCam)
          this.showCamHtml = true
          this.showSave = true


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
    if (this.currentUrl.includes('credit-decisions') && this.productCategoryCode != "UC") {
      console.log(this.camDetailsForm.status, '');
      
      this.camDetailsForm.disable();
      this.showSave = false
    } else if (this.currentUrl.includes('dde') ) {
      this.showSave = true

    }
  }

  showCamDetails() {
    if (this.productCategoryCode == "UC") {
      this.usedCarCam = true
      this.isCamDetails = false
      this.generateCam = true
      this.getCamUsedCarDetails(this.generateCam, 'isUpload')
      this.showCamHtml = true

      this.pdfId = "UCpdfgeneration" // pdf generation 
    } else
      if (this.productCategoryCode == "UCV") {
        this.usedCvCam = true
        this.isCamDetails = false
        this.generateCam = true
        this.getCamUsedCvDetails(this.generateCam, 'isUpload')
        this.showCamHtml = true

        this.pdfId = "UCVpdfgeneration" // pdf generation
      } else
        if (this.productCategoryCode == "NCV") {
          this.newCvCam = true
          this.isCamDetails = false
          this.generateCam = true
          this.getCamNewCvDetails(this.generateCam, 'isUpload')
          this.showCamHtml = true

          this.pdfId = "NCVpdfgeneration" // pdf generation
        }
  }
  getCamUsedCvDetails(generateCam, isUpload?: string) {
    const data = {
      "leadId": this.leadId,
      "generateCam": generateCam,
    };
    this.camService.getCamUsedCvDetails(data).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        this.showCamHtml == true
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
        
        if (isUpload === 'isUpload') {
          this.uploadPdf()
        }

      } else if (res && res.ProcessVariables.error.code == '1') {
        this.showCamHtml == false
        this.errorGenerated = true;
        const message = res.ProcessVariables.mandatoryFields;
        this.errorMessage = message;
        this.isCamDetails = true
        this.showSave = false

      }
    })

  }

  getCamUsedCarDetails(generateCam, isUpload?: string) {

    const data = {
      "leadId": this.leadId,
      "generateCam": generateCam,
    };
    this.camService.getCamUsedCarDetails(data).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        this.showCamHtml == true
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
        this.autoDeviation = res.ProcessVariables['autoDeviations']
        this.manualDeviation = res.ProcessVariables['manualDeviation']
        this.vehicleDetails = res.ProcessVariables['vehicleDetails']
        this.recommendation = res.ProcessVariables['recommendation']

        if (isUpload === 'isUpload') {
          this.uploadPdf()
        }

      } else if (res && res.ProcessVariables.error.code == '1') {
        this.showCamHtml == false
        this.errorGenerated = true;
        const message = res.ProcessVariables.mandatoryFields;
        this.errorMessage = message;
        this.isCamDetails = true
        this.showSave = false


      }
    })

  }
  getCamNewCvDetails(generateCam, isUpload?: string) {
    const data = {
      "leadId": this.leadId,
      "generateCam": generateCam,
    };
    this.camService.getCamNewCvDetails(data).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        this.showCamHtml == true
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
        if (isUpload === 'isUpload') {
          this.uploadPdf()
        }
      } else if (res && res.ProcessVariables.error.code == '1') {
        this.showCamHtml == false
        this.errorGenerated = true;
        const message = res.ProcessVariables.mandatoryFields;
        this.errorMessage = message;
        this.isCamDetails = true
        this.showSave = false

      }
    })
  }
  onSubmit() {


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
    } else if (this.roleType == '2' && this.salesResponse == 'true') {
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
  downloadpdf() {
    var options = {
      margin: .25,
      filename: `CamDetails_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
    }
    html2pdf().from(document.getElementById(this.pdfId)).set(options).save();

  }

  uploadPdf() {

    var options = {
      margin: .25,
      filename: `CamDetails_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
    }

    html2pdf().from(document.getElementById(this.pdfId))
      .set(options).toPdf().output('datauristring').then(res => {
        console.log("file res:", res);
        this.docsDetails = {
          associatedId: this.vehicleDetailsArray[0].collateralId.toString(),//"1496",
          associatedWith: '1',
          bsPyld: "/9j/4QCORXhpZgAATU0AKgAAAAgABQEaAAUAAAABAAAASgEbAA",
          deferredDate: "",
          docCatg: "VF LOAN DOCS",
          docCmnts: "Addition of document for Applicant Creation",
          docCtgryCd: 102,
          docNm: `CAM`,
          docRefId: [
            {
              idTp: 'LEDID',
              id: this.leadId,
            },
            {
              idTp: 'BRNCH',
              id: Number(localStorage.getItem('branchId')),
            },
          ],
          docSbCtgry: "VF GENERATED DOCS",
          docSbCtgryCd: 42,
          docSize: 2097152,
          docTp: "Lead",
          docTypCd: 148,
          docsType: "png/jpg/jpeg/pdf/tiff/xlsx/xls/docx/doc/zip",
          docsTypeForString: "",
          documentId: this.isDocumentId ? this.docsDetails.documentId : 0,
          documentNumber: `SD${this.leadId}`,
          expiryDate: "",
          formArrayIndex: 0,
          isDeferred: "0",
          issueDate: ""
        }
        let base64File: string = res.toString()
          .replace(/^data:application\/[a-z]+;filename=generated.pdf;base64,/, '');
        this.docsDetails.bsPyld = base64File;
        let fileName = this.docsDetails.docSbCtgry.replace(' ', '_');
        fileName =
          this.docsDetails.docNm +
          new Date().getFullYear() +
          +new Date() +
          '.pdf';
        this.docsDetails.docNm = fileName;
        const addDocReq = [
          {
            ...this.docsDetails,
          },
        ];
        this.uploadService
          .constructUploadModel(addDocReq)
          .pipe(
            map((value: any) => {
              if (value.addDocumentRep.msgHdr.rslt === 'OK') {
                const body = value.addDocumentRep.msgBdy;
                const docsRes = body.addDocResp[0];
                const docsDetails = {
                  ...docsRes,
                };
                return docsDetails;
              }
              throw new Error('error');
            })
          )
          .subscribe(
            (value) => {
              console.log("Response upload", value)
              // html2pdf().from(document.getElementById("vf_sheet_print_starts")).set(options).save();
              let documentDetails: DocumentDetails = {
                documentId: this.docsDetails.documentId,
                documentType: String(this.docsDetails.docTypCd),
                documentName: String(this.docsDetails.docTypCd),
                documentNumber: this.docsDetails.documentNumber,
                dmsDocumentId: value.docIndx,
                categoryCode: String(this.docsDetails.docCtgryCd),
                issuedAt: 'check',
                subCategoryCode: String(this.docsDetails.docSbCtgryCd),
                issueDate:
                  this.utilityService.getDateFormat(this.docsDetails.issueDate) ||
                  '',
                expiryDate:
                  this.utilityService.getDateFormat(this.docsDetails.expiryDate) ||
                  '',
                associatedId: this.docsDetails.associatedId,
                associatedWith: this.docsDetails.associatedWith,
                formArrayIndex: this.docsDetails.formArrayIndex,
                deferredDate:
                  this.utilityService.getDateFormat(
                    this.docsDetails.deferredDate
                  ) || '',
                isDeferred: this.docsDetails.isDeferred,
              };

              console.log(this.isDocumentId, 'document Details', this.docsDetails.documentId)

              this.uploadService.saveOrUpdateDocument([documentDetails]).subscribe((file: any) => {
                console.log('file', file)

                if (file.Error === '0' && file.ProcessVariables.error.code === '0') {

                  if (file.ProcessVariables.documentIds && file.ProcessVariables.documentIds.length > 0) {
                    this.docsDetails.documentId = file.ProcessVariables.documentIds[0];
                    this.isDocumentId = true;
                  } else {
                    this.isDocumentId = false;
                  }
                }
              })

            })

      });
  }

}
