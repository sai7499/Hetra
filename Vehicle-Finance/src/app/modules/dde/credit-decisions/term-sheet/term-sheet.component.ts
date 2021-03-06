import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '../../../../services/labels.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';

import { TermSheetService } from '../../services/terms-sheet.service';
import { LoginStoreService } from '@services/login-store.service';
import html2pdf from 'html2pdf.js';
import { UploadService } from '@services/upload.service';
import { DocumentDetails } from '@model/upload-model';
import { map } from 'rxjs/operators';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
declare var $;
@Component({
  selector: 'app-term-sheet',
  templateUrl: './term-sheet.component.html',
  styleUrls: ['./term-sheet.component.css']
})
export class TermSheetComponent implements OnInit {
  labels: any = {};
  manufacturer: any = '';
  agentDetails: any;
  applicantDetails: any;
  applicationDetails: any;
  approvalDetails: any;
  assValuationDetails: any;
  assetDetails: any;
  bankDetails: any;
  coAppDetails: any;
  commonAppDetails: any;
  creditApprovalDev: any;
  deductionDetails: any;
  ecsDetails: any;
  guarantorDetails: any;
  identityDetails: any;
  loanDetails: any;
  paymentDetails: any;
  pslDetails: any;
  date: Date = new Date();
  todayDate;
  errorGenerated: boolean = false;
  errorMessage : any = [];
  assetLoanDetails: any;
  fleetDetails: any;
  isTermSheet: boolean = false;
  creditApprovalHeader = ['CIBIL score', 'Marital (0-Single and 1 Married)'];
  leadId;
  coAppIndentityDetails: Array<any>;
  guaIdentityDetails: Array<any>;
  roleType: any;
  roleId: any;
  userId;
  userType;
  roleAndUserDetails: any;
  @Input() isApprove: boolean;
  @Input() isLeadId: number;

  docsDetails: any = {};
  vehicleDetailsArray: any = [];
  isDocumentId: boolean;
  isLoan360: boolean;
  taskId: any;
  fastagAmt: any;
  miPremiumAmt: any;
  pacPremiumAmt: any;
  vasPremiumAmt: any;
  csPremiumAmt: any;
  deductionCharges = [];

