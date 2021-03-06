import { Component, OnChanges, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SanctionDetailsService } from '@services/sanction-details.service';
import { UtilityService } from '@services/utility.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { UploadService } from '@services/upload.service';
import { map } from 'rxjs/operators';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
declare var $;

@Component({
  selector: 'app-sanction-details',
  templateUrl: './sanction-details.component.html',
  styleUrls: ['./sanction-details.component.css']
})
export class SanctionDetailsComponent implements OnInit {

  leadId;
  labels: any = {};
  sanctionDetailsObject: any = {};
  applicantType: string;
  applicantList: any = [];
  coApplicantList: any = [];
  guarantorList: any = [];
  vehicleDetailsArray: any = [];
  loanApprovedDetails: any = {};
  generalTermsAndConditions: string;
  date: Date = new Date();
  todayDate;
  roleId: any;
  roleType: any;
  isSanctionDetails: boolean;
  salesResponse: any;
  docsDetails: DocRequest
  isPreDisbursement: any;
  isPreDone: any;
  isApplicant: boolean = false;
  isCoApplicant: boolean = false;
  isDocumentId: boolean;
  isLoan360: boolean;
  taskId: any;
  pdfType: String;
  isDownload = true;
  disbursementDetails: any = [];

  constructor(
    private labelsData: LabelsService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private sanctionDetailsService: SanctionDetailsService,
    private utilityService: UtilityService,
    private loginStoreService: LoginStoreService,
    private toasterService: ToasterService,
    private uploadService: UploadService,
    private loanViewService: LoanViewService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.getLabels();
    this.getLeadId();
    // this.getSanctionDetails();
    this.salesResponse = localStorage.getItem('salesResponse');
    console.log("SALESRESPONSE::", this.salesResponse);
    this.isPreDisbursement = localStorage.getItem('isPreDisbursement');
    console.log("ISPREDISBURSEMENT::", this.isPreDisbursement);
    this.isPreDone = localStorage.getItem('is_pred_done');
    console.log("IS_PRE_DONE::", this.isPreDone);
    this.todayDate = this.utilityService.convertDateTimeTOUTC(this.date, 'DD/MM/YYYY');
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    if (this.roleType == 1) {
      this.getSanctionDetails();
    }
    this.getSanctionDetails();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      // (error) => console.log("Sanction-Details Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log('LEADID::', this.leadId);
  }

