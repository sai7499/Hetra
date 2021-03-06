import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DdeStoreService } from '@services/dde-store.service';
import { LoginStoreService } from '@services/login-store.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';

@Component({
  selector: 'app-fi-report',
  templateUrl: './fi-report.component.html',
  styleUrls: ['./fi-report.component.css']
})
export class FiReportComponent implements OnInit {
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
  leadData: {};
  isApplicantInd: boolean;

  constructor(
    private router: Router,
    private location: Location,
    private loginStoreService: LoginStoreService,
    private ddeStoreService: DdeStoreService,
    private activatedRoute: ActivatedRoute,
    private pdDataService: PdDataService) {
    this.leadId = Number(this.activatedRoute.snapshot.params.leadId);
    console.log(this.leadId);
    this.activatedRoute.firstChild.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
      this.version = String(value.version);
      console.log('applicant ID', value.applicantId);
      console.log('version in fi and pd report', this.version);
    });

  }
  ngOnInit() {

    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
    this.activatedRoute.firstChild.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
      console.log('applicant ID', value.applicantId);
    });

     const applicantType = this.pdDataService.getApplicantType();
     if(applicantType == 'Individual') {
      this.isApplicantInd= true;
     } else {
      this.isApplicantInd= false;
     }
  }

  // onNavigate(url: string) {

  //   if (url) {
  //     this.router.navigate([`/pages/fi-dashboard/${this.leadId}/${this.applicantId}/fi-report/${url}`]);
  //   }


  // }
  onNavigate(url: string) {
    console.log('version', this.version);
    if (this.router.url.includes('/fi-dashboard')) {

      if (this.version != 'undefined') {
        console.log('in defined progress bar routing', this.version);
        // tslint:disable-next-line: max-line-length
        this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${this.applicantId}/${url}/${this.version}`]);
        // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details/${version}`]);

        // } else if (this.version === undefined) {
      } else {
        console.log('in undefined progress bar routing', this.version);
        this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${this.applicantId}/${url}`]);
        // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/${url}/${this.version}`]);
      }
    } else if (this.router.url.includes('/dde')) {
      console.log('in defined progress bar routing', this.version);
      if (this.version != 'undefined') {
        this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${this.applicantId}/${url}/${this.version}`]);
        // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details/${version}`]);

        // } else if (this.version === undefined) {
      } else {
        console.log('in undefined progress bar routing', this.version);
        this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${this.applicantId}/${url}`]);
        // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/${url}/${this.version}`]);
      }


    }

  }
  getLocationIndex(url: string) {
    if (url.includes('fi-residence')) {
      return 0;
    } else if (url.includes('fi-business')) {
      return 1;
    }
  }
}

