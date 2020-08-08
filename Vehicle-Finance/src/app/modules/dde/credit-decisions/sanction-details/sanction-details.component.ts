import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SanctionDetailsService } from '@services/sanction-details.service';
import { UtilityService } from '@services/utility.service';
import { LoginStoreService } from '@services/login-store.service';

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

  constructor(
        private labelsData: LabelsService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private sanctionDetailsService: SanctionDetailsService,
        private utilityService: UtilityService,
        private loginStoreService: LoginStoreService,
  ) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getSanctionDetails();
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
      const response = res;
      this.sanctionDetailsObject = response.ProcessVariables;
      // Filter Out Applicant, Co-Applicant And Guarantor List
      this.sanctionDetailsObject.applicantList.filter( (element) => {
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
      this.vehicleDetailsArray = this.sanctionDetailsObject.vehicleDetails;
      this.loanApprovedDetails = this.sanctionDetailsObject.loanApprovedDetails;
      this.generalTermsAndConditions = this.sanctionDetailsObject.generalTermsAndConditions;
    });
  }

  //TO SHOW CONTENT OF SANCTION-DETAILS
  showSanctionDetailsPage() {
    this.isSanctionDetails = true;
    console.log("IsSanctionDetailsPage::", this.isSanctionDetails);
  }

  onNext() {
    
    if ( this.roleType == '1' ) { 
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/customer-feedback`]);
    }
    // tslint:disable-next-line: triple-equals
    else if (this.roleType == '2') {
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
    if (this.roleType == '2' || this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/negotiation`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/negotiation`]);
      }
  }

}