  // FUNCTION FOR GET API of SANCTION-DETAILS
  getSanctionDetails(isUpload?: string) {
    const data = this.leadId;
    this.sanctionDetailsService.getSanctionDetails(data).subscribe((res: any) => {
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
        this.isSanctionDetails = res['ProcessVariables'].isGenerated;
        const response = res;
        this.sanctionDetailsObject = response.ProcessVariables;
        this.disbursementDetails = this.sanctionDetailsObject.disbursementDetails;
        // Filter Out Applicant, Co-Applicant And Guarantor List If ApplicantList_Object Exist
        if (this.sanctionDetailsObject.applicantList) {
          const getApplicantList: Array<any> = this.sanctionDetailsObject.applicantList;
          this.applicantList = [];
          this.coApplicantList = [];
          this.guarantorList = [];
          // this.sanctionDetailsObject.applicantList.filter((element) => {
          getApplicantList.forEach((element) => {
            console.log("APPLICANT_TYPE::", element.applicantType);
            if (element.applicantType === 'Applicant') {
              this.isApplicant = true;
              console.log("IsApplicant:", this.isApplicant);
              const data = {
                applicantType: element.applicantType,
                name: element.name,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                addressLine3: element.addressLine3,
                district: element.district,
                country: element.country,
                pincode: element.pincode,
                mobileNo: element.mobileNo,
              };
              this.applicantList.push(data);
            } else if (element.applicantType === 'Co-Applicant') {
              this.isCoApplicant = true;
              console.log("IsCoApplicant::", this.isCoApplicant);
              const data = {
                applicantType: element.applicantType,
                name: element.name,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                addressLine3: element.addressLine3,
                district: element.district,
                country: element.country,
                pincode: element.pincode,
                mobileNo: element.mobileNo,
              };
              this.coApplicantList.push(data);
            } else if (element.applicantType === 'Guarantor') {
              const data = {
                applicantType: element.applicantType,
                name: element.name,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                addressLine3: element.addressLine3,
                district: element.district,
                country: element.country,
                pincode: element.pincode,
                mobileNo: element.mobileNo,
              };
              this.guarantorList.push(data);
            }
          });
        }
        this.vehicleDetailsArray = this.sanctionDetailsObject.vehicleDetails;
        this.loanApprovedDetails = this.sanctionDetailsObject.loanApprovedDetails;
        this.generalTermsAndConditions = this.sanctionDetailsObject.generalTermsAndConditions;
        setTimeout(() => {
          if (isUpload === 'isUpload') {
            // this.uploadPdf()
          }
        });
        
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  //TO SHOW CONTENT OF SANCTION-DETAILS
  generateSanctionLetter(isUpload?: string) {
    this.getSanctionDetails('isUpload');
  }

  //TO SEND BACK SANCTION_DETAILS TO SALES
  onSubmitToSales() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      onSubmit: true,
      taskId: this.taskId,
    };
    this.sanctionDetailsService.submitToSanctionLeads(data).subscribe((res: any) => {
      const response = res;
      // console.log("RESPONSE_SUBMIT_TO_SALES::", response);
      if (response["Error"] == 0 && response["ProcessVariables"].error.code == 0) {
        this.toasterService.showSuccess("Sanctioned Leads Submitted Successfully", "Sanction Details");
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  //SUBMIT FOR APPROVAL
  submitForApproval() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: true,
      isCPCChecker: false,
      sendBackToCredit: false,
      taskId: this.taskId
    };
    this.sanctionDetailsService.assignTaskToTSAndCPC(data).subscribe((res: any) => {
      const response = res;
      // console.log("RESPONSE_SUBMIT_FOR_APPROVAL::", response);
      if (response["Error"] == 0  && response["ProcessVariables"].error.code == 0) {
        this.toasterService.showSuccess("Sanctioned Leads Submitted Successfully", "Sanction Details");
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  //SUNMIT_TO_CREDIT_DECISIONS
  submitToCD() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      taskId: this.taskId
    };
    this.sanctionDetailsService.submitToCC(data).subscribe((res: any) => {
      const response = res;
      console.log("RESPONSE_SUMIT_TO_CREDIT_DECISION::", response);
      if (response["Error"] == 0 && response["ProcessVariables"].error["code"]== 0) {
        this.toasterService.showSuccess("Sanctioned Leads Submitted Successfully", "Sanction Details");
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  onNext() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/term-sheet`);
    }
    if (this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/customer-feedback`]);
    } else if (this.roleType == '2' && this.isPreDone == "true" && this.salesResponse == "true") {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/pdc-details`]);
    }
    else if (this.roleType == '7') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/negotiation`]);
    }
  }

  onBack() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/credit-conditions`);
    }
    if (this.roleType == '1' && this.isPreDisbursement == "true") {
      this.router.navigate([`pages/pre-disbursement/${this.leadId}/term-sheet`]);
    } else if (this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/term-sheet`]);
    }else if (this.roleType == '7') {
      this.router.navigate([`/pages/cpc-maker/${this.leadId}/term-sheet`]);
    }
  }

  downloadpdf(type) {

    document.getElementById('typeId').innerHTML = `${type} COPY`;
    document.getElementById('typeId').style.display = 'unset';
    if(this.generalTermsAndConditions) {
      document.getElementById('typeId1').innerHTML = `${type} COPY`;
    document.getElementById('typeId1').style.display = 'unset';
    }
    document.getElementById('typeId2').innerHTML = `${type} COPY`;
    document.getElementById('typeId2').style.display = 'unset';
    var options = {
      margin: .5,
      filename: `SanctionDetail${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 0.30 },
      html2canvas:{scale:4, logging: true},
      pagebreak: { before:["#vf_sheet_text_tag","#page_break"] },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
    }
    html2pdf().from(document.getElementById("vf_sheet_print_starts")).set(options).save();
    setTimeout(() => {
      document.getElementById('typeId2').style.display = 'none';
      if (this.generalTermsAndConditions) {
        document.getElementById('typeId1').style.display = 'none';
      }
      document.getElementById('typeId').style.display = 'none';
    }, 0);
  }


//   downloadpdf() {
//     let page = document.getElementById('vf_sheet_print_starts');
// const pdf = html2PDF(page, {
//     jsPDF: {
//        format: 'a4'
//     },
//     // watermark({ pdf }) {
//     //   // pdf: jsPDF instance
//     //   pdf.setTextColor('#ddd');
//     //   pdf.text(200, pdf.internal.pageSize.height - 100, `Watermark`);
//     // },
//     watermark: {
//       src: './assets/images/search.png',
//       handler({ pdf, imgNode }) {
//         const props = pdf.getImageProperties(imgNode);
//         // do something...
//         pdf.addImage(imgNode, 'PNG', 60, 60);
//       },
//     },
//     imageType: 'image/jpeg',
//     output: `SanctionDetail${this.leadId}.pdf`,
//     init: function() {},
//   success: function(pdf) {
//     pdf.save(this.output);
//   }
//   });
//   }


  uploadPdf() {

    var options = {
      margin: .5,
      filename: `SanctionDetail${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas:{scale:3, logging: true},   
      pagebreak: { before:["#vf_sheet_text_tag","#page_break"] },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
    }

    html2pdf().from(document.getElementById("vf_sheet_print_starts"))
      .set(options).toPdf().output('datauristring').then(res => {
        console.log("file res:", res);
        this.docsDetails = {
          associatedId: this.vehicleDetailsArray[0].collateralId.toString(),//"1496",
          associatedWith: '1',
          bsPyld: "JVBERi0xLjMKJbrfrOAKMyAwIG9iago8PC9UeXBlIC9QYWdlCi",
          deferredDate: "",
          docCatg: "VF LOAN DOCS",
          docCmnts: "Addition of document for Applicant Creation",
          docCtgryCd: 102,
          docNm: `SANCTION_LETTER`,
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
          docSize: 1097152,
          docTp: "Lead",
          docTypCd: 68,
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
