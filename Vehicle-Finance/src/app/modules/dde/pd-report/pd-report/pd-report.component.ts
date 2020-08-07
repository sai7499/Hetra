import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { DdeStoreService } from '@services/dde-store.service';
import { LoginStoreService } from '@services/login-store.service';

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
    private loginStoreService: LoginStoreService,
    private personalDiscussion: PersonalDiscussionService,
    private ddeStoreService: DdeStoreService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
    this.activatedRoute.params.subscribe((value: any) => {
      console.log('params', value);
      this.leadId = Number(value.leadId);
      // if (!this.leadId) {
      //   const data: any = this.createLeadDataService.getLeadData();
      //   this.leadId = data.leadId;
      // }
      // this.leadStoreService.setLeadId(this.leadId);
      // console.log(
      //   ' this.createLeadDataService.getLeadData()',
      //   this.createLeadDataService.getLeadData()
      // );
  });
  this.activatedRoute.firstChild.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
      this.version = value.version;
      console.log('applicant ID', this.applicantId);
      console.log('version in fi and pd report', this.version);
  });
  }
  onNavigate(url: string) {

    if (this.version) {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/${url}/${this.version}`]);
      // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details/${version}`]);

    } else {
      this.router.navigate([`/pages/new-pd-dashboard/${this.leadId}/${this.applicantId}/${url}`]);
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


