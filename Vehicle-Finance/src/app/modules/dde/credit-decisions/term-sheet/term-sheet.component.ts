import { Component, OnInit , Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '../../../../services/labels.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';

import {TermSheetService} from '../../services/terms-sheet.service';
import { LoginStoreService } from '@services/login-store.service';
import html2pdf from 'html2pdf.js';
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
  bankDetails:any;
  coAppDetails:any;
  commonAppDetails:any;
  creditApprovalDev: any;
  deductionDetails : any;
  ecsDetails: any;
  guarantorDetails: any;
  identityDetails:any;
  loanDetails:any;
  paymentDetails:any;
  pslDetails: any;
  date: Date = new Date();
  todayDate;
  assetLoanDetails: any;
  isTermSheet: boolean = false;
  creditApprovalHeader = ['CIBIL score','Marital (0-Single and 1 Married)'];
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
  constructor(
     public labelsService: LabelsService,
     private activatedRoute: ActivatedRoute,
     private utilityService: UtilityService,
     private router: Router,
     private toasterService: ToasterService,
     public termSheetService : TermSheetService,
     private loginStoreService: LoginStoreService,
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
        }else{
          resolve(null);

        }
      });
    });
  }

  showTermSheet(){
    this.getTermSheet(this.leadId);
  }
  getTermSheet(leadId){
   const ProcessVariables = {
      "leadId": leadId
    };
   this.termSheetService.getTermSheet(ProcessVariables).subscribe(res => {
    if(res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0" ){
      console.log(res);
      this.isTermSheet =res['ProcessVariables'].isGenerated;
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
      this.guarantorDetails = res['ProcessVariables'].guarantorDetails;
      this.identityDetails = res['ProcessVariables'].identityDetails;
      this.loanDetails = res['ProcessVariables'].loanDetails;
      this.paymentDetails = res['ProcessVariables'].paymentDetails;
      this.pslDetails = res['ProcessVariables'].pslDetails;
      this.assetLoanDetails = res['ProcessVariables'].assetLoanDetails;
      this.coAppIndentityDetails = res['ProcessVariables'].coAppIndentityDetails;
      this.guaIdentityDetails =res['ProcessVariables'].guaIdentityDetails;

    } else {
      this.isTermSheet =res['ProcessVariables'].isGenerated;
      this.toasterService.showError(res['ProcessVariables'].error['message'], '');

    }
  });
  }
  // nextRoute(url){
  //   this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/'+url);

  // }
  assignTaskToTSAndCPC(){
    const ProcessVariables = {
      "leadId": this.leadId,
      "userId":this.userId
    };
    this.termSheetService.assignTaskToTSAndCPC(ProcessVariables).subscribe((res)=>{
      if(res['ProcessVariables'].error['code'] == "0"){
        this.toasterService.showSuccess("Record Assigned Successfuly", '');
        this.router.navigateByUrl("/pages/dashboard");

      }else{
        if(this.roleType == '2' && !this.isApprove){
          this.toasterService.showSuccess(res['ProcessVariables'].error['message'], '');

        }

      }
    })
  }
  async ngOnInit() {
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
      if(this.roleType != '2' || this.isApprove){
        this.isTermSheet = true
      }
    });
    if(this.roleType != '2' && !this.isApprove){
      this.getTermSheet(this.leadId);
    }else if(this.isApprove && this.isLeadId){
      this.getTermSheet(this.leadId);
    }else{
      this.getTermSheet(this.leadId);
    }
  }
  onNext() {
    // this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
    if (  this.roleType == '2' ) { 
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/sanction-details`]);
    } else if (this.roleType == '1' ) {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/negotiation`]);
      }
  }

  onBack() {
    if( this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/credit-condition`]);
    } else if (this.roleType == '2' ) {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/disbursement`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/check-list`]);
      }
  }
  downloadpdf()
  { 
    var options = {
      margin:.25,
      filename: `TermSheeet_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
  }
  html2pdf().from(document.getElementById("ContentToConvert")).set(options).save();

  }
}
