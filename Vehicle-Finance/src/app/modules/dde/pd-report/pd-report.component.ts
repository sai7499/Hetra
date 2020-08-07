import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pd-report',
  templateUrl: './pd-report.component.html',
  styleUrls: ['./pd-report.component.css']
})
export class PdReportComponent implements OnInit {
  locationIndex = 0;
  pdDetail: any;
  leadId: any;
  applicantId: any;
  version: any;
  userId: any;
  roleName: any;
  roles: any = [];
  roleId: any;
  roleType: any;
  show: boolean;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;
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

  onNavigate(url: string) {

    if (this.version) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/${url}/${this.version}`]);
      // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details/${version}`]);

    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/${url}`]);
      // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/${url}/${this.version}`]);
    }
  }
  getLocationIndex(url: string) {
    if (url.includes('personal-details')) {
      return 0;
    } else if (url.includes('income-details')) {
      return 1;
    } else if (url.includes('reference-details')) {
      return 2;
    } else if (url.includes('other-details')) {
      return 3;
    }
  }

}


