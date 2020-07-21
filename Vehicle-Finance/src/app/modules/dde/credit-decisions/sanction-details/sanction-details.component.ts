import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SanctionDetailsService } from '@services/sanction-details.service';

@Component({
  selector: 'app-sanction-details',
  templateUrl: './sanction-details.component.html',
  styleUrls: ['./sanction-details.component.css']
})
export class SanctionDetailsComponent implements OnInit {

leadId;

labels: any = {};
sanctionDetailsObject: any = {};
applicantList: any;
vehicleDetails: any = {};
loanApprovedDetails: any = {};
generalTermsAndConditions: string;

  constructor(
        private labelsData: LabelsService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private sanctionDetailsService: SanctionDetailsService,
  ) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
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
    console.log("LEADID::::", this.leadId);
  }

  //FUNCTION FOR GET API of SANCTION-DETAILS
  getSanctionDetails() {
    const data = this.leadId;
    this.sanctionDetailsService.getSanctionDetails(data).subscribe((res: any) => {
      const response = res;
      this.sanctionDetailsObject = response.ProcessVariables;
      this.applicantList = this.sanctionDetailsObject.applicantList[0];
      this.vehicleDetails = this.sanctionDetailsObject.vehicleDetails;
      this.loanApprovedDetails = this.sanctionDetailsObject.loanApprovedDetails;
      const generalTermsAndConditions = this.sanctionDetailsObject.generalTermsAndConditions;
      this.generalTermsAndConditions = generalTermsAndConditions.replace(/<[^>]*>/g, '');
    });    
  }

  onNext() {
    this.router.navigate([`/pages/credit-decisions/${this.leadId}/customer-feedback`]);
  }

  onBack() {
    this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
  }

}
