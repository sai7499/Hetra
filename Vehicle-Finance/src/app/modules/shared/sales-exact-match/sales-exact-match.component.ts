import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SalesDedupeService } from '@services/sales-dedupe.service';
import { ApplicantService } from '@services/applicant.service';

@Component({
  templateUrl: './sales-exact-match.component.html',
  styleUrls: ['./sales-exact-match.component.css'],
})
export class SalesExactMatchComponent implements OnInit {
  isNewApplicant: boolean;
  isSelectedUcic = true;
  dedupeDetails;
  dedupeParameter;
  modalName: string;
  selectedApplicant: string;
  selectedDetails;
  isExactAvailable: boolean;
  constructor(
    private salesDedupeService: SalesDedupeService,
    private applicantService: ApplicantService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('details', this.salesDedupeService.getDedupeDetails());
    this.dedupeDetails = this.salesDedupeService.getDedupeDetails();
    this.dedupeParameter = this.salesDedupeService.getDedupeParameter();
    this.isExactAvailable = !!this.dedupeDetails.deduIndExctMatch;
    console.log(
      'this.isExactAvailable ',
      this.isExactAvailable,
      'this.isNewApplicant',
      this.isNewApplicant
    );
  }

  rejectLead() {}

  continueAsNewApplicant() {
    this.modalName = 'newLeadModal';
  }

  continueWithSelectedUCIC() {
    this.modalName = 'ucicModal2';
  }

  onProbableChange(event, value) {
    console.log('probable event', event, 'value', value);
    if (this.selectedDetails && value.ucic === this.selectedDetails.ucic) {
      if (!this.isExactAvailable) {
        this.isNewApplicant = false;
      }
      this.isSelectedUcic = true;
      this.selectedDetails = null;
      this.selectedApplicant = null;
      return;
    }
    this.selectedDetails = value;
    this.enableUcicButton();
  }

  onExactChange(event) {
    this.selectedDetails = event;
    this.enableUcicButton();
    console.log('exact event', event);
  }

  enableUcicButton() {
    this.isNewApplicant = true;
    this.isSelectedUcic = false;
  }

  callApiForNewApplicant() {
    const data = {
      ...this.dedupeParameter,
      ignoreProbablematch: true,
    };

    this.applicantService.checkSalesApplicantDedupe(data).subscribe((value) => {
      console.log('callApiForNewApplicant', value);
    });
  }

  callApiForSelectedUcic() {
    const leadId = this.dedupeParameter.leadId;
    const data = {
      ucic: Number(this.selectedDetails.ucic),
      leadId,
    };

    this.applicantService
      .checkSalesApplicantUcic(data)
      .subscribe((data: any) => {
        console.log('ucicservice', data);
        if (data.Error === '0') {
          const processVariables = data.ProcessVariables;
          this.router.navigateByUrl(
            `/pages/lead-section/${leadId}/co-applicant/${processVariables.applicantId}`
          );
        }
      });
  }
}
