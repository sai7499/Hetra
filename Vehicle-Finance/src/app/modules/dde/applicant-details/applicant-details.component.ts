import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css'],
})
export class ApplicantDetailsComponent implements OnInit {
  locationIndex = 0;
  applicantId: number;
  leadId: number;
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
  }

  navigatePage(url: string) {
    this.router.navigateByUrl(
      `pages/applicant-details/${this.leadId}/${url}/${this.applicantId}`
    );
  }

  getApplicantId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.firstChild.params.subscribe((value) => {
        const applicantId = value.applicantId;
        if (applicantId) {
          resolve(Number(applicantId));
        }
        resolve(null);
      });
    });
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((value) => {
        const leadId = value.leadId;
        if (leadId) {
          resolve(Number(leadId));
        }
        resolve(null);
      });
    });
  }

  getLocationIndex(url: string) {
    if (url.includes('basic-data')) {
      return 0;
    } else if (url.includes('identity-details')) {
      return 1;
    } else if (url.includes('address-details')) {
      return 2;
    } else if (url.includes('bank')) {
      return 3;
    } else if (url.includes('employment-details')) {
      return 4;
    } else if (url.includes('document-upload')) {
      return 5;
    }
  }
}
