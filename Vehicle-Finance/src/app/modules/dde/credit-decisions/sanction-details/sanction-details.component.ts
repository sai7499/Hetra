import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SanctionDetailsService } from '@services/sanction-details.service';
import { UtilityService } from '@services/utility.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';

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
        this.isSanctionDetails = true;
        const response = res;
        this.sanctionDetailsObject = response.ProcessVariables;
        // Filter Out Applicant, Co-Applicant And Guarantor List If ApplicantList_Object Exist
        if (this.sanctionDetailsObject.applicantList) {
          this.sanctionDetailsObject.applicantList.filter((element) => {
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
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  onNext() {
    // this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
    // if ( this.roleType == ) { }
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/pdc-details`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/pdc-details`]);
      }
  }

  onBack() {
    if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/term-sheet`]);
      }
  }

}