  constructor(
    public labelsService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService,
    private router: Router, private uploadService: UploadService,
    private toasterService: ToasterService,
    public termSheetService: TermSheetService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private loanViewService: LoanViewService,
    private sharedService: SharedService
  ) {

  }
  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
      console.log(this.labels);
    });
  }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        } else {
          resolve(null);

        }
      });
    });
  }

  showTermSheet() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.vehicleDetailsArray = [];
    this.vehicleDetailsArray = leadData['vehicleCollateral'];
    // this.isTermSheet= true;
    this.getTermSheet(this.leadId,"isUpload");
    
  }
  getTermSheet(leadId,isUpload?) {
    const ProcessVariables = {
      "leadId": leadId
    };
    this.termSheetService.getTermSheet(ProcessVariables).subscribe(res => {
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
        console.log(res);
        this.isTermSheet = res['ProcessVariables'].isGenerated;
        // this.isTermSheet= true;
        this.agentDetails = res['ProcessVariables'].agentDetails;
        this.applicantDetails = res['ProcessVariables'].applicantDetails;
        this.applicationDetails = res['ProcessVariables'].applicationDetails;
        this.approvalDetails = res['ProcessVariables'].approvalDetails;
        this.assValuationDetails = res['ProcessVariables'].assValuationDetails;
        this.assetDetails = res['ProcessVariables'].assetDetails;
        this.bankDetails = res['ProcessVariables'].bankDetails;
        this.coAppDetails = res['ProcessVariables'].coAppDetails;
        this.commonAppDetails = res['ProcessVariables'].commonAppDetails;
        this.creditApprovalDev = res['ProcessVariables'].creditApprovalDev;
        this.deductionDetails = res['ProcessVariables'].deductionDetails;
        this.ecsDetails = res['ProcessVariables'].ecsDetails;
        this.fleetDetails = res['ProcessVariables'].fleetDetails;
        this.guarantorDetails = res['ProcessVariables'].guarantorDetails;
        this.identityDetails = res['ProcessVariables'].identityDetails;
        this.loanDetails = res['ProcessVariables'].loanDetails;
        this.paymentDetails = res['ProcessVariables'].paymentDetails;
        this.pslDetails = res['ProcessVariables'].pslDetails;
        this.assetLoanDetails = res['ProcessVariables'].assetLoanDetails;
        this.coAppIndentityDetails = res['ProcessVariables'].coAppIndentityDetails;
        this.guaIdentityDetails = res['ProcessVariables'].guaIdentityDetails;
        this.fastagAmt = res['ProcessVariables'].fastagAmt;
        this.miPremiumAmt = res['ProcessVariables'].miPremiumAmt;
        this.pacPremiumAmt = res['ProcessVariables'].pacPremiumAmt;
        this.vasPremiumAmt = res['ProcessVariables'].vasPremiumAmt;
        this.csPremiumAmt = res['ProcessVariables'].csPremiumAmt;
        this.deductionCharges = res['ProcessVariables'].deductionCharges;
        setTimeout(() => {
        if (isUpload == 'isUpload'){
         // this.uploadDoc();
        }
      });
      } else if(res['ProcessVariables'].error['code'] == "1") {
        this.isTermSheet = res['ProcessVariables'].isGenerated;
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
       
      }else if(res['Error'] == "1"){
        this.isTermSheet = res['ProcessVariables'].isGenerated;
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    });
  }
  // nextRoute(url){
  //   this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/'+url);

  // }
  assignTaskToTSAndCPC() {
    const ProcessVariables = {
      "leadId": this.leadId,
      "userId": this.userId,
      "taskId": this.taskId,
    };
    this.termSheetService.assignTaskToTSAndCPC(ProcessVariables).subscribe((res) => {
      if (res['ProcessVariables'].error['code'] == "0") {
       console.log("get response ", res);
       if(res['ProcessVariables'].rctaAlert ==  true){
        this.errorGenerated = true;
        // const message = res['ProcessVariables'].rctaMessage;
        this.errorMessage = res['ProcessVariables'].rctaMessage;
      }else{
        this.toasterService.showSuccess("Record Assigned Successfuly", '');
        this.router.navigateByUrl("/pages/dashboard");
      }      

      } else if (this.roleType == '2' && !this.isApprove) {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
      } else if(res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
       
      }else if(res['Error'] == "1"){
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    })
  }
  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.getLabelData();
    console.log(this.isApprove);
    this.leadId = (await this.getLeadId()) as number;
    console.log(this.leadId);
    this.todayDate = this.utilityService.convertDateTimeTOUTC(this.date, 'DD/MM/YYYY');
    this.roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    console.log(this.roleAndUserDetails)
    if (this.roleAndUserDetails) {
      this.userId = this.roleAndUserDetails['userDetails'].userId;
      this.userType = this.roleAndUserDetails['roles'][0].roleType;
    }
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
      if (this.roleType != '2' || this.isApprove) {
        this.isTermSheet = true
      }
    });
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    if (this.roleType != '2' && !this.isApprove) {
      this.getTermSheet(this.leadId);
    } else if (this.isApprove && this.isLeadId) {
      this.getTermSheet(this.leadId);
    } else {
      this.getTermSheet(this.leadId);
    }
  }
  onNext() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/welcome-letter`);
    }
    // this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
    console.log('this.roleType', this.roleType)
    if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/sanction-details`]);
    } else if (this.roleType == '1' && localStorage.getItem('isPreDisbursement') == "true") {
      this.router.navigate([`pages/pre-disbursement/${this.leadId}/sanction-details`]);
    }
    else if (this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/sanction-details`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/sanction-details`]);
    }
    else if (this.roleType == '7') {
      this.router.navigate([`/pages/cpc-maker/${this.leadId}/sanction-details`]);
    }
  }

  onBack() {

    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/sanction-letter`);
    }

    if (this.roleType == '1' && localStorage.getItem('is_pred_done') == "true" ) {
      this.router.navigate([`pages/pre-disbursement/${this.leadId}/credit-condition`]);
    } else if (this.roleType == '1' && localStorage.getItem('is_pred_done') == "false" ) {
      this.router.navigate([`pages/pre-disbursement/${this.leadId}/credit-condition`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/credit-condition`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/dashboard`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/dashboard`]);
    } else if (this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/credit-condition`]);
    }
    else if (this.roleType == '7') {
      this.router.navigate([`/pages/dashboard`]);
    }
  }
  downloadpdf() {
    var options = {
      margin:[0.60,0.75,0.80,0.75],
      filename: `TermSheeet_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas:{scale:3, logging: true},   
      pagebreak: { before:["#tearms_sheet_header2","#terms_sheet_headline12"] },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
    }
    html2pdf().from(document.getElementById("ContentToConvert")).set(options).save();

    // }
    

  }
