import { Component, OnInit } from '@angular/core';
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

  constructor(
        private labelsData: LabelsService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private sanctionDetailsService: SanctionDetailsService,
        private utilityService: UtilityService,
        private loginStoreService: LoginStoreService,
        private toasterService: ToasterService,
       ) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    // this.getSanctionDetails();
    this.salesResponse = localStorage.getItem('salesResponse');
    this.todayDate = this.utilityService.convertDateTimeTOUTC(this.date, 'DD/MM/YYYY');
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    if (this.roleType == 1){
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
  getSanctionDetails() {
    const data = this.leadId;
    this.sanctionDetailsService.getSanctionDetails(data).subscribe((res: any) => {
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
        this.isSanctionDetails = res['ProcessVariables'].isGenerated;
        const response = res;
        this.sanctionDetailsObject = response.ProcessVariables;
        // Filter Out Applicant, Co-Applicant And Guarantor List If ApplicantList_Object Exist
        if (this.sanctionDetailsObject.applicantList) {
          const getApplicantList: Array<any> = this.sanctionDetailsObject.applicantList;
          this.applicantList = [];
          this.coApplicantList = [];
          this.guarantorList = [];
          // this.sanctionDetailsObject.applicantList.filter((element) => {
            getApplicantList.forEach((element) => {
            if (element.applicantType === 'Applicant') {
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
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  //TO SHOW CONTENT OF SANCTION-DETAILS
  generateSanctionLetter() {
    this.getSanctionDetails();
  }

  //TO SEND BACK SANCTION_DETAILS TO SALES
  onSubmitToSales() {
    const data = { 
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      onSubmit: true,
    };
    this.sanctionDetailsService.submitToSanctionLeads(data).subscribe((res: any) => {
      const response = res;
      // console.log("RESPONSE_SUBMIT_TO_SALES::", response);
      if (response["Error"] == 0) {
        this.toasterService.showSuccess("Sanctioned Leads Submitted Successfully", "Sanction Details");
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  onNext() {
    
    if ( this.roleType == '1' ) { 
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/customer-feedback`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/pdc-details`]);
      }
  }

  onBack() {
    if(this.roleType == '1' && localStorage.getItem('isPreDisbursement') == "true"){
      this.router.navigate([`pages/pre-disbursement/${this.leadId}/term-sheet`]);
    } else if(this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '2' ) {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/term-sheet`]);
      }
  }
downloadpdf()
        { 
          var options = {
            margin:.25,
            filename: `SanctionDetail${this.leadId}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
        }
        html2pdf().from(document.getElementById("vf_sheet_print_starts")).set(options).save();
    
                 }

}
