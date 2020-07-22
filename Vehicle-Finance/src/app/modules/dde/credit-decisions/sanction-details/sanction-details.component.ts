import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SanctionDetailsService } from '@services/sanction-details.service';
import { UtilityService } from '@services/utility.service';

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
vehicleDetails: any = {};
loanApprovedDetails: any = {};
generalTermsAndConditions: string;

date: Date = new Date();
todayDate;

  constructor(
        private labelsData: LabelsService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private sanctionDetailsService: SanctionDetailsService,
        private utilityService: UtilityService,
  ) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getSanctionDetails();
    this.todayDate = this.utilityService.convertDateTimeTOUTC(this.date, 'DD/MM/YYYY')
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
    console.log("LEADID::::", this.leadId);
  }

  //FUNCTION FOR GET API of SANCTION-DETAILS
  getSanctionDetails() {
    const data = this.leadId;
    this.sanctionDetailsService.getSanctionDetails(data).subscribe((res: any) => {
      const response = res;
      this.sanctionDetailsObject = response.ProcessVariables;
      //Filter Out Applicant And Co-Applicant List
      this.sanctionDetailsObject.applicantList.filter( (element) => {
        if(element.applicantType === "Applicant") {
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
        }
        if(element.applicantType === "Co-Applicant") {
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
        }
      });
      this.vehicleDetails = this.sanctionDetailsObject.vehicleDetails;
      this.loanApprovedDetails = this.sanctionDetailsObject.loanApprovedDetails;
      this.generalTermsAndConditions = this.sanctionDetailsObject.generalTermsAndConditions;
    });    
  }

  onNext() {
    this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
  }

  onBack() {
    this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
  }

}