// uploadDoc(){
//   var options = {
//     margin:[0.60,0.75,0.80,0.75],
//     filename: `TermSheeet_${this.leadId}.pdf`,
//     image: { type: 'jpeg', quality: 0.99 },
//     html2canvas:{scale:3, logging: true},   
//     pagebreak: { before:["#tearms_sheet_header2","#terms_sheet_headline12"] },
//     jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
//   }
//   html2pdf().from(document.getElementById("ContentToConvert"))
//       .set(options).toPdf().output('datauristring').then(res => {
//         console.log("file res:", res);
//         this.docsDetails = {
//           associatedId: this.vehicleDetailsArray[0].collateralId.toString(),//" 1513",
//           associatedWith: '1',
//           bsPyld: "JVBERi0xLjMKJbrfrOAKMyAwIG9iago8PC9UeXBlIC9QYWdlCi",
//           deferredDate: "",
//           docCatg: "VF LOAN DOCS",
//           docCmnts: "Addition of document for Applicant Creation",
//           docCtgryCd: 102,
//           docNm: `TERM_SHEET`,
//           docRefId: [
//             {
//               idTp: 'LEDID',
//               id: this.leadId,
//             },
//             {
//               idTp: 'BRNCH',
//               id: Number(localStorage.getItem('branchId')),
//             },
//           ],
//           docSbCtgry: "VF GENERATED DOCS",
//           docSbCtgryCd: 42,
//           docSize: 1097152,
//           docTp: "Lead",
//           docTypCd: 150,
//           docsType: "png/jpg/jpeg/pdf/tiff/xlsx/xls/docx/doc/zip",
//           docsTypeForString: "",
//           documentId: this.isDocumentId ? this.docsDetails.documentId : 0,
//           documentNumber: `TERM_SHEET${this.leadId}`,
//           expiryDate: "",
//           formArrayIndex: 0,
//           isDeferred: "0",
//           issueDate: ""
//         }
//         let base64File: string = res.toString()
//           .replace(/^data:application\/[a-z]+;filename=generated.pdf;base64,/, '');
//         this.docsDetails.bsPyld = base64File;
//         let fileName = this.docsDetails.docSbCtgry.replace(' ', '_');
//         fileName =
//           this.docsDetails.docNm +
//           new Date().getFullYear() +
//           +new Date() +
//           '.pdf';
//         this.docsDetails.docNm = fileName;
//         const addDocReq = [
//           {
//             ...this.docsDetails,
//           },
//         ];
//         this.uploadService
//           .constructUploadModel(addDocReq)
//           .pipe(
//             map((value: any) => {
//               if (value.addDocumentRep.msgHdr.rslt === 'OK') {
//                 const body = value.addDocumentRep.msgBdy;
//                 const docsRes = body.addDocResp[0];
//                 const docsDetails = {
//                   ...docsRes,
//                 };
//                 return docsDetails;
//               }
//               throw new Error('error');
//             })
//           )
//           .subscribe(
//             (value: any) => {
//               console.log("Response upload", value)              
//               let documentDetails: DocumentDetails = {
//                 documentId: this.docsDetails.documentId,
//                 documentType: String(this.docsDetails.docTypCd),
//                 documentName: String(this.docsDetails.docTypCd),
//                 documentNumber: this.docsDetails.documentNumber,
//                 dmsDocumentId: value.docIndx,
//                 categoryCode: String(this.docsDetails.docCtgryCd),
//                 issuedAt: 'check',
//                 subCategoryCode: String(this.docsDetails.docSbCtgryCd),
//                 issueDate:
//                   this.utilityService.getDateFormat(this.docsDetails.issueDate) ||
//                   '',
//                 expiryDate:
//                   this.utilityService.getDateFormat(this.docsDetails.expiryDate) ||
//                   '',
//                 associatedId: this.docsDetails.associatedId,
//                 associatedWith: this.docsDetails.associatedWith,
//                 formArrayIndex: this.docsDetails.formArrayIndex,
//                 deferredDate:
//                   this.utilityService.getDateFormat(
//                     this.docsDetails.deferredDate
//                   ) || '',
//                 isDeferred: this.docsDetails.isDeferred,
//               };

//               console.log(this.isDocumentId, 'document Details', this.docsDetails.documentId)

//               this.uploadService.saveOrUpdateDocument([documentDetails]).subscribe((file: any) => {
//                 console.log('file', file)

//                 if (file.Error === '0' && file.ProcessVariables.error.code === '0') {

//                   if (file.ProcessVariables.documentIds && file.ProcessVariables.documentIds.length > 0) {
//                     this.docsDetails.documentId = file.ProcessVariables.documentIds[0];
//                     this.isDocumentId = true;
//                   } else {
//                     this.isDocumentId = false;
//                   }
//                 }
//               })

//             })

//       });
//     }
}
